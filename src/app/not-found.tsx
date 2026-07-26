'use client'

import Link from 'next/link'
import { FadeIn } from '@/components/ui/Transitions'
import { SplitTextReveal, MagneticElement } from '@/components/ui/GSAPAnimations'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Subtle background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30rem] font-display text-[var(--stone)] opacity-5 pointer-events-none select-none tracking-tighter">
        404
      </div>

      <FadeIn className="relative z-10 text-center max-w-2xl">
        <p className="editorial-italic text-[var(--clay)] text-xl mb-6">Page not found</p>
        
        <SplitTextReveal 
          text="The requested resource could not be located." 
          className="font-display text-4xl md:text-5xl leading-tight mb-12"
        />
        
        <div className="flex justify-center">
          <MagneticElement strength={0.3}>
            <Link href="/">
              <button className="h-16 px-8 bg-slate-900 text-slate-50 text-lg font-medium rounded-none hover:bg-[var(--clay)] transition-colors flex items-center gap-3">
                <ArrowLeft weight="bold" className="w-5 h-5" /> Return Home
              </button>
            </Link>
          </MagneticElement>
        </div>
      </FadeIn>
    </main>
  )
}
