import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useTopics, useLearning } from "../store/useLearning";
import { Page, PageIntro, MasteryDelta } from "../components/ui";
import { statusLabels } from "../services/mockData";
export default function ProgressPage() {
  const topics = useTopics();
  const history = useLearning((s) => s.history);
  const results = useLearning((s) => s.results);
  const [active, setActive] = useState<string | null>(null);
  const completed = topics.filter((t) => t.state === "completed").length;
  const selected = topics.find((t) => t.id === active);
  return (
    <Page>
      <PageIntro
        eyebrow="PROGRESS / THE BIGGER PICTURE"
        title={
          <>
            Understanding grows
            <br />
            <span className="soft-heading">through connections.</span>
          </>
        }
        description="See what is becoming stable, what needs another look, and how each session changes the picture."
      />
      <section className="mastery-plot">
        <div className="plot-heading">
          <div>
            <span className="eyebrow">TOPIC MASTERY</span>
            <h2>A pattern, not a finish line.</h2>
          </div>
          <span className="mono">DEMO ESTIMATES / 0–100%</span>
        </div>
        <div className="plot-area">
          <div className="plot-y">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>
          <div className="plot-canvas">
            <div className="plot-grid" />
            <svg
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polyline
                points={topics
                  .filter((t) => t.mastery > 0)
                  .map(
                    (t, i) =>
                      `${((i + 0.5) * 1000) / 6},${200 - t.mastery * 2}`,
                  )
                  .join(" ")}
                fill="none"
                stroke="var(--bone-300)"
                strokeWidth="2"
              />
            </svg>
            <div className="plot-columns">
              {topics.map((t) => (
                <button
                  key={t.id}
                  className={`plot-column ${t.state} ${active === t.id ? "selected" : ""}`}
                  onClick={() => setActive(active === t.id ? null : t.id)}
                  aria-label={`${t.title}: ${t.mastery ? `${t.mastery}% mastery` : "not assessed"}, ${statusLabels[t.state]}`}
                >
                  <span
                    className="plot-stem"
                    style={{ height: `${t.mastery}%` }}
                  >
                    <span className="plot-dot" />
                    <span className="plot-number">
                      {t.mastery ? `${t.mastery}%` : "—"}
                    </span>
                  </span>
                  <span className="plot-topic">
                    <span className="mono">{t.number}</span>
                    {t.short}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mobile-mastery-list">
          {topics.map((t) => (
            <button
              key={t.id}
              className={t.state}
              onClick={() => setActive(active === t.id ? null : t.id)}
              aria-pressed={active === t.id}
            >
              <span className="mono">{t.number}</span>
              <span className="mobile-mastery-topic">
                <strong>{t.short}</strong>
                <span className="mobile-mastery-track">
                  <span style={{ width: `${t.mastery}%` }} />
                </span>
                <small>{statusLabels[t.state]}</small>
              </span>
              <span className="mono">{t.mastery ? `${t.mastery}%` : "—"}</span>
            </button>
          ))}
        </div>
        <div className="plot-caption" aria-live="polite">
          {selected ? (
            <>
              <strong>{selected.title}</strong>
              <span>
                {statusLabels[selected.state]} ·{" "}
                {selected.mastery
                  ? `${selected.mastery}% demo mastery`
                  : "Not yet assessed"}
              </span>
              <Link to={`/app/topic/${selected.id}`} className="text-link">
                Open topic <ArrowUpRight size={15} />
              </Link>
            </>
          ) : (
            <>
              <span>
                <i className="legend-dot completed" />
                Mastered
              </span>
              <span>
                <i className="legend-dot review" />
                Review suggested
              </span>
              <span>
                <i className="legend-dot current" />
                In progress
              </span>
              <span className="muted">Select a topic to explore</span>
            </>
          )}
        </div>
      </section>
      <section className="course-completion">
        <div>
          <span className="eyebrow">COURSE COMPLETION</span>
          <h2>
            {completed}
            <span> / 6 topics mastered</span>
          </h2>
        </div>
        <div className="completion-track">
          <div
            role="progressbar"
            aria-label="Course completion"
            aria-valuenow={completed}
            aria-valuemax={6}
            aria-valuemin={0}
          >
            <span style={{ width: `${(completed / 6) * 100}%` }} />
          </div>
          <p>
            {6 - completed} topics still taking shape. Continue at your own
            pace.
          </p>
        </div>
      </section>
      <section className="history-section">
        <div className="section-label">
          <h2>Assessment history</h2>
          <span className="mono">{history.length} SESSIONS</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Topic</th>
              <th>Date</th>
              <th>Result</th>
              <th>Mastery change</th>
              <th>
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {[...history].reverse().map((h, i) => (
              <tr key={`${h.topicId}-${i}`}>
                <td data-label="Topic">
                  {topics.find((t) => t.id === h.topicId)?.title}
                </td>
                <td data-label="Date" className="mono">
                  {new Date(h.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </td>
                <td data-label="Result" className="mono">
                  {h.score}%
                </td>
                <td data-label="Mastery change">
                  <MasteryDelta before={h.before} after={h.after} />
                </td>
                <td>
                  <Link
                    className="text-link"
                    to={
                      results[h.topicId]
                        ? `/app/topic/${h.topicId}/review`
                        : `/app/topic/${h.topicId}`
                    }
                  >
                    {results[h.topicId] ? "Latest review" : "Revisit topic"}
                    <ArrowUpRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="revisit-section">
        <span className="eyebrow">A USEFUL RETURN</span>
        <h2>Worth another look.</h2>
        {topics
          .filter((t) => t.state === "review")
          .map((t) => (
            <Link to={`/app/topic/${t.id}`} key={t.id}>
              <div>
                <h3>{t.title}</h3>
                <p>
                  {results[t.id]
                    ? `Revisit ${results[t.id].gaps.join(", ").toLowerCase()} based on your latest responses.`
                    : "The example assessment shows uncertainty in how the center of rotation changes with the force system."}
                </p>
              </div>
              <ArrowUpRight size={22} />
            </Link>
          ))}
        {!topics.some((t) => t.state === "review") && (
          <p>
            No review is currently suggested. Your available topics are ready
            when you are.
          </p>
        )}
      </section>
    </Page>
  );
}
