import { createContext, useContext, useState, type ReactNode } from "react"
import { Eye, Layers, RotateCcw, X } from "lucide-react"
import { setGazeMode, useGazeMode } from "@/app/gaze"
import { useMediaQuery } from "@/lib/hooks"
import { cn } from "@/lib/utils"

/**
 * The states each panel of the new space can be in, and a small dock to flip
 * them — so every state the frame DIDN'T draw can still be shown from one
 * screen at any hour of any day.
 *
 * `auto` is always the truth: the store read against the clock. The other
 * values are demo overrides; none of them writes to the store.
 *
 * Like the palette dock, this is a prototype control, not product UI.
 */

export type LiveMode = "auto" | "live" | "soon" | "countdown" | "ended" | "postponed" | "none"
export type FillMode = "auto" | "empty"
/** The documents panel has two more: a crowded week, and everything already taken. */
export type DocsMode = "auto" | "many" | "done" | "empty"

export interface DemoStates {
  live: LiveMode
  calendar: FillMode
  docs: DocsMode
  recent: FillMode
  notifs: FillMode
  /** The player page: a long programme in the list, and an empty comment wall. */
  playlist: "auto" | "many"
  comments: FillMode
  /** The offers page: the élève's real subscription, or none at all. */
  offers: "auto" | "none"
  /** When `live` last changed — a made-up countdown ticks from here. */
  anchor: number
}

type Key = Exclude<keyof DemoStates, "anchor">

const INITIAL: DemoStates = {
  live: "auto",
  calendar: "auto",
  docs: "auto",
  recent: "auto",
  notifs: "auto",
  playlist: "auto",
  comments: "auto",
  offers: "auto",
  anchor: 0,
}

interface Ctx {
  states: DemoStates
  set: <K extends Key>(key: K, value: DemoStates[K]) => void
  reset: () => void
}

const DemoStatesContext = createContext<Ctx | null>(null)

/**
 * A state can also be set from the URL — `?live=countdown&docs=empty` — so a
 * given state is a link you can send, and a screenshot can be taken of it.
 * Unknown keys and values are ignored.
 */
function fromUrl(): Partial<DemoStates> {
  const params = new URLSearchParams(window.location.search)
  const out: Partial<Record<Key, string>> = {}
  for (const row of ROWS) {
    const v = params.get(row.key)
    if (v && row.options.some((o) => o.value === v)) out[row.key] = v
  }
  return out as Partial<DemoStates>
}

export function DemoStatesProvider({ children }: { children: ReactNode }) {
  const [states, setStates] = useState<DemoStates>(() => ({ ...INITIAL, ...fromUrl(), anchor: Date.now() }))
  const set: Ctx["set"] = (key, value) =>
    setStates((s) => ({ ...s, [key]: value, anchor: key === "live" ? Date.now() : s.anchor }))
  const reset = () => setStates({ ...INITIAL, anchor: Date.now() })
  return (
    <DemoStatesContext.Provider value={{ states, set, reset }}>{children}</DemoStatesContext.Provider>
  )
}

export function useDemoStates(): DemoStates {
  const ctx = useContext(DemoStatesContext)
  if (!ctx) throw new Error("useDemoStates must be used inside <DemoStatesProvider>")
  return ctx.states
}

const ROWS: { key: Key; label: string; options: { value: string; label: string }[] }[] = [
  {
    key: "live",
    label: "الحصّة المباشرة",
    options: [
      { value: "auto", label: "حقيقي" },
      { value: "live", label: "بدات" },
      { value: "soon", label: "تبدا توّا" },
      { value: "countdown", label: "العدّ" },
      { value: "ended", label: "وفات" },
      { value: "postponed", label: "تأجلت" },
      { value: "none", label: "ما فمّاش" },
    ],
  },
  {
    key: "calendar",
    label: "حصص المباشرة",
    options: [
      { value: "auto", label: "حقيقي" },
      { value: "empty", label: "فارغة" },
    ],
  },
  {
    key: "docs",
    label: "التمارين والكور",
    options: [
      { value: "auto", label: "حقيقي" },
      { value: "many", label: "برشا" },
      { value: "done", label: "تحمّلو الكل" },
      { value: "empty", label: "فارغة" },
    ],
  },
  {
    key: "recent",
    label: "آخر الحصص المضافة",
    options: [
      { value: "auto", label: "حقيقي" },
      { value: "empty", label: "فارغة" },
    ],
  },
  {
    key: "notifs",
    label: "الإشعارات",
    options: [
      { value: "auto", label: "حقيقي" },
      { value: "empty", label: "فارغة" },
    ],
  },
  {
    key: "playlist",
    label: "قائمة الفيديوات",
    options: [
      { value: "auto", label: "حقيقي" },
      { value: "many", label: "برشا" },
    ],
  },
  {
    key: "offers",
    label: "العروض",
    options: [
      { value: "auto", label: "حقيقي" },
      { value: "none", label: "بلا اشتراك" },
    ],
  },
  {
    key: "comments",
    label: "التعليقات",
    options: [
      { value: "auto", label: "حقيقي" },
      { value: "empty", label: "فارغة" },
    ],
  },
]

/**
 * Wael's eyes — the app-wide gaze switch (`app/gaze.ts`, also the S key),
 * surfaced here because it is otherwise invisible: it survives a reload, and S
 * is also a demo key on the old dashboard, so it is easy to switch off by
 * accident and then read as "the eyes don't work". The row also names the one
 * thing that silences them without that switch — the system's reduced-motion
 * setting (Windows: « Animation effects » off), which the overlay honours.
 */
function GazeRow() {
  const mode = useGazeMode()
  const fine = useMediaQuery("(any-pointer: fine)")
  const calm = useMediaQuery("(prefers-reduced-motion: reduce)")
  const on = mode !== "off"

  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-[calc(8px*var(--ts))] font-semibold text-v2-ink/70">
        <Eye className="size-4" /> عيون وائل <span className="font-normal text-v2-ink/45">· زرّ S</span>
      </p>
      <div className="flex flex-wrap gap-1.5">
        {([true, false] as const).map((value) => {
          const active = on === value
          return (
            <button
              key={String(value)}
              type="button"
              aria-pressed={active}
              onClick={() => setGazeMode(value ? (mode === "always" ? "always" : "on") : "off")}
              className={cn(
                "min-h-9 rounded-full border px-3 text-[calc(8px*var(--ts))] font-semibold transition",
                active
                  ? "border-transparent bg-v2-grad text-white"
                  : "border-v2-ink/15 text-v2-ink/75 hover:border-v2-brand/50 hover:text-v2-ink",
              )}
            >
              {value ? "تتبّع الفأرة" : "ثابتة"}
            </button>
          )
        })}
      </div>
      {on && !fine && (
        <p className="mt-1.5 text-[calc(7px*var(--ts))] leading-relaxed text-v2-live-strong">ما تخدمش باللمس — تحتاج فأرة.</p>
      )}
      {on && fine && calm && mode === "on" && (
        <div className="mt-2 rounded-2xl bg-v2-live/[0.08] p-2.5">
          <p className="text-[calc(7px*var(--ts))] leading-relaxed text-v2-live-strong">
            النظام طالب حركة أقل (Animation effects مطفية في Windows)، فالعيون ثابتة.
          </p>
          <button
            type="button"
            onClick={() => setGazeMode("always")}
            className="mt-1.5 min-h-9 rounded-full bg-v2-cta px-3 text-[calc(7.5px*var(--ts))] font-semibold text-v2-on-cta"
          >
            شغّلها رغم هذا
          </button>
        </div>
      )}
      {mode === "always" && calm && (
        <p className="mt-1.5 text-[calc(7px*var(--ts))] leading-relaxed text-v2-ink/55">
          تخدم رغم إعداد « حركة أقل » متاع النظام.
        </p>
      )}
    </div>
  )
}

/** The floating « حالات » button + popover. Sits under the palette dock. */
export function StatesDock() {
  const ctx = useContext(DemoStatesContext)
  const [open, setOpen] = useState(false)
  if (!ctx) return null
  const { states, set, reset } = ctx
  const forced = ROWS.filter((r) => states[r.key] !== "auto").length

  return (
    <div className="fixed bottom-24 end-4 z-50 lg:bottom-6 lg:end-6">
      {open && (
        <div
          role="dialog"
          aria-label="حالات الشاشة"
          className="mb-3 max-h-[calc(100dvh-9rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-3xl border border-v2-ink/15 bg-v2-surface text-v2-ink shadow-xl"
        >
          <div className="flex items-center justify-between gap-2 border-b border-v2-ink/10 px-4 py-3">
            <div>
              <p className="text-[calc(10px*var(--ts))] font-bold">حالات الشاشة</p>
              <p className="text-[calc(7.5px*var(--ts))] text-v2-ink/55">نموذج فقط — ما يبدّل حتّى داتا.</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={reset}
                aria-label="رجّع الكل للحقيقي"
                className="grid size-9 place-items-center rounded-full text-v2-ink/60 transition hover:bg-v2-ink/5 hover:text-v2-ink"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="سكّر"
                className="grid size-9 place-items-center rounded-full text-v2-ink/60 transition hover:bg-v2-ink/5 hover:text-v2-ink"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3 p-4">
            <GazeRow />
            {ROWS.map((row) => (
              <div key={row.key}>
                <p className="mb-1.5 text-[calc(8px*var(--ts))] font-semibold text-v2-ink/70">{row.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {row.options.map((o) => {
                    const active = states[row.key] === o.value
                    return (
                      <button
                        key={o.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => set(row.key, o.value as never)}
                        className={cn(
                          "min-h-9 rounded-full border px-3 text-[calc(8px*var(--ts))] font-semibold transition",
                          active
                            ? "border-transparent bg-v2-grad text-white"
                            : "border-v2-ink/15 text-v2-ink/75 hover:border-v2-brand/50 hover:text-v2-ink",
                        )}
                      >
                        {o.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="حالات الشاشة"
        className="relative ms-auto grid size-12 place-items-center rounded-full bg-v2-grad text-white shadow-lg transition hover:brightness-105 active:scale-95"
      >
        <Layers className="size-5" />
        {forced > 0 && (
          <span className="absolute -top-1 -end-1 grid size-5 place-items-center rounded-full border-2 border-v2-surface bg-v2-live text-[11px] font-bold">
            {forced}
          </span>
        )}
      </button>
    </div>
  )
}
