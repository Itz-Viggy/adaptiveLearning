import type { Question } from "./mockData";
export function scoreAssessment(
  questions: Question[],
  answers: Record<number, number>,
  before: number,
) {
  const correct = questions.filter((q, i) => answers[i] === q.correct).length;
  const score = Math.round((correct / questions.length) * 100);
  // Transparent demonstration model: equally weight prior mastery and latest assessment.
  const after = Math.round((before + score) / 2);
  const gaps = questions
    .filter((q, i) => answers[i] !== q.correct)
    .map((q) => q.concept);
  return {
    score,
    before,
    after,
    gaps,
    correct,
    total: questions.length,
    ready: score >= 75,
  };
}
