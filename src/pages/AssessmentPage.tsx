import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useLearning, useTopics } from "../store/useLearning";
import { Brand } from "../components/AppShell";
import { AssessmentChoice } from "../components/AssessmentChoice";
import { SessionNotice } from "../components/SessionNotice";
import {
  EmptyState,
  ActionLink,
  Button,
  useMotionPreference,
} from "../components/ui";
export default function AssessmentPage() {
  const reduced = useMotionPreference();
  const { topicId } = useParams();
  const topic = useTopics().find((t) => t.id === topicId);
  const allAnswers = useLearning((s) => s.answers);
  const answers = allAnswers[topicId || ""] || {};
  const answer = useLearning((s) => s.answer);
  const submit = useLearning((s) => s.submit);
  const [index, setIndex] = useState(0);
  const [showMissing, setShowMissing] = useState(false);
  const start = useRef(Date.now());
  const heading = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (index > 0) heading.current?.focus();
  }, [index]);
  if (!topic || topic.state === "locked")
    return (
      <div className="page">
        <EmptyState
          title="Start with the topic."
          description="Open an available topic from your learning path."
          action={<ActionLink to="/app/path">Learning path</ActionLink>}
        />
      </div>
    );
  const question = topic.questions[index];
  const missing = topic.questions
    .map((_, i) => i)
    .filter((i) => answers[i] === undefined);
  function finish() {
    if (missing.length) {
      setShowMissing(true);
      return;
    }
    submit(topic!, Math.round((Date.now() - start.current) / 1000));
    navigate(`/app/topic/${topicId}/review`);
  }
  return (
    <div className="assessment-page">
      <header className="assessment-top">
        <Brand />
        <span className="mono">TOPIC ASSESSMENT</span>
        <Link to={`/app/topic/${topicId}`} className="exit-assessment">
          Save & exit <X size={18} />
        </Link>
      </header>
      <SessionNotice />
      <div className="assessment-context">
        <span className="eyebrow">
          TOPIC {topic.number} / {topic.title}
        </span>
        <span className="mono">
          {index + 1} OF {topic.questions.length}
        </span>
      </div>
      <div
        className="assessment-progress"
        role="progressbar"
        aria-label="Assessment progress"
        aria-valuemin={0}
        aria-valuemax={topic.questions.length}
        aria-valuenow={index + 1}
      >
        <span
          style={{ width: `${((index + 1) / topic.questions.length) * 100}%` }}
        />
      </div>
      <main className="question-surface">
        <div className="question-topline">
          <span className="eyebrow">A MOMENT TO THINK</span>
          <span className="mono">SINGLE BEST ANSWER</span>
        </div>
        <motion.div
          key={index}
          initial={reduced ? false : { opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          <span className="question-number">
            0{index + 1}
            <span> / </span>
          </span>
          <h1 ref={heading} tabIndex={-1}>
            {question.prompt}
          </h1>
          <p className="question-helper">
            Choose the answer that best describes the relationship.
          </p>
          <fieldset className="answer-list">
            <legend className="sr-only">Answer options</legend>
            {question.options.map((text, i) => (
              <AssessmentChoice
                key={i}
                index={i}
                text={text}
                selected={answers[index] === i}
                onSelect={() => answer(topic.id, index, i)}
              />
            ))}
          </fieldset>
        </motion.div>
        {showMissing && missing.length > 0 && (
          <div className="unanswered" role="alert">
            <p>
              {missing.length}{" "}
              {missing.length === 1 ? "question is" : "questions are"} still
              unanswered. Take the time you need.
            </p>
            <button
              className="text-link"
              onClick={() => {
                setIndex(missing[0]);
                setShowMissing(false);
              }}
            >
              Return to first unanswered question <ArrowRight size={16} />
            </button>
          </div>
        )}
        <div className="question-navigation">
          <Button
            variant="text"
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
          >
            <ArrowLeft size={17} /> Back
          </Button>
          <span className="mono">
            {Object.keys(answers).length} / {topic.questions.length} ANSWERED
          </span>
          {index < topic.questions.length - 1 ? (
            <Button onClick={() => setIndex(index + 1)}>
              Next question <ArrowRight size={17} />
            </Button>
          ) : (
            <Button onClick={finish}>
              Submit assessment <ArrowRight size={17} />
            </Button>
          )}
        </div>
      </main>
      <p className="assessment-footnote">
        Your responses stay on this device as you go. There’s no time limit.
      </p>
    </div>
  );
}
