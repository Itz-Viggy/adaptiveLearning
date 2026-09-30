import { useParams } from "react-router-dom";
import { useLearning, useTopics } from "../store/useLearning";
import {
  Page,
  PageIntro,
  ActionLink,
  EmptyState,
  MasteryDelta,
  ReasonBlock,
} from "../components/ui";
export default function ReviewPage() {
  const { topicId } = useParams();
  const topic = useTopics().find((t) => t.id === topicId);
  const result = useLearning((s) => s.results[topicId || ""]);
  if (!topic || !result)
    return (
      <Page>
        <EmptyState
          title="Understanding starts with a question."
          description="Complete this topic’s assessment to see explanations and a recommendation based on your answers."
          action={
            <ActionLink
              to={topic ? `/app/topic/${topic.id}/assessment` : "/app/path"}
            >
              {topic ? "Begin assessment" : "Learning path"}
            </ActionLink>
          }
        />
      </Page>
    );
  return (
    <Page className="review-page">
      <PageIntro
        eyebrow={`TOPIC ${topic.number} / ASSESSMENT REVIEW`}
        title={
          result.ready ? (
            <>
              The relationships
              <br />
              <span className="soft-heading">are coming together.</span>
            </>
          ) : (
            <>
              A useful pause.
              <br />
              <span className="soft-heading">A clearer next step.</span>
            </>
          )
        }
        description={
          result.ready
            ? "Your responses show a strong grasp of this topic. Take a moment to understand the reasoning behind each answer."
            : `Revisit ${result.gaps[0].toLowerCase()} before moving forward. The explanations below show where the reasoning changes.`
        }
      />
      <div className="result-strip">
        <div>
          <span className="eyebrow">ASSESSMENT RESULT</span>
          <strong className="result-score">
            {result.score}
            <small>%</small>
          </strong>
          <span>
            {result.correct} of {result.total} correct
          </span>
        </div>
        <div>
          <span className="eyebrow">DEMO MASTERY UPDATE</span>
          <MasteryDelta before={result.before} after={result.after} />
          <span>Prior mastery + assessment, averaged</span>
        </div>
        <div>
          <span className="eyebrow">TIME IN THIS SESSION</span>
          <strong className="result-time">
            {Math.floor(result.seconds / 60)}m {result.seconds % 60}s
          </strong>
          <span>No time limit</span>
        </div>
        <ActionLink to={`/app/topic/${topic.id}/summary`}>
          Your next step
        </ActionLink>
      </div>
      <div className="review-document">
        <div className="section-label">
          <span className="eyebrow">THE REASONING, QUESTION BY QUESTION</span>
          <span className="mono">{result.total} QUESTIONS</span>
        </div>
        {topic.questions.map((q, i) => {
          const correct = result.answers[i] === q.correct;
          return (
            <article
              key={q.prompt}
              className={`question-review ${correct ? "correct" : "incorrect"}`}
            >
              <div className="review-number mono">
                0{i + 1}
                <span>{correct ? "CORRECT" : "REVISIT"}</span>
              </div>
              <div>
                <h2>{q.prompt}</h2>
                <div className="review-answer">
                  <span className="eyebrow">YOUR ANSWER</span>
                  <p>{q.options[result.answers[i]] || "Not answered"}</p>
                </div>
                {!correct && (
                  <div className="review-answer">
                    <span className="eyebrow">CORRECT ANSWER</span>
                    <p>{q.options[q.correct]}</p>
                  </div>
                )}
                <div className="explanation">
                  <span className="eyebrow">WHY IT WORKS THIS WAY</span>
                  <p>{q.explanation}</p>
                </div>
                <a
                  className="text-link"
                  href={`/app/topic/${topic.id}#concept`}
                >
                  Review this concept: {q.concept} ↗
                </a>
              </div>
            </article>
          );
        })}
      </div>
      <ReasonBlock title="Why your path changed">
        {result.ready
          ? `You answered ${result.correct} of ${result.total} questions correctly, meeting the demonstration threshold of 75%. Your next step is to continue the course.`
          : `Your answers missed ${result.gaps.join(", ").toLowerCase()}. Because your result is below 75%, the demonstration model recommends reviewing this topic before continuing.`}
      </ReasonBlock>
      <div className="mt-8">
        <ActionLink to={`/app/topic/${topic.id}/summary`}>
          See your next step
        </ActionLink>
      </div>
    </Page>
  );
}
