import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { useLearning } from "../store/useLearning";
import { AuthProvider } from "./AuthProvider";
export function Providers({ children }: { children: ReactNode }) {
  const p = useLearning((s) => s.preferences);
  const [systemDark, setSystemDark] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  useEffect(() => {
    const q = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(q.matches);
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme =
      p.theme === "system" ? (systemDark ? "dark" : "light") : p.theme;
    document.documentElement.dataset.motion = p.reducedMotion
      ? "reduced"
      : "full";
    document.documentElement.dataset.contrast = p.contrast
      ? "enhanced"
      : "normal";
    document.documentElement.dataset.text = p.largeText ? "large" : "normal";
  }, [p, systemDark]);
  return (
    <MotionConfig reducedMotion={p.reducedMotion ? "always" : "user"}>
      <AuthProvider>{children}</AuthProvider>
    </MotionConfig>
  );
}
