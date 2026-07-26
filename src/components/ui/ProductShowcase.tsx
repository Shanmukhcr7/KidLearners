'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ProductShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mockupRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Pinning the showcase section
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=100%', // Pin for 100% of viewport height
      pin: true,
      pinSpacing: true,
    })

    // Scrubbed animation on the mockup (scale up slightly, fade in details)
    gsap.fromTo(mockupRef.current, 
      { scale: 0.95, opacity: 0.8 },
      {
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        }
      }
    )

    // Scrubbed image zoom inside the mockup
    gsap.fromTo(imageRef.current,
      { scale: 1.05 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        }
      }
    )

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="w-full min-h-screen bg-slate-50 flex items-center justify-center py-24 relative z-20">
      <div className="max-w-6xl mx-auto w-full px-6 flex flex-col items-center">
        
        <div className="mb-12 text-center w-full max-w-2xl mx-auto">
          <p className="editorial-italic text-[var(--stone)] text-xl mb-4">The Interface</p>
          <h2 className="font-display text-4xl lg:text-5xl text-slate-900 leading-tight">
            Designed for focus. Built for <span className="text-[var(--clay)]">results.</span>
          </h2>
        </div>

        {/* Refined Browser/Device Mockup */}
        <div 
          ref={mockupRef}
          className="w-full relative rounded-xl border border-[var(--hairline)] bg-[var(--paper)] shadow-2xl overflow-hidden aspect-[16/10] max-w-5xl"
        >
          {/* Browser Chrome */}
          <div className="w-full h-10 border-b border-[var(--hairline)] bg-slate-50 flex items-center px-4 gap-2 absolute top-0 left-0 z-10">
            <div className="w-3 h-3 rounded-full bg-[var(--border)] opacity-50" />
            <div className="w-3 h-3 rounded-full bg-[var(--border)] opacity-50" />
            <div className="w-3 h-3 rounded-full bg-[var(--border)] opacity-50" />
          </div>

          {/* Actual Product Screenshot Area */}
          <div className="absolute inset-0 top-10 overflow-hidden bg-slate-50">
            <Image 
              ref={imageRef}
              src="/images/path_journey.png" 
              alt="Dashboard interface preview" 
              fill
              className="object-cover object-top opacity-50 grayscale mix-blend-multiply" 
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            {/* Overlay placeholder since we don't have a real UI screenshot asset yet */}
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="bg-[var(--paper)]/80 backdrop-blur-md px-8 py-6 border border-[var(--hairline)] rounded-sm">
                  <p className="font-display text-slate-900 text-2xl">[ Product Interface ]</p>
               </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
