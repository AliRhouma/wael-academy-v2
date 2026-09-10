import { useMemo } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowRight, Clock, MonitorPlay, Play } from "lucide-react"
import type { Session } from "@/data/types"
import { SubjectIcon } from "@/components/icons/subjects"
import { addDays, dateKey, useNow } from "@/features/student/calendar/schedule"
import { durationLabel, useMyPastSessions } from "@/features/student/seances/replays"
import { useData } from "@/stores/useData"
import { cn } from "@/lib/utils"
import { BASE, MONTHS, dayLabel, frenchName, parseDay, useLookups, v2VideoPath } from "../lib"
import { CtaLink, LatinLine, PanelEmpty } from "../ui"
import { recordingCount, useShelves } from "./recordings"

/** How long a given séance may show « التسجيل يوصل قريب » before it drops out. */
const PENDING_DAYS = 14

/**
 * One matière's replays — where a تسجيلات card lands. Not in the Figma yet:
 * composed from the family (the portrait with its gaze as the header, the
 * inset-label rows, the teal play mark) and grouped by month, newest first.
 *
 * Séances already given whose replay isn't online yet stay in the list, quiet
 * and unclickable, so the élève can see what is on its way rather than
 * wondering where last Tuesday went.
 */
export default function V2SubjectRecordingsScreen() {
  const { subjectId } = useParams()
  const now = useNow()
  const subject = useData((s) => s.subjects.find((x) => x.id === subjectId))
  const pool = useMyPastSessions()
  const shelves = useShelves(now)
  const { teacherName } = useLookups()

  // Published replays, plus the last fortnight's séances still waiting for
  // theirs. Older than that, a missing replay isn't "on its way" any more —
  // it simply isn't in the library.
  const since = dateKey(addDays(now, -PENDING_DAYS))
  const mine = useMemo(
    () => pool.filter((s) => s.subjectIds.includes(subjectId ?? "") && (s.recordingUrl || s.date >= since)),
    [pool, subjectId, since],
  )
  const months = useMemo(() => {
    const byMonth = new Map<string, Session[]>()
    for (const s of mine) {
      const key = s.date.slice(0, 7)
      const list = byMonth.get(key)
      if (list) list.push(s)
      else byMonth.set(key, [s])
    }
    return [...byMonth.entries()]
  }, [mine])

  const shelf = shelves.find((s) => s.subject.id === subjectId)
  const recorded = shelf?.recorded.length ?? 0

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <Link
        to={`${BASE}/seances`}
        className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full pe-3 text-[calc(10px*var(--ts))] font-medium text-v2-ink transition hover:text-v2-brand"
      >
        <ArrowRight className="size-5" />
        تسجيلات
      </Link>

      <header className="group flex items-center gap-4 rounded-3xl border border-v2-ink/15 bg-v2-surface p-4 md:gap-6 md:p-6">
        <SubjectIcon name={subject?.name ?? ""} className="aspect-square w-24 shrink-0 md:w-32" />
        <div className="min-w-0">
          <p className="text-[calc(8px*var(--ts))] text-v2-ink/55">{subject?.name}</p>
          <h1 className="text-[calc(15px*var(--ts))] font-bold leading-tight text-v2-ink md:text-[calc(18px*var(--ts))]">
            {frenchName(subject?.name)}
          </h1>
          <p className="mt-1 text-[calc(8.5px*var(--ts))] text-v2-ink/70">
            {recorded === 0 ? "مازال ما فمّاش تسجيلات" : recordingCount(recorded)}
          </p>
        </div>
      </header>

      {mine.length === 0 ? (
        <div className="rounded-3xl border border-v2-ink/15 bg-v2-surface p-4 md:p-6">
          <PanelEmpty
            icon={MonitorPlay}
            title={`مازال ما تنشر حتّى تسجيل في ${subject?.name ?? "المادّة هذي"}`}
            body="كي يكمّل الأستاذ حصّة وينزّل التسجيل متاعها، يظهرلك هوني."
            action={<CtaLink to={`${BASE}/seances`}>رجوع للتسجيلات</CtaLink>}
          />
        </div>
      ) : (
        months.map(([month, list]) => {
          const d = parseDay(`${month}-01`)
          return (
            <section key={month} aria-label={`${MONTHS[d.getMonth()]} ${d.getFullYear()}`}>
              <h2 className="mb-3 text-[calc(10.5px*var(--ts))] font-bold text-v2-ink">
                {MONTHS[d.getMonth()]} {d.getFullYear()}
                <span className="ms-2 font-normal text-v2-ink/50">· {list.length}</span>
              </h2>
              <ul className="grid gap-3 lg:grid-cols-2">
                {list.map((s) => (
                  <li key={s.id}>
                    <ReplayRow session={s} teacher={teacherName(s.teacherId)} />
                  </li>
                ))}
              </ul>
            </section>
          )
        })
      )}
    </div>
  )
}

function ReplayRow({ session, teacher }: { session: Session; teacher?: string }) {
  const ready = !!session.recordingUrl
  const body = (
    <>
      <span
        className={cn(
          "grid size-12 shrink-0 place-items-center rounded-full transition",
          ready
            ? "border-[1.5px] border-v2-brand text-v2-brand group-hover:border-transparent group-hover:bg-v2-grad group-hover:text-white"
            : "bg-v2-ink/[0.06] text-v2-ink/40",
        )}
      >
        {ready ? <Play className="size-4 translate-x-[-1px] fill-current" /> : <Clock className="size-5" />}
      </span>
      <div className="min-w-0 flex-1">
        <LatinLine className={cn("text-[calc(9.5px*var(--ts))] font-semibold", ready ? "text-v2-ink" : "text-v2-ink/55")}>
          {session.title}
        </LatinLine>
        <p className="truncate text-[calc(7.5px*var(--ts))] text-v2-ink/55">
          {dayLabel(session.date)} · <bdi>{durationLabel(session.startTime, session.endTime)}</bdi>
          {teacher && ` · ${teacher}`}
        </p>
      </div>
      {!ready && (
        <span className="shrink-0 rounded-full border border-dashed border-v2-ink/25 px-2.5 text-[calc(7px*var(--ts))] leading-6 text-v2-ink/50">
          التسجيل يوصل قريب
        </span>
      )}
    </>
  )

  const shell = "flex items-center gap-3 rounded-2xl border p-3 md:p-4"
  return ready ? (
    <Link
      to={v2VideoPath(session.id, { subjectId: session.subjectIds[0] })}
      className={cn(shell, "group border-v2-ink/15 bg-v2-surface transition hover:border-v2-brand/40 hover:shadow-lg hover:shadow-v2-ink/[0.06]")}
    >
      {body}
    </Link>
  ) : (
    <div className={cn(shell, "border-dashed border-v2-ink/15 bg-v2-surface/60")}>{body}</div>
  )
}
