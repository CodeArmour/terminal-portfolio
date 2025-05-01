"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/lib/context/ThemeContext"

interface TerminalCommandProps {
  command: string
  output?: string
  autoType?: boolean
  onComplete?: () => void
  className?: string
  delay?: number
  typingSpeed?: number
}

export default function TerminalCommand({
  command,
  output,
  autoType = true,
  onComplete,
  className = "",
  delay = 0,
  typingSpeed = 50,
}: TerminalCommandProps) {
  const { colors } = useTheme()
  const [displayCommand, setDisplayCommand] = useState(autoType ? "" : command)
  const [displayOutput, setDisplayOutput] = useState("")
  const [showOutput, setShowOutput] = useState(false)
  const [isComplete, setIsComplete] = useState(!autoType)

  useEffect(() => {
    if (!autoType) {
      if (output) {
        setShowOutput(true)
        setDisplayOutput(output)
      }
      return
    }

    let timeout: NodeJS.Timeout

    // Initial delay
    timeout = setTimeout(() => {
      let commandIndex = 0

      // Type the command
      const commandInterval = setInterval(() => {
        if (commandIndex < command.length) {
          setDisplayCommand(command.substring(0, commandIndex + 1))
          commandIndex++
        } else {
          clearInterval(commandInterval)

          // Short pause after command is typed
          setTimeout(() => {
            setShowOutput(true)

            if (output) {
              let outputIndex = 0

              // Type the output
              const outputInterval = setInterval(() => {
                if (outputIndex < output.length) {
                  setDisplayOutput(output.substring(0, outputIndex + 1))
                  outputIndex++
                } else {
                  clearInterval(outputInterval)
                  setIsComplete(true)
                  if (onComplete) onComplete()
                }
              }, typingSpeed / 2)

              return () => clearInterval(outputInterval)
            } else {
              setIsComplete(true)
              if (onComplete) onComplete()
            }
          }, 500)
        }
      }, typingSpeed)

      return () => clearInterval(commandInterval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [command, output, autoType, onComplete, delay, typingSpeed])

  return (
    <div className={`font-mono text-sm ${className}`}>
      <div className="flex">
        <span className={colors.secondary}>$</span>
        <span className={`ml-2 ${colors.primary}`}>{displayCommand}</span>
        {autoType && !isComplete && <span className="inline-block w-2 h-4 bg-current animate-blink ml-0.5"></span>}
      </div>

      {showOutput && output && <div className={`mt-1 ${colors.text}`}>{displayOutput}</div>}
    </div>
  )
}
