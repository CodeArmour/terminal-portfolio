"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useTerminalStore } from "@/lib/store/terminalStore"
import { executeCommand } from "@/lib/terminal/commandHandler"
import { X, Maximize2, Minimize2 } from "lucide-react"
import { asciiArt } from "@/lib/terminal/asciiArt"
import { useTheme, type ThemeName } from "@/lib/context/ThemeContext"
import { useCommandState } from "@/lib/terminal/commandState"
import { handleInteractiveCommand } from "@/lib/terminal/interactiveCommands"

// Add TypeScript interface for the window object
declare global {
  interface Window {
    applyTheme?: (theme: string) => void
  }
}

export default function Terminal() {
  const { isOpen, closeTerminal } = useTerminalStore()
  const { theme, setTheme, colors } = useTheme()
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentPath, setCurrentPath] = useState("/")
  const [isAdmin, setIsAdmin] = useState(false)
  const [output, setOutput] = useState<
    Array<{ type: string; content: string | React.ReactNode; path?: string; username?: string }>
  >([
    { type: "ascii", content: asciiArt },
    {
      type: "welcome",
      content:
        "Welcome to my interactive terminal portfolio!\n\nType help to see available commands.\nTry ls to list sections or cat about.txt to learn about me.",
    },
    { type: "prompt", content: "visitor@portfolio:~$", path: "/", username: "visitor" },
  ])
  const [cursorPosition, setCursorPosition] = useState(0)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [customPrompt, setCustomPrompt] = useState<string | null>(null)

  // Get command state
  const commandState = useCommandState()

  // Draggable terminal state
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [previousPosition, setPreviousPosition] = useState({ x: 0, y: 0 })
  const [previousSize, setPreviousSize] = useState({ width: 800, height: 500 })

  const terminalRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const terminalWrapperRef = useRef<HTMLDivElement>(null)

  // Format path for display in prompt
  const formatPathForPrompt = (path: string) => {
    if (path === "/") return "~"
    return path
  }

  // Determine if the current theme is dark
  const isDarkTheme = () => {
    return ["dark", "synthwave", "hacker", "ocean", "dracula", "nord"].includes(theme)
  }

  // Get input text color based on theme
  const getInputTextColor = () => {
    return isDarkTheme() ? "text-white" : "text-gray-800"
  }

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Focus terminal when it opens
  useEffect(() => {
    if (isOpen && containerRef.current) {
      containerRef.current.focus()

      // Center the terminal on the screen when it first opens
      if (terminalWrapperRef.current && !isDragging && position.x === 0 && position.y === 0) {
        const isMobile = window.innerWidth <= 768

        if (isMobile) {
          // On mobile, position near the top with some margin
          setPosition({
            x: window.innerWidth * 0.025,
            y: 20,
          })
        } else {
          // On desktop, center the terminal
          const rect = terminalWrapperRef.current.getBoundingClientRect()
          const centerX = (window.innerWidth - rect.width) / 2
          const centerY = (window.innerHeight - rect.height) / 2
          setPosition({ x: centerX, y: centerY })
        }
      }
    }
  }, [isOpen, position.x, position.y, isDragging])

  // Scroll to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      // Use smooth scrolling for a better experience
      terminalRef.current.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [output])

  // Also scroll when input changes to keep cursor in view
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [input])

  // Add a global function to apply themes that can be called from the HTML output
  const applyTheme = useCallback(
    (themeName: string) => {
      setTheme(themeName as ThemeName)
    },
    [setTheme],
  )

  // Make the applyTheme function available globally
  useEffect(() => {
    window.applyTheme = applyTheme
    return () => {
      delete window.applyTheme
    }
  }, [applyTheme])

  // Add output to the terminal
  const addOutput = useCallback((content: string | React.ReactNode, type = "result") => {
    setOutput((prev) => [...prev, { type, content }])

    // Ensure we scroll to the bottom after adding output
    setTimeout(scrollToBottom, 100)
  }, [])

  // Add a new prompt to the terminal
  const addPrompt = useCallback(
    (customPromptText?: string) => {
      const username = isAdmin ? "admin" : "visitor"
      const basePrompt = `${username}@portfolio:${formatPathForPrompt(currentPath)}$`

      if (customPromptText) {
        setCustomPrompt(customPromptText)
      } else {
        setCustomPrompt(null)
      }

      setOutput((prev) => [
        ...prev,
        {
          type: "prompt",
          content: basePrompt,
          path: currentPath,
          username: username, // Store the username with the prompt
        },
      ])
    },
    [isAdmin, currentPath],
  )

  // Handle command execution
  const handleSubmit = async () => {
    if (!input.trim() && commandState.state === "idle") {
      // Just add a new prompt line if input is empty and not in interactive mode
      addPrompt()
      setInput("")
      return
    }

    // Add command to history if not empty
    if (input.trim()) {
      const newHistory = [...commandHistory, input]
      setCommandHistory(newHistory)
      setHistoryIndex(-1)
    }

    // Get the username for the prompt (from the last prompt)
    const lastPrompt = [...output].reverse().find((item) => item.type === "prompt")
    const username = lastPrompt?.username || (isAdmin ? "admin" : "visitor")
    const basePrompt = `${username}@portfolio:${formatPathForPrompt(currentPath)}$`

    // Add the command to output with the appropriate prompt
    setOutput((prev) => [
      ...prev.slice(0, -1), // Remove the last prompt
      {
        type: "command",
        content: customPrompt ? `${customPrompt} ${input}` : input,
        path: prev[prev.length - 1].path,
        username: username, // Store the username with the command
      }, // Add the command with previous path
    ])

    // Check if we're in an interactive command state
    if (commandState.state !== "idle") {
      // Process the interactive command
      const result = await handleInteractiveCommand(input, commandState, addOutput)

      // If the command is complete, add a new prompt without custom text
      if (result.complete) {
        addPrompt()
      } else if (result.prompt) {
        // If there's a new prompt, add it
        addPrompt(result.prompt)
      }

      setInput("")
      setCursorPosition(0)
      setTimeout(scrollToBottom, 100)
      return
    }

    // Special case for clear command
    if (input.trim().toLowerCase() === "clear") {
      setOutput([{ type: "prompt", content: basePrompt, path: currentPath, username }])
      setInput("")
      return
    }

    // Execute command and get result
    const result = await executeCommand(input, currentPath, isAdmin)

    // Handle close terminal command
    if (result.closeTerminal) {
      closeTerminal()
      return
    }

    // Update state based on command result
    const newPath = result.newPath || currentPath

    // Update admin status if command result changed it
    if (result.adminStatus !== undefined) {
      setIsAdmin(result.adminStatus)
    }

    // Update path if command result changed it
    if (result.newPath) {
      setCurrentPath(result.newPath)
    }

    // Add result to output if there is one
    if (result.output) {
      setOutput((prev) => [...prev, { type: result.type || "result", content: result.output }])
    }

    // Add a new prompt with the current admin status
    const newUsername = result.adminStatus !== undefined ? (result.adminStatus ? "admin" : "visitor") : username
    setOutput((prev) => [
      ...prev,
      {
        type: "prompt",
        content: `${newUsername}@portfolio:${formatPathForPrompt(newPath)}$`,
        path: newPath,
        username: newUsername, // Store the username with the prompt
      },
    ])

    // Clear input
    setInput("")
    setCursorPosition(0)

    // Ensure we scroll to the bottom after command execution
    setTimeout(scrollToBottom, 100)
  }

  // Ensure terminal is scrolled to bottom
  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [])

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Always prevent default for space key to avoid page scrolling
    if (e.key === " ") {
      e.preventDefault()
      // Insert space at cursor position
      setInput(input.slice(0, cursorPosition) + " " + input.slice(cursorPosition))
      setCursorPosition(cursorPosition + 1)
      return
    }

    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        const command = commandHistory[commandHistory.length - 1 - newIndex]
        setInput(command)
        setCursorPosition(command.length)
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        const command = commandHistory[commandHistory.length - 1 - newIndex]
        setInput(command)
        setCursorPosition(command.length)
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
        setCursorPosition(0)
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      if (cursorPosition > 0) {
        setCursorPosition(cursorPosition - 1)
      }
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      if (cursorPosition < input.length) {
        setCursorPosition(cursorPosition + 1)
      }
    } else if (e.key === "Home") {
      e.preventDefault()
      setCursorPosition(0)
    } else if (e.key === "End") {
      e.preventDefault()
      setCursorPosition(input.length)
    } else if (e.key === "Backspace") {
      e.preventDefault()
      if (cursorPosition > 0) {
        setInput(input.slice(0, cursorPosition - 1) + input.slice(cursorPosition))
        setCursorPosition(cursorPosition - 1)
      }
    } else if (e.key === "Delete") {
      e.preventDefault()
      if (cursorPosition < input.length) {
        setInput(input.slice(0, cursorPosition) + input.slice(cursorPosition + 1))
      }
    } else if (e.key === "Tab") {
      e.preventDefault() // Prevent tab from changing focus
    } else if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault() // Prevent page scrolling
    } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault() // Prevent any default behavior for typing characters
      // Insert character at cursor position
      setInput(input.slice(0, cursorPosition) + e.key + input.slice(cursorPosition))
      setCursorPosition(cursorPosition + 1)
    }
  }

  // Handle key up events to prevent propagation
  const handleKeyUp = (e: React.KeyboardEvent) => {
    // Prevent spacebar and other navigation keys from scrolling
    if (
      e.key === " " ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "PageUp" ||
      e.key === "PageDown" ||
      e.key === "Home" ||
      e.key === "End"
    ) {
      e.preventDefault()
    }
  }

  // Handle clicks to focus the terminal
  const handleClick = () => {
    if (containerRef.current) {
      containerRef.current.focus()
    }
  }

  // Draggable terminal functions
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isFullscreen) return

    // Only start dragging if clicking on the header (not on buttons)
    if ((e.target as HTMLElement).closest("button")) return

    setIsDragging(true)
    const rect = terminalWrapperRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      // Calculate new position
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y

      // Get terminal dimensions
      const terminalWidth = terminalWrapperRef.current?.offsetWidth || 800
      const terminalHeight = terminalWrapperRef.current?.offsetHeight || 500

      // Ensure terminal stays within viewport bounds
      const maxX = window.innerWidth - terminalWidth
      const maxY = window.innerHeight - terminalHeight

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      })
    },
    [isDragging, dragOffset],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add and remove event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    } else {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (isFullscreen) {
      // Return to previous position and size
      setPosition(previousPosition)
      setIsFullscreen(false)
    } else {
      // Save current position and size
      setPreviousPosition(position)
      setPreviousSize({
        width: terminalWrapperRef.current?.offsetWidth || 800,
        height: terminalWrapperRef.current?.offsetHeight || 500,
      })
      // Set to fullscreen
      setPosition({ x: 0, y: 0 })
      setIsFullscreen(true)
    }
  }

  // Add a new useEffect to handle window resizing:
  useEffect(() => {
    const handleResize = () => {
      if (isOpen && !isFullscreen) {
        const isMobile = window.innerWidth <= 768

        // If terminal would be off-screen after resize, reposition it
        if (position.x + (isMobile ? window.innerWidth * 0.95 : 800) > window.innerWidth) {
          setPosition((prev) => ({
            ...prev,
            x: Math.max(0, window.innerWidth - (isMobile ? window.innerWidth * 0.95 : 800)),
          }))
        }

        // If on a small screen, consider auto-switching to fullscreen
        if (window.innerWidth < 640 && !isFullscreen) {
          setIsFullscreen(true)
        }
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isOpen, isFullscreen, position.x, position.y])

  // REMOVED: We no longer update all prompts when admin status changes
  // This was causing all previous prompts to change

  if (!isOpen) return null

  return (
    <div
      ref={terminalWrapperRef}
      className={`fixed z-50 transition-all duration-200 ${isFullscreen ? "inset-0" : ""}`}
      style={
        isFullscreen
          ? undefined
          : {
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: window.innerWidth <= 768 ? "95vw" : "800px",
              height: window.innerWidth <= 768 ? "80vh" : "500px",
              maxWidth: "95vw",
              maxHeight: "80vh",
            }
      }
    >
      <div
        className={` ${colors.terminalBg} rounded-lg shadow-2xl 
               flex flex-col overflow-hidden
               transition-all duration-200 ${colors.terminalBorder}
               h-full`}
        onClick={handleClick}
      >
        {/* Terminal header - draggable area */}
        <div
          className={`flex items-center px-4 py-3 ${colors.terminalBg} border-b ${colors.terminalBorder} border-opacity-20 cursor-move`}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 text-center text-sm font-mono text-gray-400">
            {isAdmin ? "admin" : "visitor"}@portfolio:{formatPathForPrompt(currentPath)}
          </div>
          <div className="flex space-x-3">
            <button onClick={toggleFullscreen} className="text-gray-400 hover:text-gray-300 transition-colors">
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button onClick={closeTerminal} className="text-gray-400 hover:text-gray-300 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Terminal output */}
        <div
          ref={terminalRef}
          className={`flex-1 p-4 font-mono text-sm overflow-y-auto ${colors.terminalBg} focus:outline-none
      scrollbar scrollbar-thin scrollbar-track-${colors.scrollbarTrack} scrollbar-thumb-${colors.scrollbarThumb}`}
          tabIndex={-1}
          ref={containerRef}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        >
          {output.map((line, index) => {
            if (line.type === "ascii") {
              return (
                <div key={index} className={`mb-4 ${colors.terminalText} whitespace-pre`}>
                  {line.content}
                </div>
              )
            } else if (line.type === "welcome") {
              return (
                <div key={index} className={`mb-4 ${colors.terminalText}`}>
                  {line.content}
                </div>
              )
            } else if (line.type === "prompt") {
              return (
                <div key={index} className="flex items-start">
                  <span className={`${colors.terminalPrompt} mr-0`}>
                    {line.content}
                    {index === output.length - 1 && customPrompt && (
                      <span className={`ml-1 ${colors.terminalText}`}>{customPrompt} </span>
                    )}
                  </span>
                  {index === output.length - 1 && (
                    <span className="relative">
                      <span className={`ml-1 ${getInputTextColor()}`}>{input}</span>
                      <span
                        className={`absolute top-0 left-0 ml-1 ${cursorVisible ? "opacity-100" : "opacity-0"}`}
                        style={{ transform: `translateX(${cursorPosition}ch)` }}
                      >
                        <span className="inline-block w-2 h-5 bg-gray-300 -mb-0.5"></span>
                      </span>
                    </span>
                  )}
                </div>
              )
            } else if (line.type === "command") {
              const promptPath = line.path ? formatPathForPrompt(line.path) : "~"
              const username = line.username || (isAdmin ? "admin" : "visitor")
              return (
                <div key={index} className="flex items-start">
                  <span className={`${colors.terminalPrompt} mr-0`}>
                    {username}@portfolio:{promptPath}${" "}
                  </span>
                  <span className={isDarkTheme() ? "text-white" : "text-gray-800"}>{line.content}</span>
                </div>
              )
            } else if (line.type === "error") {
              return (
                <div key={index} className="text-red-400 mb-2">
                  {line.content}
                </div>
              )
            } else if (line.type === "html") {
              return (
                <div key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: line.content as string }}></div>
              )
            } else {
              return (
                <div key={index} className={`${colors.terminalText} mb-2 whitespace-pre-wrap`}>
                  {line.content}
                </div>
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}
