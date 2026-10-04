import { createContext, useContext } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Me } from "../../server/contracts/index.ts";
export type AuthState = {
  session: Session | null;
  me: Me | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
  bootstrap: (session: Session) => Promise<Me>;
  signOut: () => Promise<void>;
};
export const AuthContext = createContext<AuthState | null>(null);
export function useAuth() {
  const state = useContext(AuthContext);
  if (!state) throw new Error("AuthProvider is required");
  return state;
}
