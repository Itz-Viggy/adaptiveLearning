import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Brand } from "../components/AppShell";
import { ForceDiagram, useMotionPreference } from "../components/ui";
import { useLearning } from "../store/useLearning";
export default function LoginPage() {
  const reduced = useMotionPreference();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const setIdentity = useLearning((s) => s.setIdentity);
  const navigate = useNavigate();
  return (
    <div className="login-page">
      <section className="login-art">
        <Brand />
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">A DIFFERENT KIND OF UNDERSTANDING</span>
          <h1>
            Learn the concept.
            <br />
            Test the reasoning.
            <br />
            <span>
              Adapt the
              <br /> next step.
            </span>
          </h1>
        </motion.div>
        <ForceDiagram />
        <div className="login-course">
          <span className="mono">ORTH 402 / FALL 2026</span>
          <p>Orthodontic Biomechanics</p>
        </div>
      </section>
      <motion.section
        className="login-form-panel"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12 }}
      >
        <div className="login-mark">
          <span className="signal-square" />
          <span className="mono">YOUR STUDENT WORKSPACE</span>
        </div>
        <div>
          <span className="eyebrow">WELCOME TO VECTOR</span>
          <h2>
            Sign in.
            <br />
            Find your focus.
          </h2>
          <p>
            A considered space for learning,
            <br />
            one connection at a time.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIdentity(name.trim() || "Alex Morgan", email.trim());
              sessionStorage.setItem("vector-session", "demo");
              navigate("/app");
            }}
          >
            <label htmlFor="name">Your name</label>
            <input
              id="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Morgan"
              required
              maxLength={80}
            />
            <label htmlFor="email">Institutional email</label>
            <input
              id="email"
              autoComplete="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              required
            />
            <button className="button primary" type="submit">
              Enter demo workspace <ArrowRight size={18} />
            </button>
          </form>
          <div className="login-privacy">
            <span className="eyebrow">A NOTE ABOUT THIS PREVIEW</span>
            <p>
              No password required. Your name and progress stay in this browser.
              Institutional sign-in will be connected later.
            </p>
          </div>
        </div>
        <span className="mono login-footer">VECTOR / LEARNING IN MOTION</span>
      </motion.section>
    </div>
  );
}
