export type TopicState =
  "completed" | "review" | "current" | "available" | "locked";
export type Question = {
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
  concept: string;
};
export type Topic = {
  id: string;
  number: string;
  title: string;
  short: string;
  state: TopicState;
  mastery: number;
  duration: string;
  overview: string;
  concept: string;
  context: string;
  equation: string;
  misconception: string;
  objectives: string[];
  questions: Question[];
};
const q = (
  prompt: string,
  options: string[],
  correct: number,
  explanation: string,
  concept: string,
): Question => ({ prompt, options, correct, explanation, concept });
export const topics: Topic[] = [
  {
    id: "foundations",
    number: "01",
    title: "Foundations of Biomechanics",
    short: "Foundations",
    state: "completed",
    mastery: 92,
    duration: "1–2 min",
    overview:
      "Every orthodontic movement begins with a force system. Learn to describe forces, moments, and the biological response as a connected mechanical model.",
    concept:
      "A force has a magnitude, direction, and point of application. A moment describes the tendency of a force to rotate a body around a reference point.",
    context:
      "A useful model separates the applied force system from the tissue response. It helps explain movement without assuming that a larger force always produces a better result.",
    equation: "M = F × d",
    misconception:
      "Increasing force does not guarantee faster or more controlled movement.",
    objectives: [
      "Describe a force as a vector",
      "Distinguish force from moment",
      "Connect mechanical models to tissue response",
    ],
    questions: [
      q(
        "Which description fully defines a force?",
        [
          "Magnitude only",
          "Magnitude, direction, and point of application",
          "Direction and treatment duration",
          "Point of application only",
        ],
        1,
        "A force is a vector. Its effect depends on magnitude, direction, and where it acts.",
        "Force vectors",
      ),
      q(
        "What does a moment describe?",
        [
          "A tendency to rotate",
          "A length of treatment",
          "A material property",
          "A unit of displacement",
        ],
        0,
        "A moment describes the rotational effect of a force about a reference point.",
        "Moments",
      ),
      q(
        "If the perpendicular distance doubles at constant force, the moment…",
        ["Halves", "Stays unchanged", "Doubles", "Becomes zero"],
        2,
        "Moment is force multiplied by perpendicular distance. Doubling distance doubles the moment.",
        "Moment calculation",
      ),
    ],
  },
  {
    id: "force-moment",
    number: "02",
    title: "Force & Moment Relationships",
    short: "Force & moment",
    state: "completed",
    mastery: 86,
    duration: "1–2 min",
    overview:
      "Understand how the line of action and distance from a reference point determine the rotational effect of a force.",
    concept:
      "The moment magnitude is the force magnitude multiplied by the perpendicular distance to its line of action. A couple is produced by two equal, opposite, non-collinear forces.",
    context:
      "A force applied at a bracket can create a moment about the center of resistance. A counteracting couple changes the net rotational effect.",
    equation: "M = F · d⊥",
    misconception:
      "The distance used in a moment calculation is perpendicular to the line of action, not simply the distance to the bracket.",
    objectives: [
      "Identify the perpendicular moment arm",
      "Calculate a simple moment",
      "Recognize a force couple",
    ],
    questions: [
      q(
        "A 2 N force acts at a perpendicular distance of 5 mm. What is the moment?",
        ["2 N·mm", "2.5 N·mm", "7 N·mm", "10 N·mm"],
        3,
        "Multiply 2 N by 5 mm to obtain 10 N·mm.",
        "Moment calculation",
      ),
      q(
        "A pure couple consists of…",
        [
          "Two equal opposite non-collinear forces",
          "Two forces in the same direction",
          "A single force",
          "Two collinear opposite forces",
        ],
        0,
        "Equal and opposite forces with separated lines of action create a couple with no net force.",
        "Force couples",
      ),
      q(
        "Which distance is used when calculating a moment?",
        [
          "Distance along the archwire",
          "Perpendicular distance to the line of action",
          "Total root length",
          "Bracket width",
        ],
        1,
        "The moment arm is measured perpendicular to the force line of action.",
        "Moment arm",
      ),
    ],
  },
  {
    id: "tooth-movement",
    number: "03",
    title: "Centers of Resistance & Rotation",
    short: "Centers of resistance",
    state: "review",
    mastery: 64,
    duration: "1–2 min",
    overview:
      "Separate a property of the supported tooth from the point around which it moves. Use these concepts to interpret tipping and translation.",
    concept:
      "The center of resistance depends on tooth geometry and periodontal support. The center of rotation depends on the applied force system.",
    context:
      "With an idealized single force passing through the center of resistance, the tooth translates. When the force line misses it, a rotational effect is introduced.",
    equation: "Translation → net M at Cᵣ = 0",
    misconception:
      "The center of resistance and center of rotation are not interchangeable terms.",
    objectives: [
      "Distinguish the two centers",
      "Explain translation in an idealized model",
      "Interpret the effect of changing support",
    ],
    questions: [
      q(
        "Which center changes with the applied force system?",
        [
          "Center of resistance only",
          "Center of rotation",
          "Neither center",
          "Both are always fixed",
        ],
        1,
        "The center of rotation reflects the resulting movement and varies with the force system.",
        "Center of rotation",
      ),
      q(
        "An idealized force through the center of resistance produces…",
        ["Pure rotation", "Uncontrolled tipping", "Translation", "No movement"],
        2,
        "A force through the center of resistance creates no moment about that point, supporting translation in the idealized model.",
        "Translation",
      ),
      q(
        "The center of resistance depends on…",
        [
          "Only bracket position",
          "Only force magnitude",
          "Tooth geometry and periodontal support",
          "The duration of the appointment",
        ],
        2,
        "Geometry and support influence the location of the center of resistance.",
        "Periodontal support",
      ),
    ],
  },
  {
    id: "anchorage",
    number: "04",
    title: "Anchorage & Force Systems",
    short: "Anchorage",
    state: "current",
    mastery: 58,
    duration: "1–2 min",
    overview:
      "Control the movement you want. Understand the reaction you create. Explore how anchorage and balanced force systems turn mechanical principles into deliberate tooth movement.",
    concept:
      "Anchorage is resistance to unwanted movement. Every applied force has an equal and opposite reaction, so an active unit and its anchorage unit must be considered together.",
    context:
      "In an idealized two-unit system, a force moving the active unit creates a reciprocal force on the anchorage unit. Distributing that reaction across a larger support unit can help limit unwanted displacement.",
    equation: "ΣF = 0  ·  M = F × d",
    misconception:
      "An anchorage unit is not perfectly stationary. Its response depends on the force system and the support available.",
    objectives: [
      "Identify active and anchorage units",
      "Explain reciprocal force systems",
      "Relate a moment to its force and lever arm",
    ],
    questions: [
      q(
        "A retraction force is applied to an active tooth unit. What happens at the anchorage unit?",
        [
          "No force acts on it",
          "An equal force acts in the same direction",
          "An equal and opposite reaction force acts on it",
          "A reaction occurs only after movement starts",
        ],
        2,
        "Newton’s third law describes an equal and opposite reaction. Anchorage planning accounts for this reaction rather than assuming the support unit is motionless.",
        "Reciprocal forces",
      ),
      q(
        "A 1.5 N force acts 8 mm from the center of resistance. What moment does it create?",
        ["5.3 N·mm", "12 N·mm", "9.5 N·mm", "0.19 N·mm"],
        1,
        "M = F × d. A force of 1.5 N at a perpendicular distance of 8 mm creates a moment of 12 N·mm.",
        "Moment-to-force relationship",
      ),
      q(
        "Which best describes the purpose of anchorage?",
        [
          "Eliminating all reaction forces",
          "Maximizing force magnitude",
          "Resistance to unwanted movement",
          "Ensuring every tooth moves equally",
        ],
        2,
        "Anchorage controls unwanted displacement. Reaction forces still exist and must be managed within the overall force system.",
        "Anchorage control",
      ),
      q(
        "In an idealized model, a force passes directly through the center of resistance. What is its moment about that center?",
        [
          "Zero",
          "Equal to the force magnitude",
          "Always clockwise",
          "Dependent only on bracket width",
        ],
        0,
        "The perpendicular moment arm is zero. The force therefore creates no moment about the center of resistance.",
        "Line of action",
      ),
    ],
  },
  {
    id: "controlled-movement",
    number: "05",
    title: "Controlled Tooth Movement",
    short: "Controlled movement",
    state: "available",
    mastery: 0,
    duration: "1–2 min",
    overview:
      "Bring forces and couples together to explain tipping, translation, and root movement in an idealized biomechanical model.",
    concept:
      "The moment-to-force ratio helps describe how a force and an applied couple combine. Movement also depends on anatomy and support, so one ratio is not universal.",
    context:
      "Adding a counteracting couple to a force system can change the center of rotation. This is the basis for distinguishing different movement patterns.",
    equation: "M / F → movement pattern",
    misconception:
      "A single moment-to-force ratio is not a universal prescription for every tooth and support condition.",
    objectives: [
      "Compare tipping and translation",
      "Describe the role of an applied couple",
      "Explain the limits of an idealized model",
    ],
    questions: [
      q(
        "What helps change the rotational effect of a single force?",
        [
          "Adding an appropriate couple",
          "Changing the topic name",
          "Ignoring periodontal support",
          "Increasing duration alone",
        ],
        0,
        "An applied couple can counteract or modify the moment produced by a force.",
        "Applied couples",
      ),
      q(
        "Is one moment-to-force ratio universal for every tooth?",
        [
          "Yes, always",
          "No, anatomy and support matter",
          "Only for every molar",
          "Only at high force",
        ],
        1,
        "The mechanical response depends on tooth geometry, support, and the full force system.",
        "Model limitations",
      ),
      q(
        "Translation means that, in the idealized model…",
        [
          "Only the root moves",
          "Only the crown moves",
          "All points move equally in the same direction",
          "The tooth rotates around the bracket",
        ],
        2,
        "During translation, all points in a rigid body undergo equal displacement in the same direction.",
        "Translation",
      ),
    ],
  },
  {
    id: "clinical-integration",
    number: "06",
    title: "Integrating the Force System",
    short: "Integration",
    state: "locked",
    mastery: 0,
    duration: "1–2 min",
    overview:
      "Read an entire force system as a connected whole, identifying intended effects, reciprocal effects, and the assumptions in your model.",
    concept:
      "A force diagram should include every relevant force and couple. Check both translational and rotational effects before interpreting the likely movement pattern.",
    context:
      "Start by defining the system boundary. Distinguish the active unit from the support unit and account for reactions across the boundary.",
    equation: "ΣF = 0  ·  ΣM = 0",
    misconception:
      "A diagram of the active tooth alone does not capture every effect on the anchorage unit.",
    objectives: [
      "Draw a complete system boundary",
      "Account for reciprocal effects",
      "State assumptions before interpreting movement",
    ],
    questions: [
      q(
        "What should you define before analyzing a force system?",
        [
          "A preferred answer",
          "The system boundary",
          "Only the largest force",
          "The appointment length",
        ],
        1,
        "A clear boundary identifies which forces and moments are external to the system.",
        "System boundary",
      ),
      q(
        "A complete analysis should account for…",
        [
          "Forces only",
          "Moments only",
          "Forces, couples, and reaction effects",
          "Only intended movements",
        ],
        2,
        "Both translation and rotation, including reactions, are needed to interpret the complete system.",
        "System analysis",
      ),
      q(
        "Why state model assumptions?",
        [
          "To avoid calculation",
          "To make the prediction universal",
          "To clarify the limits of interpretation",
          "To remove reaction forces",
        ],
        2,
        "Assumptions explain the conditions in which a simplified prediction is useful.",
        "Model limitations",
      ),
    ],
  },
];
export const initialHistory = [
  {
    topicId: "foundations",
    date: "2026-09-23",
    score: 100,
    before: 84,
    after: 92,
  },
  {
    topicId: "force-moment",
    date: "2026-09-24",
    score: 100,
    before: 72,
    after: 86,
  },
  {
    topicId: "tooth-movement",
    date: "2026-09-25",
    score: 67,
    before: 61,
    after: 64,
  },
];
export const statusLabels: Record<TopicState, string> = {
  completed: "Mastered",
  review: "Review suggested",
  current: "In progress",
  available: "Up next",
  locked: "Prerequisite required",
};
export function narration(topic: Topic) {
  return `${topic.title}. ${topic.overview} Our learning objectives are: ${topic.objectives.join(". ")}. The core concept. ${topic.concept} Consider the biomechanics. ${topic.context} A common misconception. ${topic.misconception} In summary. ${topic.concept} Take a moment to explain this relationship in your own words. When you are ready, use the topic assessment to check your understanding.`;
}
