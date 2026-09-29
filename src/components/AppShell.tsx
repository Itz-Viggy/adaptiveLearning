import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Home,
  Route,
  ChartNoAxesCombined,
  Settings,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowUpRight,
  Accessibility,
  UserRound,
  ChevronRight,
} from "lucide-react";
import { useLearning, useStorageStatus } from "../store/useLearning";
import { SessionNotice } from "./SessionNotice";
const navigation = [
  { to: "/app", label: "Home", mobile: "Home", icon: Home, end: true },
  { to: "/app/path", label: "Learning path", mobile: "Learn", icon: Route },
  {
    to: "/app/progress",
    label: "Progress",
    mobile: "Progress",
    icon: ChartNoAxesCombined,
  },
  { to: "/app/settings", label: "Settings", mobile: "Profile", icon: Settings },
];
export function Brand() {
  return (
    <Link to="/app" className="brand" aria-label="Vector home">
      <svg viewBox="0 0 36 36" aria-hidden="true">
        <path
          d="M4 7L18 32L32 7M12 7L18 19L24 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
        />
      </svg>
      <span>
        vector<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const storageError = useStorageStatus((s) => s.error);
  const name = useLearning((s) => s.name);
  const theme = useLearning((s) => s.preferences.theme);
  const preference = useLearning((s) => s.preference);
  const location = useLocation();
  const section = location.pathname.includes("/topic/")
    ? "Topic workspace"
    : location.pathname.endsWith("/path")
      ? "Learning path"
      : location.pathname.endsWith("/progress")
        ? "Progress"
        : location.pathname.endsWith("/settings")
          ? "Settings"
          : "Overview";
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
      return;
    }
    let frame = 0;
    let attempts = 0;
    const findTarget = () => {
      const target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView({ block: "start" });
      else if (attempts++ < 60) frame = requestAnimationFrame(findTarget);
    };
    frame = requestAnimationFrame(findTarget);
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);
  return (
    <div className={`app-shell ${collapsed ? "rail-collapsed" : ""}`}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <aside className="desktop-rail">
        <Brand />
        <div className="rail-course">
          <span className="eyebrow">Your learning space</span>
          <p>
            Orthodontic
            <br />
            Biomechanics
          </p>
          <span className="course-code">ORTH 402 · FALL 2026</span>
        </div>
        <nav aria-label="Main navigation">
          {navigation.map(({ to, label, icon: Icon, end }, i) => (
            <NavLink
              end={end}
              title={collapsed ? label : undefined}
              to={to}
              key={to}
              className={({ isActive }) =>
                `rail-link ${i === 3 ? "settings-link" : ""} ${isActive || (to === "/app/path" && section === "Topic workspace") ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
              {i === 1 && <small>06</small>}
            </NavLink>
          ))}
        </nav>
        <div className="rail-bottom">
          <div className="rail-note">
            <span className="small-rule" />
            <p>
              A little more clarity.
              <br />
              One topic at a time.
            </p>
          </div>
          <div className="rail-tools">
            <button
              aria-label="Toggle dark study mode"
              onClick={() =>
                preference("theme", theme === "dark" ? "light" : "dark")
              }
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              <span>Study mode</span>
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              aria-label={
                collapsed ? "Expand navigation" : "Collapse navigation"
              }
            >
              {collapsed ? (
                <PanelLeftOpen size={18} />
              ) : (
                <PanelLeftClose size={18} />
              )}
            </button>
          </div>
          <Link to="/app/settings" className="student">
            <span className="avatar">
              {name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </span>
            <span>
              <strong>{name}</strong>
              <small>Student workspace</small>
            </span>
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </aside>
      <div className="app-main">
        <header className="utility-bar">
          <div className="breadcrumb">
            <span>ORTH 402</span>
            <ChevronRight size={13} />
            <span>{section}</span>
          </div>
          <div className="utility-actions">
            <span className="save-state">
              <i />
              {storageError ? "Session in memory" : "Saved on this device"}
            </span>
            <Link
              to="/app/settings#accessibility"
              aria-label="Accessibility settings"
            >
              <Accessibility size={19} />
            </Link>
            <Link
              className="top-avatar"
              to="/app/settings"
              aria-label="Your profile"
            >
              <UserRound size={18} />
            </Link>
          </div>
        </header>
        <SessionNotice />
        <main id="main" tabIndex={-1} className="app-background">
          <svg
            className="background-motif"
            viewBox="0 0 1000 600"
            aria-hidden="true"
          >
            <g fill="none" stroke="currentColor">
              <path d="M200 -90Q960 20 970 520M410 -90Q990 20 940 540M590 -90Q1100 90 870 540" />
              <circle cx="880" cy="270" r="125" />
              <path d="M700 270h340M880 60v420" strokeDasharray="4 12" />
            </g>
          </svg>
          <Outlet />
          <footer className="page-footer">
            <span>VECTOR / LEARNING IN MOTION</span>
            <span>
              ORTH 402 <span className="footer-dot">·</span> Demo workspace
            </span>
          </footer>
        </main>
      </div>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navigation.map(({ to, mobile, icon: Icon, end }) => (
          <NavLink
            to={to}
            end={end}
            key={to}
            className={({ isActive }) =>
              isActive || (to === "/app/path" && section === "Topic workspace")
                ? "active"
                : ""
            }
          >
            <Icon size={20} />
            <span>{mobile}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
