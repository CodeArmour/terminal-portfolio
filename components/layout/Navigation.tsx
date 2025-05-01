"use client"

import { useState } from "react"
import { Menu, X, Terminal, Moon, Sun } from "lucide-react"
import { useTerminalStore } from "@/lib/store/terminalStore"
import { useTheme } from "@/lib/context/ThemeContext"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { openTerminal } = useTerminalStore()
  const { theme, colors, setTheme } = useTheme()

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    if (
      theme === "dark" ||
      theme === "synthwave" ||
      theme === "dracula" ||
      theme === "hacker" ||
      theme === "ocean" ||
      theme === "nord"
    ) {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  return (
    <nav className={`${colors.navBg} shadow-sm sticky top-0 z-30`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="#" className="flex-shrink-0 flex items-center">
              <Terminal className={`h-8 w-8 ${colors.primary}`} />
              <span className={`ml-5 text-xl font-bold ${colors.navText}`}>O.T.P</span>
            </a>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <a
              href="#about"
              className={`px-3 py-2 rounded-md text-sm font-medium ${colors.navText} hover:bg-opacity-10 hover:bg-white`}
            >
              About
            </a>
            <a
              href="#projects"
              className={`px-3 py-2 rounded-md text-sm font-medium ${colors.navText} hover:bg-opacity-10 hover:bg-white`}
            >
              Projects
            </a>
            <a
              href="#skills"
              className={`px-3 py-2 rounded-md text-sm font-medium ${colors.navText} hover:bg-opacity-10 hover:bg-white`}
            >
              Skills
            </a>
            <button
              onClick={openTerminal}
              className={`ml-4 px-3 py-2 rounded-md text-sm font-medium ${colors.buttonBg} ${colors.buttonText} hover:opacity-90`}
            >
              <span className="flex items-center">
                <Terminal size={16} className="mr-2" />
                Open Terminal
              </span>
            </button>
            <a
              href="#contact"
              className={`ml-4 px-5 py-2 rounded-full text-sm font-medium ${colors.buttonBg} ${colors.buttonText} hover:opacity-90`}
            >
              Let's Talk <span className="ml-1">→</span>
            </a>
          </div>

          {/* Dark mode toggle */}
          <div className="flex items-center">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-md ${colors.secondary} hover:${colors.primary}`}
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ||
              theme === "synthwave" ||
              theme === "dracula" ||
              theme === "hacker" ||
              theme === "ocean" ||
              theme === "nord" ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center ml-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md ${colors.secondary} hover:${colors.primary}`}
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${colors.navBg} shadow-lg`}>
            <a
              href="#about"
              className={`block px-3 py-2 rounded-md text-base font-medium ${colors.navText} hover:bg-opacity-10 hover:bg-white`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#projects"
              className={`block px-3 py-2 rounded-md text-base font-medium ${colors.navText} hover:bg-opacity-10 hover:bg-white`}
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </a>
            <a
              href="#skills"
              className={`block px-3 py-2 rounded-md text-base font-medium ${colors.navText} hover:bg-opacity-10 hover:bg-white`}
              onClick={() => setIsMenuOpen(false)}
            >
              Skills
            </a>
            <a
              href="#contact"
              className={`block px-3 py-2 rounded-md text-base font-medium ${colors.navText} hover:bg-opacity-10 hover:bg-white`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            <button
              onClick={() => {
                openTerminal()
                setIsMenuOpen(false)
              }}
              className={`w-full mt-2 flex items-center justify-center px-4 py-2 rounded-md text-base font-medium ${colors.buttonBg} ${colors.buttonText} hover:opacity-90`}
            >
              <Terminal size={16} className="mr-2" />
              Open Terminal
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
