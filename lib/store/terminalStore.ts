import { create } from "zustand"
import { persist } from "zustand/middleware"

// Update the TerminalTheme type to include all our new themes
export type TerminalTheme = "dark" | "light" | "retro" | "synthwave" | "hacker" | "ocean" | "dracula" | "nord"

interface TerminalState {
  isOpen: boolean
  isMinimized: boolean
  theme: TerminalTheme
  openTerminal: () => void
  closeTerminal: () => void
  minimizeTerminal: () => void
  maximizeTerminal: () => void
  setTheme: (theme: TerminalTheme) => void
}

// Use persist middleware to save theme preference
export const useTerminalStore = create<TerminalState>()(
  persist(
    (set) => ({
      isOpen: false,
      isMinimized: false,
      theme: "dracula", // Changed default theme to dracula
      openTerminal: () => set({ isOpen: true, isMinimized: false }),
      closeTerminal: () => set({ isOpen: false }),
      minimizeTerminal: () => set({ isMinimized: true }),
      maximizeTerminal: () => set({ isMinimized: false }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "terminal-store",
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
)
