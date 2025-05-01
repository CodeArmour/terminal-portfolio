"use client"

import Terminal from "@/components/terminal/Terminal"
import FloatingButton from "@/components/terminal/FloatingButton"
import Hero from "@/components/sections/Hero"
import About from "@/components/sections/About"
import Projects from "@/components/sections/Projects"
import Skills from "@/components/sections/Skills"
import Contact from "@/components/sections/Contact"
import Navigation from "@/components/layout/Navigation"
import { ThemeProvider, useTheme } from "@/lib/context/ThemeContext"
import { useTerminalStore } from "@/lib/store/terminalStore"
import { useEffect } from "react"
import AnimatedBackground from "@/components/layout/AnimatedBackground"

export default function Home() {
  return (
    <ThemeProvider>
      <PortfolioContent />
    </ThemeProvider>
  )
}

// Separate component to use the theme context
function PortfolioContent() {
  const { colors } = useTheme()
  const { isOpen } = useTerminalStore()

  // Prevent scrolling of the main page when terminal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <main className={`min-h-screen ${colors.background} transition-colors duration-300`}>
      {/* Subtle animated background */}
      <AnimatedBackground />
      
      {/* Navigation */}
      <Navigation />

      {/* Main content sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </div>

      {/* Floating terminal */}
      <FloatingButton />
      <Terminal />
    </main>
  )
}
