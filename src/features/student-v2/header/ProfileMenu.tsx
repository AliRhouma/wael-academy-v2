import { useNavigate } from "react-router-dom"
import { DropdownMenu } from "radix-ui"
import { ChevronDown, Heart, LogOut, Settings, Ticket, UserRound, Wallet, type LucideIcon } from "lucide-react"
import { useAuth } from "@/stores/useAuth"
import { cn } from "@/lib/utils"
import avatar from "@/assets/v2/avatar.jpg"
import { BASE } from "../lib"

const itemClass =
  "flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl px-3 text-[calc(9.5px*var(--ts))] font-medium text-v2-ink outline-none transition data-[highlighted]:bg-v2-ink/[0.05]"

/**
 * Avatar + name + chevron, as in the frame. The menu carries what left the
 * rail (المحفظة، مفضّلاتي، كوداتي), and exit.
 */
export function ProfileMenu({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate()
  const user = useAuth((s) => s.currentUser)
  const logout = useAuth((s) => s.logout)

  const links: { label: string; icon: LucideIcon; to: string }[] = [
    { label: "بروفيلي", icon: UserRound, to: `${BASE}/profil` },
    { label: "المحفظة", icon: Wallet, to: `${BASE}/porte-monnaie` },
    { label: "مفضّلاتي", icon: Heart, to: `${BASE}/favoris` },
    { label: "كوداتي", icon: Ticket, to: `${BASE}/codes` },
    ...(compact ? [{ label: "الإعدادات", icon: Settings, to: `${BASE}/parametres` }] : []),
  ]

  return (
    <DropdownMenu.Root dir="rtl">
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="الحساب"
          className="group flex min-h-11 items-center gap-2.5 rounded-full p-0.5 pe-2 transition hover:bg-v2-ink/[0.05] focus-visible:outline-2 focus-visible:outline-v2-brand data-[state=open]:bg-v2-ink/[0.05]"
        >
          <img
            src={avatar}
            alt=""
            className={cn("shrink-0 rounded-full object-cover", compact ? "size-10" : "size-12 xl:size-[3.25rem] 2xl:size-[4.25rem]")}
          />
          {!compact && (
            <span className="max-w-[9rem] truncate text-[calc(10.5px*var(--ts))] font-bold text-v2-ink">{user?.name}</span>
          )}
          <ChevronDown
            className={cn("size-4 shrink-0 text-v2-ink transition group-data-[state=open]:rotate-180", compact && "hidden")}
          />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={10}
          collisionPadding={12}
          className="z-50 w-64 rounded-3xl border border-v2-ink/15 bg-v2-surface p-2 text-v2-ink shadow-xl shadow-v2-ink/10 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <div className="flex items-center gap-3 px-3 pb-3 pt-2">
            <img src={avatar} alt="" className="size-11 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="truncate text-[calc(10px*var(--ts))] font-bold">{user?.name}</p>
              <p className="truncate text-[calc(7.5px*var(--ts))] text-v2-ink/55">{user?.email}</p>
            </div>
          </div>
          <DropdownMenu.Separator className="mx-2 mb-1 h-px bg-v2-ink/10" />
          {links.map(({ label, icon: Icon, to }) => (
            <DropdownMenu.Item key={to} onSelect={() => navigate(to)} className={itemClass}>
              <Icon className="size-5 stroke-v2-grad" strokeWidth={1.75} />
              {label}
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Separator className="mx-2 my-1 h-px bg-v2-ink/10" />
          <DropdownMenu.Item
            onSelect={() => {
              logout()
              navigate("/")
            }}
            className={cn(itemClass, "text-v2-live-strong data-[highlighted]:bg-v2-live/10")}
          >
            <LogOut className="size-5" strokeWidth={1.75} />
            خروج
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
