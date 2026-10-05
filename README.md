# typeflow

A typing trainer for desktop and phone where you type poetry, not random words: every test and every lesson from six onward is a stanza from a well-loved poem (Shakespeare, Tagore, Dickinson, Khayyam, Basho, Kabir and more - all public domain, credited on screen). The home page is a dashboard. Tests and lessons start only after you confirm. Daily practice, adaptive poem selection, Guided and Flow modes, and private learning progress. No accounts. No server.

## Requirements

- Node.js 20+
- A keyboard (physical is best; on-glass practice works)

## Run

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`). You land on the dashboard. **Start 1-minute test** is the primary action.

## Routes

| Path | What it is |
|---|---|
| `/` | Dashboard — start test, lessons, history, snapshot stats, settings. No live test. |
| `/test` | Timed and word-count practice over poems (or random words with `?source=words`). Choose a mode, then **Begin**. |
| `/test?seconds=60&go=1` | Confirmed 1-minute test (used by the dashboard CTA). First keystroke starts the clock. |
| `/lessons` | Twelve lessons: five key drills, then poems. |
| `/lessons/:id` | Lesson player. **Begin lesson**, then type. Pass at 95% accuracy. |
| `/history` | Last 50 local results. |
| `/about` | Desktop-only, WPM formula, privacy. |

## Build

```bash
npm run build
npm run preview
```

`npm run build` type-checks (`tsc -b`) then emits a static site in `dist/`.

## Deploy

This is a static SPA.

- **Vercel:** import the GitHub repo. `vercel.json` already rewrites all routes to `index.html`.
- **Netlify:** publish `dist`, set a SPA redirect of `/*` → `/index.html`.
- **Any static host:** upload `dist` and configure the same fallback.

No environment variables. No backend.

## Data and privacy

Settings, lesson progress, poem rotation, and the last 50 results live in `localStorage` under `typeflow:*`. Clearing site data wipes them. Nothing is sent anywhere.

## WPM

`(correct characters / 5) / minutes elapsed`. Raw WPM also counts incorrect and extra characters. Accuracy is `correct / (correct + incorrect + extra)`.

## Shortcuts

- Confirm a run: **Begin** (Enter on the focused button)
- Start the clock: first keystroke, after you have begun
- Repeat the passage: <kbd>Alt</kbd> + <kbd>R</kbd>

## Poems

The bank lives in `src/data/poems.ts`. Add a stanza there and it joins the rotation; a check at import time rejects any character a US keyboard cannot type (use straight quotes and plain hyphens, no em dashes).

Poem practice remembers passages across visits and lessons. Unseen poems in each lesson’s pool come first; after the pool is exhausted, the least recently seen returns. **New poem** generates a fresh attempt; **Repeat this poem** and Alt+R replay the same passage. Tab navigates normally. The first five lessons remain short key drills; Numbers practices poem titles and dates.

## Learning experience

- `/daily`: choose 3, 5, or 10 minutes. A one-minute Flow warm-up is followed by Guided practice for weak keys and a Flow poetry session. Each stage waits for Begin.
- `/test?adaptive=1`: poem selection favors weak keys from recent key-level accuracy and timing, while unseen eligible poems come first.
- `/test?benchmark=1`: fixed Sonnet 18 passage, 60 seconds, Flow mode. Use this for comparable weekly speed and personal records.
- First-attempt accuracy retains errors after correction. Final text accuracy keeps the original character-scoring formula. Lessons pass at 95% first-attempt accuracy.
- Guided mode requires Backspace correction before continuing; Flow mode lets errors remain for review. Keyboard guidance highlights the appropriate Shift key.
- The last character completes word-count lessons. Timed sessions reject input at the deadline and refill poetry if the prepared buffer is exhausted. Paste and drop cannot complete a test.
- Verse lines and the current poem’s credit remain visible. Results offer error-key and combination review, one recommendation, and a reader for the passages practiced.
- Text size, high contrast, and keyboard visibility are available in the practice toolbar. Navigation remains keyboard accessible; Alt+R repeats.
- History shows weekly practice, first-attempt accuracy, benchmark trends, key improvements, and records separated by exercise, difficulty, text source, and style. Legacy results remain visible but do not count toward first-attempt records.
- History exports/imports versioned JSON backups. Import validates the backup and merges/deduplicates the last 50 results and passed lessons, restoring settings and poem rotation.

## Verification

`npm test` runs scoring, timer, rotation, adaptive-selection, backup and StrictMode DOM integration checks. `npm run build` checks strict TypeScript and builds the static app.
