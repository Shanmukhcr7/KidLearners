'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { CustomEase } from 'gsap/dist/CustomEase'

gsap.registerPlugin(ScrollTrigger, CustomEase)

// The premium Awwwards-style slow custom curve
const PREMIUM_EASE = CustomEase.create("premium", "0.16, 1, 0.3, 1")

export function SplitTextReveal({ text, className = "", delay = 0, highlightWord = "", highlightClass = "", triggerOnLoad = false }: { text: string, className?: string, delay?: number, highlightWord?: string, highlightClass?: string, triggerOnLoad?: boolean }) {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      // FIX: If reduced motion, we must manually reveal the text since it's hidden via CSS!
      gsap.set(".char", { yPercent: 0, opacity: 1, clearProps: "all" })
      return
    }

      gsap.fromTo(
        ".char",
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.03,
          duration: 1.2,
          ease: PREMIUM_EASE,
          delay: delay,
        ...(triggerOnLoad ? {} : {
          scrollTrigger: {
            trigger: container.current,
            start: "top 85%"
          }
        })
      }
    )
  }, { scope: container })

  const words = text.split(" ")

  return (
    <div ref={container} className={`${className} flex flex-wrap`}>
      {words.map((word, wordIndex) => {
        const isHighlight = highlightWord && highlightWord.includes(word.replace(/[^\w\s]/gi, '')) // rough strip punctuation for match
        return (
          // overflow-hidden is key to the clip-path/mask reveal effect
          <div key={wordIndex} className={`word flex overflow-hidden mr-[0.25em] ${isHighlight ? highlightClass : ''}`}>
            {word.split("").map((char, charIndex) => (
              <span key={charIndex} className="char inline-block translate-y-[120%] opacity-0" style={{ opacity: 0, visibility: 'visible' }}>
                {char}
              </span>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export function MagneticElement({ children, className = "", strength = 0.2 }: { children: React.ReactNode, className?: string, strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { height, width, left, top } = el.getBoundingClientRect()
      const x = clientX - (left + width / 2)
      const y = clientY - (top + height / 2)

      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.6,
        ease: "power3.out"
      })
    }

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: PREMIUM_EASE // Refined return, no bouncy spring
      })
    }

    el.addEventListener("mousemove", handleMouseMove)
    el.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      el.removeEventListener("mousemove", handleMouseMove)
      el.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [strength])

  return (
    <div ref={ref} className={`inline-block ${className}`}>
      {children}
    </div>
  )
}

export function NumberCounter({ value, className = "", suffix = "" }: { value: number, className?: string, suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      el.innerText = `${value}${suffix}`
      return
    }

    gsap.fromTo(el, { innerText: 0 }, {
      innerText: value,
      duration: 2.5,
      ease: PREMIUM_EASE,
      snap: { innerText: 1 },
      onUpdate: function() {
        el.innerText = `${Math.round(Number(this.targets()[0].innerText))}${suffix}`
      }
    })
  }, [value, suffix])

  return <span ref={ref} className={className}>{value}{suffix}</span>
}
