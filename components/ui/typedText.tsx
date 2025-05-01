"use client"

import { useState, useEffect } from "react"
import { useInView } from "@/hooks/use-in-view"

interface TypedTextProps {
  text: string
  className?: string
  speed?: number
  delay?: number
  showCursor?: boolean
}

export default function TypedText({ text, className = "", speed = 50, delay = 0, showCursor = true }: TypedTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const { ref, isInView } = useInView<HTMLSpanElement>({ threshold: 0.3 })

  useEffect(() => {
    if (!isInView || isTyping) return

    setIsTyping(true)

    const timeout = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.substring(0, i + 1))
          i++
        } else {
          clearInterval(interval)
          setIsTyping(false)
        }
      }, speed)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [text, speed, delay, isInView, isTyping])

  return (
    <span ref={ref} className={className}>
      {displayText}
      {isTyping && showCursor && <span className="inline-block w-2 h-4 bg-current animate-blink ml-0.5"></span>}
    </span>
  )
}
