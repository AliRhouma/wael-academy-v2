import { useEffect, type ReactNode } from "react"
import { useGazeHotkey } from "./gaze"

/**
 * App-root providers for Wael Academy v2 (the public site + the élève space).
 *  - S toggles Wael's cursor-following eyes, app-wide (see `gaze.ts`).
 *  - The design is light; `data-palette="azure"` fixes the shared base tokens
 *    (index.css / palettes.css) that the few shared kit pieces still read.
 */
export function Providers({ children }: { children: ReactNode }) {
  useGazeHotkey()
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute("data-theme", "light")
    root.setAttribute("data-palette", "azure")
  }, [])
  return <>{children}</>
}
