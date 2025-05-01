"use client"

import type { ReactNode } from "react"
import { useInView } from "@/hooks/use-in-view"

interface FadeInViewProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  direction?: "up" | "down" | "left" | "right" | "none"
  distance?: number
  once?: boolean
}

export default function FadeInView({
  children,
  delay = 0,
  duration = 700,
  className = "",
  direction = "up",
  distance = 20,
  once = true,
}: FadeInViewProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.1 }, once)

  // Calculate transform based on direction
  const getTransform = () => {
    if (!isInView) {
      switch (direction) {
        case "up":
          return `translateY(${distance}px)`
        case "down":
          return `translateY(-${distance}px)`
        case "left":
          return `translateX(${distance}px)`
        case "right":
          return `translateX(-${distance}px)`
        case "none":
          return "none"
        default:
          return `translateY(${distance}px)`
      }
    }
    return "none"
  }

  return (
    <div
      ref={ref}
      className={`transition-all ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "none" : getTransform(),
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </div>
  )
}
