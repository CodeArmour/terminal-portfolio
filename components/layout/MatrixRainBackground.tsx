"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/lib/context/ThemeContext"

interface MatrixRainBackgroundProps {
  density?: number
  speed?: number
  opacity?: number
}

export default function MatrixRainBackground({ density = 25, speed = 1.5, opacity = 0.2 }: MatrixRainBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme, colors } = useTheme()
  const [isEnabled, setIsEnabled] = useState(true)

  // Disable animation for users who prefer reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mediaQuery.matches) {
      setIsEnabled(false)
    }

    const handleChange = () => setIsEnabled(!mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    if (!isEnabled || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Get primary color from theme for the brightest drops
    let primaryColor = "#00ff00" // Default matrix green
    if (theme === "hacker") {
      primaryColor = "#00ff00" // Bright green for hacker theme
    } else if (theme === "synthwave") {
      primaryColor = "#f72585" // Pink for synthwave
    } else if (theme === "dracula") {
      primaryColor = "#bd93f9" // Purple for dracula
    } else if (theme === "ocean") {
      primaryColor = "#64ffda" // Teal for ocean
    } else if (theme === "nord") {
      primaryColor = "#88c0d0" // Blue for nord
    }

    // Create drops
    const fontSize = 14
    const columns = Math.ceil(canvas.width / fontSize)
    const drops: Drop[] = []

    for (let i = 0; i < columns; i++) {
      drops.push({
        x: i * fontSize,
        y: Math.random() * canvas.height,
        speed: (Math.random() * 0.5 + 0.5) * speed,
        length: Math.floor(Math.random() * 15) + 5,
        chars: [],
        lastUpdate: 0,
        updateFrequency: Math.floor(Math.random() * 20) + 10,
      })

      // Initialize characters for this drop
      for (let j = 0; j < drops[i].length; j++) {
        drops[i].chars.push(getRandomBinary())
      }
    }

    // Animation loop
    let animationFrameId: number
    let frameCount = 0

    const render = () => {
      frameCount++

      // Semi-transparent black to create trail effect
      ctx.fillStyle = theme === "light" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set font
      ctx.font = `${fontSize}px monospace`

      // Draw each drop
      drops.forEach((drop, i) => {
        // Move drop
        drop.y += drop.speed

        // Reset when off screen with random offset
        if (drop.y > canvas.height + 100) {
          drop.y = -drop.length * fontSize - Math.random() * 1000
          drop.speed = (Math.random() * 0.5 + 0.5) * speed
        }

        // Update characters occasionally
        if (frameCount % drop.updateFrequency === 0) {
          const randomIndex = Math.floor(Math.random() * drop.chars.length)
          drop.chars[randomIndex] = getRandomBinary()
        }

        // Draw characters with gradient effect
        for (let j = 0; j < drop.chars.length; j++) {
          const charY = drop.y - j * fontSize

          // Skip if character is off-screen
          if (charY < -fontSize || charY > canvas.height + fontSize) continue

          // Calculate opacity based on position in the drop
          const charOpacity = opacity

          // First character is brightest
          if (j === 0) {
            ctx.fillStyle = primaryColor
            ctx.globalAlpha = Math.min(1, opacity * 2)
          }
          // Fade out for trailing characters
          else {
            const fadeRatio = 1 - j / drop.chars.length
            ctx.fillStyle = theme === "light" ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)"
            ctx.globalAlpha = fadeRatio * opacity
          }

          ctx.fillText(drop.chars[j], drop.x, charY)
        }
      })

      // Reset global alpha
      ctx.globalAlpha = 1

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isEnabled, theme, density, speed, opacity])

  if (!isEnabled) return null

  return (
    <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" aria-hidden="true" />
  )
}

// Helper function to get random binary digit
function getRandomBinary(): string {
  return Math.random() > 0.5 ? "1" : "0"
}

// Drop type
interface Drop {
  x: number
  y: number
  speed: number
  length: number
  chars: string[]
  lastUpdate: number
  updateFrequency: number
}
