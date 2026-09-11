# Wael Academy — v2

A clickable prototype of the Wael Academy redesign (Figma), in Tunisian Arabic, RTL.
Two areas, one app:

| Route | What |
|---|---|
| `/` | Public landing — hero, stats, levels, 3 steps, teachers, offers, success stories, pricing, FAQ, blog |
| `/a-propos` | « شكون نحنا » — our story, mission / vision / values, press & community |
| `/student-v2` | Élève dashboard — recent replays, live session, calendar, homework |
| `/student-v2/calendrier` | Week calendar (time grid) + day list |
| `/student-v2/seances` | Recordings by subject (all 17 subject portraits) |
| `/student-v2/seances/:subjectId` | A subject's replays, by month |
| `/student-v2/video/seance/:id` | Video player — playlist that expands / folds to a rail |
| `/student-v2/offres` | Offers — the current offer and the others, side by side |

Screens not designed yet (matières, groupes…) show a placeholder in the same style.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # typecheck + production build
```

Stack: Vite · React 19 · TypeScript · Tailwind v4 · React Router · lucide-react.
No backend — all data is an in-memory store seeded from `src/data/seed/*.json`
(resets on refresh).

## Docs

- **[docs/sound-effects.md](docs/sound-effects.md)** — the sound-effects system of the élève space: source & license (UI SFX, MIT + CC0), how it's wired, the meaning → cue grammar, where every cue is used, and the checklist for adding sound to new features (chat, messages, delete…). **Read it before adding any interaction.** Validate with `npm run check:sounds`.
- [AGENTS.md](AGENTS.md) — short instructions for coding agents.

## Demo controls

- **حالات (states) dock** — the green layers button, bottom corner of the élève
  space. Flips every panel between its real, data-driven state and the others
  (live / soon / countdown / ended / postponed / none, empty lists, a crowded
  playlist…). Also settable by URL: `?live=soon`, `?docs=done`, `?calendar=empty`,
  `?playlist=many`, `?comments=empty`, `?offers=none`, `?view=month`.
- **Sound** — speaker in the top bar mutes/unmutes; the dock's « الأصوات » row switches between 12 sound packs (default `arcade`).
- **S** — switches Wael's cursor-following eyes on/off (remembered). The dock's
  « عيون وائل » row does the same, and can override the OS reduced-motion setting.

## Where things live

```
src/
  features/site/          the public site (landing + about) — SiteLayout, HomePage, AboutPage, content.ts
  features/student-v2/    the élève space — shell, dashboard, calendar, recordings, video player
  features/student/…      shared data hooks (schedule, replays, player source) the v2 screens read
  components/icons/       subject badges (SVG) + the eye-tracking overlay
  stores/                 in-memory data store + demo auth
  styles/v2.css           the redesign's tokens (palette measured off the Figma files)
svg icons/subjects/       the 17 subject portraits (eyes flagged for the gaze overlay)
svg icons/doodles/        the designer's line doodles per subject, extracted from Figma
```
