# Instructions for coding agents (and developers)

Wael Academy v2 — a clickable prototype of the redesign: the public site (`/`,
`/a-propos`) and the élève space (`/student-v2`). Vite + React + TypeScript +
Tailwind v4, Arabic (Tunisian) RTL, in-memory data seeded from `src/data/seed/`
(no backend). See `README.md` for routes and structure.

## Must-read before touching the élève space

- **`docs/sound-effects.md`** — every user action in `/student-v2` plays a
  semantic sound cue (library `uisfx`): `data-uisfx="<cue>"` on the clicked
  element, or `sfx("<cue>")` from `src/features/student-v2/sound.ts` for
  outcomes that aren't clicks. Any new action (chat, messages, delete, forms…)
  must get the right cue from that doc's grammar and a row in its §5 table.

## Before you finish

```bash
npm run check:sounds   # all cue names valid (uisfx ignores typos silently)
npx tsc -b && npm run build
```

## Conventions

- Colours come from the v2 tokens in `src/styles/v2.css` (`text-v2-ink`,
  `bg-v2-cta`, `border-v2-ink/15`…); no new palette.
- UI copy in Tunisian Arabic; logical utilities (`ms-`, `pe-`, `start-`) for RTL.
- Screens read and mutate data through `useData()` — never import seed JSON directly.
