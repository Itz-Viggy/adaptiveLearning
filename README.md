# Vector — Adaptive Learning

A React + TypeScript + Tailwind frontend for topic-based orthodontic biomechanics learning, implemented from `DesignFrontend.md`.

## Run

Requires Node.js 22.18+ (24 recommended) and pnpm or npm.

```sh
pnpm install
pnpm dev
```

Open the URL printed by Vite. `/` opens the demo dashboard; `/login` opens the entry experience. With npm, use `npm install` and `npm run dev` instead.

```sh
pnpm build       # TypeScript checks and production bundle
pnpm lint        # ESLint, including hooks and browser test scripts
pnpm test        # Assessment scoring and question bank tests
```

The build output is `dist/`. Static hosting must rewrite application routes to `index.html`.

## Browser verification

With the dev server running at `http://127.0.0.1:5173` and Google Chrome installed:

```sh
node scripts/e2e-check.mjs
node scripts/visual-check.mjs
```

The end-to-end script covers demo entry, real audio playback, seeking, speed, transcript, resume, saved assessment answers, unanswered-question recovery, score calculation, recommendation changes, prerequisite unlocking, accessible dialogs, preferences, offline status, and all nine pages at 320/390/768/1024/1440px. It also runs axe WCAG A/AA checks. Screenshots and accessibility findings are written to `/private/tmp/vector-review` on macOS.

## Pages

- `/login` — entry and local demo identity
- `/app` — current recommendation and course trajectory
- `/app/path` — connected topic map with accessible details
- `/app/topic/:topicId` — material, narrated lesson, transcript, objectives, source excerpts
- `/app/topic/:topicId/assessment` — focused assessment
- `/app/topic/:topicId/review` — answer-specific reasoning
- `/app/topic/:topicId/summary` — mastery change, evidence, next action
- `/app/progress` — mastery plot, completion, assessment history
- `/app/settings` — playback, appearance, accessibility, account

## Architecture and API handoff

- `src/styles/tokens.css`: exact Ink / Bone / Signal palette, semantic light/dark tokens, Tailwind mapping.
- `src/styles/globals.css`: responsive editorial layouts, controls, one-pass motion, accessibility overrides.
- `src/components`: application shell, topic path, custom audio controls, assessment choices, shared UI primitives.
- `src/pages`: nine student pages, loaded by route where appropriate.
- `src/services/mockData.ts`: all six illustrative topics, objectives, questions, explanations, source content, and initial history. Replace this fixture at the service boundary when course APIs are available.
- `src/services/learning.ts`: explicit demonstration scoring policy. New mastery = round((prior mastery + assessment score) / 2). A latest assessment score of at least 75% recommends continuation. This is a demonstration rule, not a validated mastery model.
- `src/store/useLearning.ts`: locally persisted preferences, listening positions, reading/listening completion, assessment drafts, results, and history. Replace persistence/synchronization with authenticated API operations when available.
- `public/audio`: real, locally generated narration for every topic; no remote media dependency.

Bricolage Grotesque and IBM Plex Mono load from Google Fonts. Dialogs and tabs use unstyled Radix primitives. Motion respects both system and in-app reduced-motion settings. The course is topic-based throughout.

## Demo boundaries

Institutional authentication, cloud synchronization, real instructor files, ingestion, and backend adaptation are not connected. The entry form identifies a local demo session; it is not an authentication boundary. Numeric mastery and seeded history are explicitly marked as illustrative. Learning material combines representative lecture and reading excerpts, with complete text available in the topic itself. Assessment history links to the latest review for a topic.

The macOS narration can be regenerated with:

```sh
node --experimental-strip-types scripts/generate-audio.mjs
```

Generation requires the macOS Samantha voice and access to speech synthesis/audio codecs. Pre-generated files are included, so generation is not required to run the app.
