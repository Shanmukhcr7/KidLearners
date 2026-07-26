'use client'

import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CustomEase } from 'gsap/dist/CustomEase'

gsap.registerPlugin(CustomEase)
const PREMIUM_EASE = CustomEase.create("premium", "0.16, 1, 0.3, 1")

export function Preloader() {
  const [show, setShow] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check session storage to see if we've already shown the preloader this session
    const hasSeenPreloader = sessionStorage.getItem('hasSeenPreloader')
    if (!hasSeenPreloader) {
      setShow(true)
      sessionStorage.setItem('hasSeenPreloader', 'true')
    }
  }, [])

  useGSAP(() => {
    if (!show) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setShow(false)
      return
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(containerRef.current, { display: 'none' })
      }
    })

    // Typography resolve animation
    tl.fromTo('.preloader-text',
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: PREMIUM_EASE }
    )
    .to('.preloader-text', 
      { yPercent: -100, opacity: 0, duration: 0.8, ease: PREMIUM_EASE }, 
      "+=0.4"
    )
    // Slide the whole preloader up to reveal the site
    .to(containerRef.current,
      { yPercent: -100, duration: 1.2, ease: PREMIUM_EASE },
      "-=0.6"
    )

  }, { scope: containerRef, dependencies: [show] })

  if (!show) return null

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[100] bg-slate-50 flex items-center justify-center overflow-hidden"
    >
      <div className="overflow-hidden">
        <h1 className="preloader-text font-display text-4xl md:text-6xl text-slate-900">
          <img src="/images/logo.jpg" alt="KidLearners" className="h-16 w-auto mix-blend-multiply" />
        </h1>
      </div>
    </div>
  )
}
