import { useEffect, useState } from "react";
import { useLearning, useStorageStatus } from "../store/useLearning";
export function SessionNotice() {
  const [offline, setOffline] = useState(!navigator.onLine);
  const storageError = useStorageStatus((s) => s.error);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return (
    <>
      {offline && (
        <div className="notice" role="status">
          You’re offline. Your open session is still available; some content may
          need a connection.
        </div>
      )}
      {storageError && (
        <div className="notice" role="alert">
          Your answers are still in this session, but this browser could not
          save them. Keep this tab open and allow site storage.
          <button
            className="text-link"
            onClick={() => useLearning.setState({})}
          >
            Retry saving
          </button>
        </div>
      )}
    </>
  );
}
