"use client"

import { ArrowDown, Terminal } from "lucide-react"
import { portfolioData } from "@/lib/data/portfolioData"
import { useTerminalStore } from "@/lib/store/terminalStore"
import { useTheme } from "@/lib/context/ThemeContext"

export default function Hero() {
  const { openTerminal } = useTerminalStore()
  const { colors } = useTheme()

  return (
    <section className={`min-h-screen flex flex-col justify-center items-center py-20 ${colors.background}`}>
      <div className="text-center space-y-6 max-w-3xl">
        <div
          className={`inline-block mb-4 px-4 py-1 ${colors.card} ${colors.primary} rounded-full ${colors.border} text-sm font-mono`}
        >
          <span className="flex items-center">
            <Terminal size={14} className="mr-2" />
            <span>Terminal Portfolio v1.0.0</span>
          </span>
        </div>

        <h1 className={`text-4xl md:text-6xl font-bold tracking-tight ${colors.text}`}>
          <span className="block">Hi, I&apos;m {portfolioData.about.name}</span>
          <span className="block mt-2 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            {portfolioData.about.title}
          </span>
        </h1>

        <p className={`text-xl ${colors.secondary} max-w-2xl mx-auto`}>
          Welcome to my interactive portfolio. Try using the terminal in the corner to explore my work!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <a
            href="#about"
            className={`px-6 py-3 rounded-lg ${colors.buttonBg} ${colors.buttonText} hover:opacity-90 transition-colors`}
          >
            Learn More
          </a>
          <button
            onClick={openTerminal}
            className={`px-6 py-3 rounded-lg ${colors.border} hover:bg-opacity-10 hover:bg-white transition-colors`}
          >
            Open Terminal
          </button>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className={colors.secondary} />
        </div>
      </div>
    </section>
  )
}
