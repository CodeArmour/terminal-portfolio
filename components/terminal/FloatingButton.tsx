"use client"

import { Terminal } from "lucide-react"
import { useTerminalStore } from "@/lib/store/terminalStore"
import { useTheme } from "@/lib/context/ThemeContext"

export default function FloatingButton() {
  const { isOpen, openTerminal, isMinimized, maximizeTerminal } = useTerminalStore()
  const { colors } = useTheme()

  const handleClick = () => {
    if (isMinimized) {
      maximizeTerminal()
    } else {
      openTerminal()
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 p-2 sm:p-3 rounded-full ${colors.buttonBg} ${colors.buttonText}
        shadow-lg hover:opacity-90 transition-all duration-200 z-40
        ${isOpen && !isMinimized ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      aria-label="Open Terminal"
    >
      <Terminal size={24} />
    </button>
  )
}
