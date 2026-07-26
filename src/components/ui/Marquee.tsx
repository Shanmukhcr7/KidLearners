'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

interface MarqueeProps {
  items: string[]
  speed?: number
  className?: string
}

export function Marquee({ items, speed = 1, className = "" }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const track = containerRef.current?.querySelector('.marquee-track')
    if (!track) return

    gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: 20 / speed,
      repeat: -1
    })

  }, { scope: containerRef })

  // Duplicate items to ensure smooth infinite scrolling
  const duplicatedItems = [...items, ...items, ...items, ...items]

  return (
    <div ref={containerRef} className={`w-full overflow-hidden bg-slate-900 text-slate-50 py-6 ${className}`}>
      <div className="marquee-track flex whitespace-nowrap w-max">
        {duplicatedItems.map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="font-display text-xl uppercase tracking-widest px-8">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)]" />
          </div>
        ))}
      </div>
    </div>
  )
}
