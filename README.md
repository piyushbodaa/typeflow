# typeflow

Get into flow. Type faster.

A desktop-only typing trainer. Instant 60-second test on the home page, structured lessons, and local history. No accounts. No server.

## Requirements

- Node.js 20+
- A laptop or desktop with a physical keyboard (viewport ≥ 1024px)

## Run

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`) and start typing. The first keystroke starts a 60-second test.

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

- Start: type
- Restart: <kbd>Tab</kbd> then <kbd>Enter</kbd>
