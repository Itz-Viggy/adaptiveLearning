import type { ReactNode, ButtonHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { useLearning } from "../store/useLearning";
import { ArrowRight, Check, LockKeyhole } from "lucide-react";
import type { TopicState } from "../services/mockData";

export function useMotionPreference() {
  const system = useReducedMotion();
  const preference = useLearning((s) => s.preferences.reducedMotion);
  return Boolean(system || preference);
}
export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "text";
}) {
  return (
    <button className={`button ${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
export function ActionLink({
  to,
  children,
  secondary = false,
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link className={`button ${secondary ? "secondary" : "primary"}`} to={to}>
      {children}
      <ArrowRight size={17} />
    </Link>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
  meta,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
}) {
  const reduced = useMotionPreference();
  return (
    <header className="page-intro">
      <motion.div
        className="eyebrow"
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {eyebrow}
      </motion.div>
      <div className="intro-row">
        <div>
          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {title}
          </motion.h1>
          {description && <p className="intro-description">{description}</p>}
          {meta && <div className="intro-meta">{meta}</div>}
        </div>
        {action}
      </div>
    </header>
  );
}
export function Page({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useMotionPreference();
  return (
    <motion.div
      className={`page ${className}`}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      {children}
    </motion.div>
  );
}
export function ReasonBlock({
  children,
  title = "Why this next step",
  tags,
}: {
  children: ReactNode;
  title?: string;
  tags?: string[];
}) {
  return (
    <div className="reason-block">
      <span className="eyebrow">{title}</span>
      <p>{children}</p>
      {tags && (
        <div className="tags">
          {tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}
export function MasteryDelta({
  before,
  after,
  large = false,
}: {
  before: number;
  after: number;
  large?: boolean;
}) {
  return (
    <span
      className={`mastery-delta ${large ? "large" : ""} ${after < before ? "declining" : ""}`}
    >
      <span>{before}%</span>
      <ArrowRight aria-label="to" size={large ? 36 : 16} />
      <strong>{after}%</strong>
    </span>
  );
}
export function TopicStatusMark({ state }: { state: TopicState }) {
  return (
    <span aria-hidden="true" className={`topic-node ${state}`}>
      {state === "completed" ? (
        <Check size={12} />
      ) : state === "locked" ? (
        <LockKeyhole size={11} />
      ) : state === "current" ? (
        <span />
      ) : null}
    </span>
  );
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <section className="empty-state">
      <span className="eyebrow">A place to begin</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </section>
  );
}
export function SkeletonBlock({ height = 100 }: { height?: number }) {
  return (
    <div className="skeleton" style={{ height }} aria-label="Loading content" />
  );
}
export function ForceDiagram({ compact = false }: { compact?: boolean }) {
  return (
    <svg
      className={`force-diagram ${compact ? "compact" : ""}`}
      viewBox="0 0 460 290"
      role="img"
      aria-label="Abstract force system: curved trajectories, anchor points, and opposing force vectors"
    >
      <defs>
        <marker
          id={compact ? "arrow-c" : "arrow"}
          markerWidth="7"
          markerHeight="7"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6" fill="none" stroke="currentColor" />
        </marker>
      </defs>
      <g className="diagram-grid" fill="none">
        <path
          d="M20 70H430M20 145H430M20 220H430M90 25V260M230 25V260M370 25V260"
          strokeDasharray="2 6"
        />
        <circle cx="230" cy="145" r="98" />
        <circle cx="230" cy="145" r="64" />
        <path d="M28 224Q150 269 225 144T428 60M47 74Q180 22 237 144T410 228" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M66 231Q183 261 228 146T401 54" />
        <path d="M102 208L228 146L363 112" strokeDasharray="4 5" />
        <path
          d="M228 146L330 96"
          markerEnd={`url(#${compact ? "arrow-c" : "arrow"})`}
        />
        <path
          d="M228 146L144 187"
          markerEnd={`url(#${compact ? "arrow-c" : "arrow"})`}
        />
      </g>
      <circle cx="228" cy="146" r="7" fill="var(--signal-orange)" />
      <circle cx="102" cy="208" r="4" fill="var(--signal-mint)" />
      <circle cx="363" cy="112" r="4" fill="var(--signal-mint)" />
      <g className="diagram-text" fill="currentColor">
        <text x="335" y="89">
          F₁
        </text>
        <text x="126" y="183">
          F₂
        </text>
        <text x="244" y="163">
          Cᵣ
        </text>
        <text x="36" y="278">
          FIG. 04 — EQUILIBRIUM / FORCE SYSTEM
        </text>
      </g>
    </svg>
  );
}
