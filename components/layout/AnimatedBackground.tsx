"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/lib/context/ThemeContext"

interface AnimatedBackgroundProps {
  density?: number
  speed?: number
  opacity?: number
}

export default function AnimatedBackground({ density = 15, speed = 2, opacity = 0.07 }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
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

  // Skip animation on mobile devices to save battery
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      setIsEnabled(false)
    }
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

    // Create particles
    const particleCount = Math.floor((canvas.width * canvas.height) / 10000) * density
    const particles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * speed * 0.1,
        speedY: (Math.random() - 0.5) * speed * 0.1,
        char: getRandomChar(),
        opacity: Math.random() * opacity,
        updateFrequency: Math.floor(Math.random() * 100) + 50,
        lastUpdate: 0,
      })
    }

    // Animation loop
    let animationFrameId: number
    let frameCount = 0

    const render = () => {
      frameCount++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set text properties based on theme
      ctx.font = "12px monospace"
      ctx.fillStyle = theme === "light" ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)"

      // Update and draw particles
      particles.forEach((particle) => {
        // Move particle
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Occasionally change character
        if (frameCount % particle.updateFrequency === 0) {
          particle.char = getRandomChar()
        }

        // Draw character
        ctx.globalAlpha = particle.opacity
        ctx.fillText(particle.char, particle.x, particle.y)
      })

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

// Helper function to get random character
function getRandomChar(): string {
  const chars = "01"
  return chars.charAt(Math.floor(Math.random() * chars.length))
}

// Particle type
interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  char: string
  opacity: number
  updateFrequency: number
  lastUpdate: number
}
