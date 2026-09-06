# typeflow

A desktop-only typing trainer. The home page is a dashboard. Tests and lessons start only after you confirm. No accounts. No server.

## Requirements

- Node.js 20+
- A laptop or desktop with a physical keyboard (viewport ≥ 1024px)

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
| `/test` | Timed and word-count practice. Choose a mode, then **Begin**. |
| `/test?seconds=60&go=1` | Confirmed 1-minute test (used by the dashboard CTA). First keystroke starts the clock. |
| `/lessons` | Twelve sequential drills. |
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

Settings, lesson progress, and the last 50 results live in `localStorage` under `typeflow:*`. Clearing site data wipes them. Nothing is sent anywhere.

## WPM

`(correct characters / 5) / minutes elapsed`. Raw WPM also counts incorrect and extra characters. Accuracy is `correct / (correct + incorrect + extra)`.

## Shortcuts

- Confirm a run: **Begin** (Enter on the focused button)
- Start the clock: first keystroke, after you have begun
- Restart: <kbd>Tab</kbd> then <kbd>Enter</kbd>
