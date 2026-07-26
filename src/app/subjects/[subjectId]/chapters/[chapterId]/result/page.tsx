'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { Chapter } from '@/lib/firebase/firestore'
import { Button } from '@/components/ui/Button'
import { CheckCircle, XCircle, Trophy, ArrowRight, ArrowCounterClockwise } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { FadeIn, PageTurn } from '@/components/ui/Transitions'
import { useReducedMotion } from 'framer-motion'

// Animated counter hook
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) {
      setValue(target)
      return
    }

    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setValue(Math.round(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, shouldReduceMotion])
  return value
}

export default function ResultPage() {
  const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>()
  const params  = useSearchParams()
  const shouldReduceMotion = useReducedMotion()

  const score        = Number(params.get('score') ?? 0)
  const passed       = params.get('passed') === 'true'
  const schoolRank   = params.get('rank') ? Number(params.get('rank')) : null
  const isFirstAttempt = params.get('first') === 'true'
  const xpEarned       = Number(params.get('xp') ?? 0)

  const [chapter, setChapter] = useState<Chapter | null>(null)
  const animatedScore = useCountUp(score)
  const animatedRank  = useCountUp(schoolRank ?? 0)

  useEffect(() => {
    getDoc(doc(db, 'chapters', chapterId)).then(d => {
      if (d.exists()) setChapter({ id: d.id, ...d.data() } as Chapter)
    })
  }, [chapterId])

  // Fire confetti only if passed, and dynamically import to save bundle size
  useEffect(() => {
    if (passed && !shouldReduceMotion) {
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F0654A', '#3F9E6E', '#F0A93B', '#6E5AA8']
        })
      })
    }
  }, [passed, shouldReduceMotion])

  return (
    <div className="min-h-screen bg-[var(--deep-night)] story-mode flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
      <PageTurn keyId="result-page">
        <div className="w-full max-w-lg mx-auto">

          {/* Result icon */}
          <FadeIn delay={0.1}>
            <div className={cn(
              'w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg border-4',
              passed ? 'bg-[var(--color-accent-green)]/20 border-[var(--color-accent-green)]' : 'bg-[var(--error)]/20 border-[var(--error)]'
            )}>
              {passed
                ? <CheckCircle weight="fill" className="w-14 h-14 text-[var(--color-accent-green)]" />
                : <XCircle     weight="fill" className="w-14 h-14 text-[var(--error)]" />}
            </div>

            {/* Heading */}
            <h1 className="font-display text-4xl text-white font-bold text-center mb-3">
              {passed ? <em className="text-[var(--color-accent-green)] not-italic">Victory!</em> : 'Quest Failed'}
            </h1>
            <p className="text-lg text-white/60 font-bold text-center mb-10">
              {chapter?.title}
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            {/* Score card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 mb-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 relative z-10">
                <p className="text-sm text-white/60 font-bold uppercase tracking-widest">Your score</p>
                <p className={cn("font-display text-5xl font-black tabular-nums", passed ? "text-white" : "text-[var(--error)]")}>
                  {animatedScore}%
                </p>
              </div>

              {/* Score bar */}
              <div className="w-full bg-white/10 rounded-full h-4 mb-6 overflow-hidden relative z-10 shadow-inner">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                    passed ? 'bg-[var(--color-accent-green)]' : 'bg-[var(--error)]'
                  )}
                  style={{ width: `${score}%` }}
                />
              </div>

              <div className="relative z-10">
                {isFirstAttempt ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4 p-4 bg-[var(--color-accent-yellow)]/10 border border-[var(--color-accent-yellow)]/30 rounded-xl">
                      <Trophy weight="fill" className="w-6 h-6 text-[var(--color-accent-yellow)] shrink-0" />
                      <p className="text-sm font-bold text-white leading-relaxed">
                        <strong className="text-[var(--color-accent-yellow)]">First attempt!</strong> This score counts toward your school&apos;s ranking.
                      </p>
                    </div>
                    {xpEarned > 0 && (
                      <div className="flex items-center gap-4 p-4 bg-[var(--color-accent-green)]/10 border border-[var(--color-accent-green)]/30 rounded-xl">
                        <span className="text-2xl shrink-0">✨</span>
                        <p className="text-sm font-bold text-white leading-relaxed">
                          You earned <strong className="text-[var(--color-accent-green)] text-lg">+{xpEarned} XP</strong>!
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-sm font-bold text-white/60 leading-relaxed">
                      Retake — only your first attempt counts for school ranking and XP. Keep practicing!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            {/* School rank card */}
            {isFirstAttempt && schoolRank !== null && (
              <div className="bg-[var(--twilight-purple)]/20 border border-[var(--twilight-purple)]/30 rounded-3xl p-6 mb-6 flex items-center gap-5 shadow-lg">
                <div className="w-14 h-14 bg-[var(--color-accent-yellow)] rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-[#e4a037]">
                  <Trophy weight="fill" className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/70 font-bold uppercase tracking-wider mb-1">School Rank</p>
                  <p className="font-display font-black text-3xl text-[var(--color-accent-yellow)] tabular-nums">
                    #{animatedRank}
                  </p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-xs font-bold text-white/50 leading-snug">Keep going!<br/>Quests = higher rank</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mt-8">
              <Link href={`/subjects/${subjectId}`} className="flex-1">
                <Button variant="secondary" className="w-full h-14 text-base border-white/20 text-white hover:bg-white/10">
                  ← Back
                </Button>
              </Link>

              {!passed ? (
                <Link href={`/subjects/${subjectId}/chapters/${chapterId}/quiz`} className="flex-1">
                  <Button className="w-full h-14 text-base">
                    <ArrowCounterClockwise weight="bold" className="w-5 h-5 mr-2" /> Retry
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard" className="flex-1">
                  <Button className="w-full h-14 text-base bg-[var(--color-accent-green)] hover:bg-[#32855b]">
                    Continue <ArrowRight weight="bold" className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </FadeIn>

        </div>
      </PageTurn>
    </div>
  )
}
