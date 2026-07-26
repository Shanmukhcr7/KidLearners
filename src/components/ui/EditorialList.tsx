'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { CustomEase } from 'gsap/dist/CustomEase'

gsap.registerPlugin(ScrollTrigger, CustomEase)
const PREMIUM_EASE = CustomEase.create("premium", "0.16, 1, 0.3, 1")

interface EditorialItem {
  id: string
  title: string
  desc: string
}

const ITEMS: EditorialItem[] = [
  { id: '01', title: 'Seamless Onboarding', desc: 'Secure login using only existing school credentials. No new passwords to manage.' },
  { id: '02', title: 'Structured Curriculum', desc: 'Students learn AI fundamentals through carefully paced narrative chapters.' },
  { id: '03', title: 'Verifiable Progress', desc: 'Interactive assessments ensure comprehension before advancing to new concepts.' },
  { id: '04', title: 'National Standing', desc: 'Every student victory contributes to your school’s position on the live leaderboard.' },
]

export function EditorialList() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // SVG Line Draw Animation
    gsap.utils.toArray<SVGPathElement>('.divider-line path').forEach((path) => {
      const length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: PREMIUM_EASE,
        scrollTrigger: {
          trigger: path,
          start: 'top 80%',
        }
      })
    })

    // Content Fade Up
    gsap.utils.toArray<HTMLElement>('.editorial-item').forEach((item, i) => {
      gsap.fromTo(item, 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: PREMIUM_EASE,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          }
        }
      )
    })

  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="w-full bg-slate-50 py-32 px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        
        {ITEMS.map((item, i) => (
          <div key={item.id} className="w-full">
            {/* SVG Hairline Divider */}
            <div className="w-full h-px relative mb-12 divider-line">
              <svg width="100%" height="1" preserveAspectRatio="none" className="absolute inset-0">
                <path d="M0 0.5 L10000 0.5" stroke="var(--border)" strokeWidth="1" fill="none" />
              </svg>
            </div>
            
            <div className="editorial-item grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
              <div className="md:col-span-3">
                <span className="font-display text-[var(--clay)] text-2xl tracking-tight">{item.id}</span>
              </div>
              <div className="md:col-span-9 pl-0 md:pl-12">
                <h3 className="font-display text-slate-900 text-3xl md:text-4xl mb-6 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[var(--stone)] text-lg md:text-xl leading-relaxed max-w-2xl font-sans">
                  {item.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Final Divider */}
        <div className="w-full h-px relative divider-line">
          <svg width="100%" height="1" preserveAspectRatio="none" className="absolute inset-0">
            <path d="M0 0.5 L10000 0.5" stroke="var(--border)" strokeWidth="1" fill="none" />
          </svg>
        </div>

      </div>
    </section>
  )
}
