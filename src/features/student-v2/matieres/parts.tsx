import type { ReactNode } from "react"
import { Check, Download, FileText, FolderOpen } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { useIsMobile } from "@/lib/hooks"
import { cn } from "@/lib/utils"
import { useDownloads } from "../downloads"
import { sfx } from "../sound"
import { PanelEmpty } from "../ui"

/**
 * The frame's two repeated ornaments — recoloured.
 *
 * The frame painted BOTH of them with the brand ramp: every corner flag the
 * same teal→lime, every numbered disc the same ramp at a quarter. On a page
 * whose ground is already that ramp, the result was a screen with one colour
 * and no contrast — « COURS », « QUIZ » and « قريباً » all wearing it, so the
 * flag said nothing beyond "there is a flag here".
 *
 * `Ribbon` now takes a `tone`, and the tone IS the meaning: teal for a cours,
 * navy for an exercice, petrol for a série, violet for a résumé (the palette's
 * documents hue), lime for a quiz — and a quiet ink tint for « قريباً », which
 * is an absence and should never shout louder than the thing that exists.
 * It is still drawn INSIDE the corner, taking the card's radius on that one
 * corner and squaring the other three, physical-left as the frame has it.
 *
 * `Disc` is the numbered circle at the reading start: brand-tinted with brand
 * digits while the chapitre is shut, flat ink while it has nothing in it, and
 * solid lime once it is open — the one lime thing on the deep panel, so the
 * eye lands on the chapitre you are actually in.
 */
export type RibbonTone = "cours" | "exercice" | "serie" | "resume" | "quiz" | "exam" | "step" | "soon"

const RIBBON_TONE: Record<RibbonTone, string> = {
  cours: "bg-v2-kind-cours text-v2-on-kind",
  exercice: "bg-v2-kind-exercice text-v2-on-kind",
  serie: "bg-v2-kind-serie text-v2-on-kind",
  resume: "bg-v2-kind-resume text-v2-on-kind",
  quiz: "bg-v2-kind-quiz text-v2-on-cta",
  exam: "bg-v2-kind-exercice text-v2-on-kind",
  step: "bg-v2-kind-cours text-v2-on-kind",
  soon: "bg-v2-ink/[0.07] text-v2-ink/50",
}

export function Ribbon({
  tone,
  children,
  className,
}: {
  tone: RibbonTone
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "absolute left-0 top-0 z-10 grid place-items-center rounded-tl-2xl px-2 font-bold uppercase tracking-wide",
        "h-8 min-w-[4.5rem] text-[calc(7.5px*var(--ts))] md:h-10 md:min-w-[5.5rem] md:text-[calc(9.5px*var(--ts))] 2xl:h-[46px] 2xl:min-w-[114px] 2xl:text-[calc(12px*var(--ts))]",
        RIBBON_TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Disc({ n, open, muted }: { n: number; open?: boolean; muted?: boolean }) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-bold tabular-nums",
        "size-11 text-[calc(11px*var(--ts))] md:size-14 md:text-[calc(14px*var(--ts))] 2xl:size-[70px] 2xl:text-[calc(17px*var(--ts))]",
        open
          ? "bg-v2-cta text-v2-on-cta shadow-v2-card"
          : muted
            ? "bg-v2-ink/[0.06] text-v2-ink/40"
            : "bg-v2-brand/10 text-v2-brand ring-1 ring-inset ring-v2-brand/25",
      )}
    >
      <bdi dir="ltr">{String(n).padStart(2, "0")}.</bdi>
    </span>
  )
}

/**
 * The rank of a contenu inside its chapitre — « 1 », « 2 », « 3 ».
 *
 * Same family as `Disc`, one register below it: a chapitre is numbered « 01. »
 * on a brand-tinted disc, a contenu is numbered plainly on a smaller one. It
 * sits at the reading start of the card, as tall as the card allows and clear
 * of its edge, so the eye reads the order down the column before it reads a
 * single title — which is what an ordered programme is for.
 *
 * On the deep panel the cards are white, so the disc keeps the brand tint it
 * has everywhere else instead of inventing a colour for this one surface.
 */
export function ItemDisc({ n }: { n: number }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-bold tabular-nums",
        "bg-v2-brand/10 text-v2-brand ring-1 ring-inset ring-v2-brand/20",
        "size-10 text-[calc(11px*var(--ts))] md:size-[3.25rem] md:text-[calc(14px*var(--ts))] 2xl:size-[68px] 2xl:text-[calc(18px*var(--ts))]",
      )}
    >
      <bdi dir="ltr">{n}</bdi>
    </span>
  )
}

/**
 * The frame's pill — outlined, and filled when it is the one in force.
 *
 * Lime means ONE thing in this space: « this is the one selected ». So the
 * count on an unselected tab is an ink tint, not the lime it used to be.
 */
export function Chip({
  active,
  count,
  icon: Icon,
  label,
  onClick,
  tone = "ink",
  className,
}: {
  active: boolean
  count?: number
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  onClick: () => void
  /** `ink` — the head tabs, navy on the page. `deep` — the chips on the deep panel. */
  tone?: "ink" | "deep"
  className?: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      data-uisfx="toggle-on"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl px-3 font-bold transition active:scale-[.98]",
        "h-11 text-[calc(10px*var(--ts))] md:h-14 md:gap-2.5 md:px-4 md:text-[calc(12px*var(--ts))] 2xl:h-[73px] 2xl:gap-3 2xl:px-5 2xl:text-[calc(14px*var(--ts))]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-v2-brand",
        tone === "ink"
          ? active
            ? "bg-v2-cta text-v2-on-cta shadow-v2-card"
            : "border border-v2-ink/20 bg-v2-surface text-v2-ink/75 hover:border-v2-ink/40 hover:text-v2-ink"
          : active
            ? "bg-v2-cta text-v2-on-cta shadow-v2-card"
            : "border border-v2-chapter-line bg-white/10 text-v2-on-chapter/85 hover:bg-white/20 hover:text-v2-on-chapter",
        className,
      )}
    >
      <Icon className="size-4 shrink-0 md:size-5 2xl:size-6" strokeWidth={2} />
      <span className="truncate">{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "grid shrink-0 place-items-center rounded-full text-[calc(8px*var(--ts))] font-bold tabular-nums 2xl:text-[calc(10px*var(--ts))]",
            "size-5 md:size-6 2xl:size-8",
            active
              ? "bg-v2-on-cta/15 text-v2-on-cta"
              : tone === "ink"
                ? "bg-v2-ink/[0.08] text-v2-ink/65"
                : "bg-white/15 text-v2-on-chapter/85",
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}

/**
 * A contenu's files, in the same sheet the séances use — bottom sheet on a
 * phone, centred dialog on desktop, and the same « taken » memory, so a PDF
 * downloaded from a chapitre shows as downloaded everywhere else too.
 */
export function FilesSheet({
  title,
  subtitle,
  files,
  onOpenChange,
}: {
  title: string
  subtitle?: string
  files: { name: string }[] | null
  onOpenChange: (open: boolean) => void
}) {
  const mobile = useIsMobile()
  const open = !!files
  const { has, download } = useDownloads()
  const change = (o: boolean) => {
    if (!o) sfx("close")
    onOpenChange(o)
  }

  const body = (
    <div className="flex flex-col gap-2.5">
      {files?.length === 0 ? (
        <PanelEmpty
          icon={FolderOpen}
          title="ما فمّا حتّى وثيقة"
          body="المحتوى هذا فيه فيديو برك. كي تتزاد وثيقة، تلقاها هوني."
        />
      ) : (
        files?.map((f) => {
          const id = `${title}::${f.name}`
          const taken = has(id)
          return (
            <button
              key={f.name}
              type="button"
              onClick={() => download(id, f.name)}
              className={cn(
                "flex min-h-14 w-full items-center gap-3 rounded-2xl border px-4 text-start transition",
                taken
                  ? "border-v2-brand/40 bg-v2-brand/[0.06]"
                  : "border-v2-ink/15 bg-v2-surface hover:border-v2-ink/30 hover:bg-v2-ink/[0.03]",
              )}
            >
              <FileText className="size-5 shrink-0 text-v2-ink/50" strokeWidth={1.75} />
              <span className="min-w-0 flex-1 truncate text-[calc(10px*var(--ts))] font-medium text-v2-ink">{f.name}</span>
              {taken ? (
                <Check className="size-5 shrink-0 text-v2-brand" strokeWidth={2.25} />
              ) : (
                <Download className="size-5 shrink-0 text-v2-ink/45" strokeWidth={1.75} />
              )}
            </button>
          )
        })
      )}
    </div>
  )

  if (mobile) {
    return (
      <Sheet open={open} onOpenChange={change}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetTitle>{title}</SheetTitle>
          {subtitle && <SheetDescription>{subtitle}</SheetDescription>}
          <div className="mt-4">{body}</div>
        </SheetContent>
      </Sheet>
    )
  }
  return (
    <Dialog open={open} onOpenChange={change}>
      <DialogContent className="max-w-lg">
        <DialogTitle>{title}</DialogTitle>
        {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
        <div className="mt-4">{body}</div>
      </DialogContent>
    </Dialog>
  )
}
