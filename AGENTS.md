# Typeflow conventions

- TypeScript strict. No `any`. Prefer explicit types at engine boundaries.
- Functional components only. Hooks for state and engine wiring.
- The typing engine (`src/engine`) is pure TypeScript: no React, no DOM, no `localStorage`. Test and Lessons both call `createEngine`.
- WPM is `(correct characters / 5) / minutes elapsed`. Raw WPM includes incorrect and extra. Accuracy is `correct / (correct + incorrect + extra)`.
- Client-only. Persist settings, lesson progress, and the last 50 results in localStorage. Never add a backend, auth, or PWA install prompt.
- Desktop-first. Viewport under 1024px shows the keyboard gate. No hamburger menu.
- Amber accent `#F5A524` on dark `#0B0D10`. Motion 150–200ms, no bounce.
- JSON word lists live in `src/data`. Do not fetch word banks at runtime.
