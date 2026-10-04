import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./auth-context";
import { safeReturnPath } from "../services/returnPath";
import { Page, EmptyState, Button, SkeletonBlock } from "../components/ui";

export function RequireAuth() {
  const { session, me, loading, error, retry, signOut } = useAuth();
  const location = useLocation();
  if (loading)
    return (
      <div className="page" role="status" aria-busy="true">
        <span className="sr-only">Restoring your workspace</span>
        <SkeletonBlock height={180} />
      </div>
    );
  if (!session)
    return (
      <Navigate
        to="/login"
        replace
        state={{
          returnTo: safeReturnPath(
            `${location.pathname}${location.search}${location.hash}`,
          ),
        }}
      />
    );
  if (error || !me)
    return (
      <Page>
        <EmptyState
          title="Your workspace is temporarily unavailable."
          description={error || "Please retry loading your profile."}
          action={
            <>
              <Button onClick={retry}>Retry</Button>
              <Button
                variant="text"
                onClick={() => void signOut().catch(() => {})}
              >
                Sign out
              </Button>
            </>
          }
        />
      </Page>
    );
  return <Outlet key={me.userId} />;
}
