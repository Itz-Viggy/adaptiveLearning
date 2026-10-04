import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Me } from "../../server/contracts/index.ts";
import { AuthContext } from "./auth-context";
import { getSession, signOut, subscribeToAuth } from "../services/auth";
import { ApiClientError, onApiSessionExpired } from "../services/api";
import { meQuery, queryClient } from "../services/queries";
import { useLearning } from "../store/useLearning";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const subject = useRef<string | null>(null);
  const generation = useRef(0);
  const mounted = useRef(true);
  const pending = useRef<{ token: string; promise: Promise<Me> } | null>(null);
  const loadedIdentity = useRef<Me | null>(null);

  const clearLearner = useCallback(() => {
    document.querySelectorAll("audio").forEach((audio) => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    });
    void queryClient.cancelQueries();
    queryClient.clear();
    useLearning.getState().clearLearner();
    loadedIdentity.current = null;
    setMe(null);
  }, []);

  const bootstrap = useCallback(
    (next: Session): Promise<Me> => {
      if (pending.current?.token === next.access_token)
        return pending.current.promise;
      const run = async (): Promise<Me> => {
        const revision = ++generation.current;
        if (subject.current !== next.user.id) {
          clearLearner();
          subject.current = next.user.id;
        }
        setSession(next);
        setLoading(true);
        setError(null);
        try {
          const identity = await queryClient.fetchQuery({
            ...meQuery(next.user.id),
            staleTime: 0,
          });
          if (
            identity.userId !== next.user.id ||
            revision !== generation.current ||
            !mounted.current
          )
            throw new Error("Session changed. Please try again.");
          setMe(identity);
          loadedIdentity.current = identity;
          useLearning
            .getState()
            .setIdentity(identity.displayName, identity.email);
          useLearning.getState().applyPreferences(identity.preferences);
          return identity;
        } catch (failure) {
          if (revision === generation.current && mounted.current) {
            if (failure instanceof ApiClientError && failure.status === 401) {
              clearLearner();
              setSession(null);
              subject.current = null;
            } else
              setError("Your workspace could not be loaded. Please retry.");
          }
          throw failure;
        } finally {
          if (revision === generation.current && mounted.current)
            setLoading(false);
        }
      };
      const promise = run();
      pending.current = { token: next.access_token, promise };
      void promise
        .finally(() => {
          if (pending.current?.promise === promise) pending.current = null;
        })
        .catch(() => {});
      return promise;
    },
    [clearLearner],
  );

  const acceptSession = useCallback(
    (next: Session | null) => {
      if (next) {
        if (loadedIdentity.current?.userId === next.user.id) setSession(next);
        else void bootstrap(next).catch(() => {});
      } else {
        ++generation.current;
        pending.current = null;
        clearLearner();
        subject.current = null;
        setSession(null);
        setLoading(false);
        setError(null);
      }
    },
    [bootstrap, clearLearner],
  );

  useEffect(() => {
    mounted.current = true;
    let active = true;
    // Discard old demo credentials/evidence. Only validated display preferences are migrated.
    try {
      sessionStorage.removeItem("vector-session");
    } catch {
      /* Storage may be unavailable. */
    }
    const unsubscribe = subscribeToAuth((next) => {
      queueMicrotask(() => {
        if (active) acceptSession(next);
      });
    });
    const stopExpired = onApiSessionExpired(() => {
      if (active) acceptSession(null);
    });
    // With no configured provider, render the existing login with a configuration message.
    void getSession()
      .then((next) => {
        if (active) acceptSession(next);
      })
      .catch(() => {
        if (active) {
          setLoading(false);
          setError("Could not restore your session. Please sign in again.");
        }
      });
    return () => {
      active = false;
      mounted.current = false;
      unsubscribe();
      stopExpired();
    };
  }, [acceptSession]);

  const retry = useCallback(() => {
    if (session) void bootstrap(session).catch(() => {});
    else acceptSession(null);
  }, [session, bootstrap, acceptSession]);
  const endSession = useCallback(async () => {
    try {
      await signOut();
      acceptSession(null);
    } catch (failure) {
      // Current SDK clears local session even if provider revocation fails.
      // Respect that state and show the failure on login instead of retaining an authorized UI.
      if (!(await getSession())) {
        acceptSession(null);
        setError(
          "Signed out on this device. The authentication service could not confirm sign-out.",
        );
      }
      throw failure;
    }
  }, [acceptSession]);
  return (
    <AuthContext.Provider
      value={{
        session,
        me,
        loading,
        error,
        retry,
        bootstrap,
        signOut: endSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
