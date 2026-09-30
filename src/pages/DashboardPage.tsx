import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Headphones,
  Check,
  Clock3,
} from "lucide-react";
import { Page, PageIntro, ForceDiagram, ActionLink } from "../components/ui";
import { TopicPath } from "../components/TopicPath";
import { useLearning, useTopics } from "../store/useLearning";
export default function DashboardPage() {
  const topics = useTopics();
  const name = useLearning((s) => s.name);
  const completed = useLearning((s) => s.completed);
  const read = useLearning((s) => s.read);
  const results = useLearning((s) => s.results);
  const history = useLearning((s) => s.history);
  const deltaByTopic = Object.fromEntries(history.map(h => [h.topicId, h.after - h.before]));
  const navigate = useNavigate();
  const latest = Object.values(results).sort((a, b) =>
    b.date.localeCompare(a.date),
  )[0];
  const topic =
    (latest && !latest.ready
      ? topics.find((t) => t.id === latest.topicId)
      : undefined) ||
    topics.find((t) => t.state === "current") ||
    topics.find((t) => t.state === "available") ||
    topics.find((t) => t.state === "review") ||
    topics[3];
  const mastered = topics.filter((t) => t.state === "completed").length;
  const mastery = Math.round(
    topics.filter((t) => t.mastery > 0).reduce((n, t) => n + t.mastery, 0) /
      topics.filter((t) => t.mastery > 0).length,
  );
  const lessonDone = completed.includes(topic.id);
  return (
    <Page className="dashboard">
      <div className="dashboard-heading">
        <PageIntro
          eyebrow="CURRENT LEARNING STATE"
          title={
            <>
              A little further.
              <br />
              <span className="soft-heading">A lot clearer.</span>
            </>
          }
          description={
            <>
              Welcome back, {name.split(" ")[0]}. Your next point of
              understanding is within reach.
            </>
          }
        />
        <div className="mastery-gauge">
          <svg viewBox="0 0 170 170" aria-hidden="true">
            <circle cx="85" cy="85" r="73" className="gauge-track" />
            <circle
              cx="85"
              cy="85"
              r="73"
              className="gauge-value"
              strokeDasharray={`${mastery * 4.58} 458`}
            />
          </svg>
          <div>
            <strong>
              {mastery}
              <small>%</small>
            </strong>
            <span className="eyebrow">Course mastery</span>
          </div>
          <span className="gauge-note">
            DEMO ESTIMATE · {mastered}/6 MASTERED
          </span>
        </div>
      </div>
      <div className="dashboard-columns">
        <section className="continue-section">
          <div className="section-label">
            <span className="eyebrow">01 / PICK UP YOUR THREAD</span>
            <span className="live-tag">
              <i />{" "}
              {topic.state === "review"
                ? "REVIEW SUGGESTED"
                : topic.state === "completed"
                  ? "MASTERED"
                  : "IN PROGRESS"}
            </span>
          </div>
          <div className="learning-ticket">
            <div className="ticket-top">
              <span className="mono">TOPIC {topic.number} / 06</span>
              <span className="mono">
                <Headphones size={14} />
                {topic.duration} AUDIO
              </span>
            </div>
            <div className="ticket-content">
              <h2>
                {topic.title.split(" & ")[0]}
                {topic.title.includes(" & ") && (
                  <>
                    <br />& {topic.title.split(" & ")[1]}
                  </>
                )}
              </h2>
              <p>
                {topic.id === "anchorage" ? (
                  <>
                    Every force has a response.
                    <br />
                    Learn to make it a considered one.
                  </>
                ) : (
                  <>
                    Connect the principles.
                    <br />
                    Build a clearer understanding.
                  </>
                )}
              </p>
              <ForceDiagram />
            </div>
            <div className="ticket-bottom">
              <div className="ticket-steps">
                <span className={read.includes(topic.id) ? "done" : ""}>
                  {read.includes(topic.id) ? (
                    <Check size={13} />
                  ) : (
                    <span className="step-empty" />
                  )}{" "}
                  Topic material
                </span>
                <span className={lessonDone ? "done" : "active"}>
                  {lessonDone ? <Check size={13} /> : <Headphones size={13} />}{" "}
                  Audio lesson
                </span>
                <span className={results[topic.id] ? "done" : ""}>
                  {results[topic.id] ? (
                    <Check size={13} />
                  ) : (
                    <span className="step-empty" />
                  )}{" "}
                  Assessment
                </span>
              </div>
              <div className="ticket-action">
                <ActionLink to={`/app/topic/${topic.id}`}>
                  Continue topic
                </ActionLink>
                <span className="mono">
                  {lessonDone
                    ? "READY TO ASSESS"
                    : "MAKE SPACE FOR A SMALL DISCOVERY"}
                </span>
              </div>
            </div>
          </div>
          <div className="recommendation-note">
            <span className="signal-square" />
            <p>
              {latest && !latest.ready ? (
                <>
                  <strong>A useful concept to revisit.</strong> Your latest
                  responses suggest reviewing{" "}
                  {latest.gaps.join(", ").toLowerCase()} before continuing.
                </>
              ) : (
                <>
                  <strong>You’re ready for this.</strong>{" "}
                  {latest
                    ? "Your latest assessment meets the continuation threshold. The next topic gives these principles a new context."
                    : "Your foundation and force-system assessments support moving into anchorage. Keep an eye on centers of rotation as you go."}
                </>
              )}
            </p>
          </div>
        </section>
        <section className="trajectory-section">
          <div className="section-label">
            <span className="eyebrow">02 / YOUR TRAJECTORY</span>
            <span className="mono">6 TOPICS</span>
          </div>
          <div className="trajectory-header">
            <h2>
              A connected
              <br /> understanding.
            </h2>
            <p>
              Each concept gives the next
              <br /> one somewhere to begin.
            </p>
          </div>
          <TopicPath
            topics={topics}
            compact
            onSelect={(t) =>
              navigate("/app/path", { state: { selected: t.id } })
            }
          />
          <Link to="/app/path" className="text-link">
            Explore learning path <ArrowUpRight size={17} />
          </Link>
        </section>
      </div>
      <section className="mastery-strip">
        <div className="strip-heading">
          <div>
            <span className="eyebrow">03 / EVIDENCE OF PROGRESS</span>
            <h2>Understanding takes shape.</h2>
          </div>
          <Link className="text-link" to="/app/progress">
            View progress <ArrowRight size={16} />
          </Link>
        </div>
        <div className="strip-topics">
          {topics.slice(0, 4).map((t) => (
            <Link
              to={`/app/topic/${t.id}`}
              key={t.id}
              className={`strip-topic ${t.state}`}
            >
              <div className="strip-data">
                <span className="mono">{t.number}</span>
                <strong>
                  {t.mastery}
                  <small>%</small>
                </strong>
                <span className="strip-trend">
                  {results[t.id]
                    ? `${results[t.id].after - results[t.id].before >= 0 ? "+" : ""}${results[t.id].after - results[t.id].before}`
                    : t.state === "review"
                      ? "REVISIT"
                      : t.state === "current"
                        ? "LEARNING"
                        : `+${deltaByTopic[t.id] ?? 0}`}
                </span>
              </div>
              <div className="mini-track">
                <span style={{ width: `${t.mastery}%` }} />
              </div>
              <span>{t.short}</span>
            </Link>
          ))}
        </div>
        <p className="strip-footnote">
          <Clock3 size={13} /> Progress is a pattern, not a single score.{" "}
          <span>Illustrative course data</span>
        </p>
      </section>
    </Page>
  );
}
