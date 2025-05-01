"use client"

import { useState, useEffect, useRef } from "react"

export function useInView<T extends HTMLElement = HTMLDivElement>(options?: IntersectionObserverInit, once = true) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        if (once && observer && ref.current) {
          observer.unobserve(ref.current)
        }
      } else if (!once) {
        setIsInView(false)
      }
    }, options)

    observer.observe(ref.current)

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [options, once])

  return { ref, isInView }
}
