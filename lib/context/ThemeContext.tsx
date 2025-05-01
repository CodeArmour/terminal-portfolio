"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useTerminalStore } from "@/lib/store/terminalStore"

// Define theme types
export type ThemeName = "dark" | "light" | "retro" | "synthwave" | "hacker" | "ocean" | "dracula" | "nord"

// Define theme properties
export interface ThemeColors {
  background: string
  text: string
  primary: string
  secondary: string
  accent: string
  border: string
  card: string
  cardText: string
  buttonBg: string
  buttonText: string
  navBg: string
  navText: string
  terminalBg: string
  terminalText: string
  terminalPrompt: string
  terminalBorder: string
  scrollbarThumb: string
  scrollbarTrack: string
}

// Define theme context
interface ThemeContextType {
  theme: ThemeName
  colors: ThemeColors
  setTheme: (theme: ThemeName) => void
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Theme definitions
const themeColors: Record<ThemeName, ThemeColors> = {
  dark: {
    background: "bg-[#121212]",
    text: "text-gray-300",
    primary: "text-[#00b4d8]",
    secondary: "text-gray-400",
    accent: "text-[#00b4d8]",
    border: "border-gray-800",
    card: "bg-[#1e1e1e]",
    cardText: "text-gray-300",
    buttonBg: "bg-[#00b4d8]",
    buttonText: "text-black",
    navBg: "bg-[#0a0a0a]",
    navText: "text-gray-300",
    terminalBg: "bg-[#121212]",
    terminalText: "text-gray-300",
    terminalPrompt: "text-[#00b4d8]",
    terminalBorder: "border-gray-800",
    scrollbarThumb: "bg-gray-700",
    scrollbarTrack: "bg-gray-900",
  },
  light: {
    background: "bg-white",
    text: "text-gray-800",
    primary: "text-[#0077b6]",
    secondary: "text-gray-600",
    accent: "text-[#0077b6]",
    border: "border-gray-300",
    card: "bg-gray-50",
    cardText: "text-gray-800",
    buttonBg: "bg-[#0077b6]",
    buttonText: "text-white",
    navBg: "bg-gray-100",
    navText: "text-gray-800",
    terminalBg: "bg-white",
    terminalText: "text-gray-800",
    terminalPrompt: "text-[#0077b6]",
    terminalBorder: "border-gray-300",
    scrollbarThumb: "bg-gray-300",
    scrollbarTrack: "bg-gray-100",
  },
  retro: {
    background: "bg-black",
    text: "text-green-400",
    primary: "text-green-500",
    secondary: "text-green-300",
    accent: "text-green-500",
    border: "border-green-900",
    card: "bg-[#0a0a0a]",
    cardText: "text-green-400",
    buttonBg: "bg-green-500",
    buttonText: "text-black",
    navBg: "bg-black",
    navText: "text-green-400",
    terminalBg: "bg-black",
    terminalText: "text-green-400",
    terminalPrompt: "text-green-500",
    terminalBorder: "border-green-900",
    scrollbarThumb: "bg-green-800",
    scrollbarTrack: "bg-black",
  },
  synthwave: {
    background: "bg-[#1a1a2e]",
    text: "text-[#f8f8f2]",
    primary: "text-[#f72585]",
    secondary: "text-[#4cc9f0]",
    accent: "text-[#f72585]",
    border: "border-[#6f42c1]",
    card: "bg-[#1e1e2e]",
    cardText: "text-[#f8f8f2]",
    buttonBg: "bg-[#f72585]",
    buttonText: "text-white",
    navBg: "bg-[#141425]",
    navText: "text-[#f8f8f2]",
    terminalBg: "bg-[#1e1e2e]",
    terminalText: "text-[#f8f8f2]",
    terminalPrompt: "text-[#ff79c6]",
    terminalBorder: "border-[#6f42c1]",
    scrollbarThumb: "bg-[#f72585]",
    scrollbarTrack: "bg-[#1a1a2e]",
  },
  hacker: {
    background: "bg-black",
    text: "text-green-500",
    primary: "text-green-500",
    secondary: "text-green-400",
    accent: "text-green-500",
    border: "border-green-900",
    card: "bg-[#0a0a0a]",
    cardText: "text-green-500",
    buttonBg: "bg-green-500",
    buttonText: "text-black",
    navBg: "bg-black",
    navText: "text-green-500",
    terminalBg: "bg-black",
    terminalText: "text-green-500",
    terminalPrompt: "text-green-500",
    terminalBorder: "border-green-900",
    scrollbarThumb: "bg-green-700",
    scrollbarTrack: "bg-black",
  },
  ocean: {
    background: "bg-[#0a192f]",
    text: "text-[#8892b0]",
    primary: "text-[#64ffda]",
    secondary: "text-blue-300",
    accent: "text-[#64ffda]",
    border: "border-[#64ffda]",
    card: "bg-[#112240]",
    cardText: "text-[#8892b0]",
    buttonBg: "bg-[#64ffda]",
    buttonText: "text-[#0a192f]",
    navBg: "bg-[#0a192f]",
    navText: "text-[#8892b0]",
    terminalBg: "bg-[#0a192f]",
    terminalText: "text-[#8892b0]",
    terminalPrompt: "text-[#64ffda]",
    terminalBorder: "border-[#64ffda]",
    scrollbarThumb: "bg-[#64ffda]",
    scrollbarTrack: "bg-[#0a192f]",
  },
  dracula: {
    background: "bg-[#282a36]",
    text: "text-[#f8f8f2]",
    primary: "text-[#bd93f9]",
    secondary: "text-[#6272a4]",
    accent: "text-[#ff79c6]",
    border: "border-[#bd93f9]",
    card: "bg-[#44475a]",
    cardText: "text-[#f8f8f2]",
    buttonBg: "bg-[#bd93f9]",
    buttonText: "text-[#282a36]",
    navBg: "bg-[#282a36]",
    navText: "text-[#f8f8f2]",
    terminalBg: "bg-[#282a36]",
    terminalText: "text-[#f8f8f2]",
    terminalPrompt: "text-[#bd93f9]",
    terminalBorder: "border-[#bd93f9]",
    scrollbarThumb: "bg-[#bd93f9]",
    scrollbarTrack: "bg-[#282a36]",
  },
  nord: {
    background: "bg-[#2e3440]",
    text: "text-[#eceff4]",
    primary: "text-[#88c0d0]",
    secondary: "text-[#81a1c1]",
    accent: "text-[#88c0d0]",
    border: "border-[#88c0d0]",
    card: "bg-[#3b4252]",
    cardText: "text-[#eceff4]",
    buttonBg: "bg-[#88c0d0]",
    buttonText: "text-[#2e3440]",
    navBg: "bg-[#2e3440]",
    navText: "text-[#eceff4]",
    terminalBg: "bg-[#2e3440]",
    terminalText: "text-[#eceff4]",
    terminalPrompt: "text-[#88c0d0]",
    terminalBorder: "border-[#88c0d0]",
    scrollbarThumb: "bg-[#88c0d0]",
    scrollbarTrack: "bg-[#2e3440]",
  },
}

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme: terminalTheme, setTheme: setTerminalTheme } = useTerminalStore()
  const [theme, setThemeState] = useState<ThemeName>("synthwave")

  // Sync with terminal theme
  useEffect(() => {
    setThemeState(terminalTheme)
  }, [terminalTheme])

  // Set theme function
  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme)
    setTerminalTheme(newTheme)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio-theme", newTheme)
    }
  }

  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("portfolio-theme") as ThemeName | null
      if (savedTheme && Object.keys(themeColors).includes(savedTheme)) {
        setTheme(savedTheme)
      }
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, colors: themeColors[theme], setTheme }}>{children}</ThemeContext.Provider>
  )
}

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
