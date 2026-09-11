# Instructions for coding agents (and developers)

Wael Academy v2 — a clickable prototype of the redesign: the public site (`/`,
`/a-propos`), the door (`/connexion`, `/inscription`, `/mot-de-passe-oublie`)
and the élève space (`/student-v2`). Vite + React + TypeScript +
Tailwind v4, Arabic (Tunisian) RTL, in-memory data seeded from `src/data/seed/`
(no backend). See `README.md` for routes and structure.

## The door (`src/features/auth/`)

Its **flow** is the real one, walked screen by screen on
`student.waelacademy.com` (identifier + password · name / phone / level /
optional matière / password · phone → code + new password, with the
« ما وصلنيش الكود » request to the office), and its **design** is the Figma
« Log In » frame. Its **backend is not real**: `auth.ts` matches against
`src/data/seed/users.json`, keeps accounts made during the session in memory,
and prints the SMS code instead of sending it (`29340118` / `wael1234`, code
`123456`). When a real API arrives, `auth.ts` is the only file to replace —
the screens call nothing else.

`AuthFrame.tsx` mounts `mountSound()` itself: these screens are outside
`V2Layout`, and the `data-uisfx` binding lives on the document.

## Must-read before touching the élève space

- **`docs/sound-effects.md`** — every user action in `/student-v2` plays a
  semantic sound cue (library `uisfx`): `data-uisfx="<cue>"` on the clicked
  element, or `sfx("<cue>")` from `src/features/student-v2/sound.ts` for
  outcomes that aren't clicks. Any new action (chat, messages, delete, forms…)
  must get the right cue from that doc's grammar and a row in its §5 table.
  (`src/features/auth/` is held to the same rule — the checker scans it too.)

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
