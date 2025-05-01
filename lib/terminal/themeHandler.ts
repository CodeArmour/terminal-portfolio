import { useTerminalStore } from "@/lib/store/terminalStore"

export function setTerminalTheme(themeName: string): boolean {
  const validThemes = ["dark", "light", "hacker", "monokai"]

  if (!validThemes.includes(themeName)) {
    return false
  }

  const { setTheme } = useTerminalStore.getState()
  setTheme(themeName as any)
  return true
}
