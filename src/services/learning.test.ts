import test from "node:test";
import assert from "node:assert/strict";
import { scoreAssessment } from "./learning.ts";
import { topics } from "./mockData.ts";
const topic = topics.find((t) => t.id === "anchorage")!;
test("perfect answers average prior mastery and recommend continuing", () => {
  const r = scoreAssessment(topic.questions, { 0: 2, 1: 1, 2: 2, 3: 0 }, 58);
  assert.equal(r.score, 100);
  assert.equal(r.after, 79);
  assert.equal(r.ready, true);
  assert.deepEqual(r.gaps, []);
});
test("75 percent meets the continuation boundary", () => {
  const r = scoreAssessment(topic.questions, { 0: 2, 1: 1, 2: 2, 3: 1 }, 58);
  assert.equal(r.score, 75);
  assert.equal(r.after, 67);
  assert.equal(r.ready, true);
  assert.deepEqual(r.gaps, ["Line of action"]);
});
test("incorrect responses identify the actual concepts to review", () => {
  const r = scoreAssessment(topic.questions, { 0: 0, 1: 0, 2: 2, 3: 0 }, 58);
  assert.equal(r.score, 50);
  assert.equal(r.after, 54);
  assert.equal(r.ready, false);
  assert.deepEqual(r.gaps, [
    "Reciprocal forces",
    "Moment-to-force relationship",
  ]);
});
test("all topic question banks have valid answer indices", () => {
  for (const t of topics) {
    assert.ok(t.questions.length >= 3);
    for (const q of t.questions) {
      assert.ok(q.correct >= 0 && q.correct < q.options.length);
      assert.ok(q.explanation.length > 20);
    }
  }
});
