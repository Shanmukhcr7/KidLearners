'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/client'
import type { Chapter } from '@/lib/firebase/firestore'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, CheckCircle } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { PageTurn } from '@/components/ui/Transitions'

interface ClientQuestion {
  questionText: string
  options:      string[]
  points:       number
}

export default function QuizPage() {
  const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>()
  const router = useRouter()

  const [chapter,   setChapter]   = useState<Chapter | null>(null)
  const [questions, setQuestions] = useState<ClientQuestion[]>([])
  const [answers,   setAnswers]   = useState<(number | null)[]>([])
  const [loading,   setLoading]   = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [current,   setCurrent]   = useState(0)

  useEffect(() => {
    async function load() {
      const chapSnap = await getDoc(doc(db, 'chapters', chapterId))
      if (!chapSnap.exists()) { router.push('/subjects'); return }
      const chap = { id: chapSnap.id, ...chapSnap.data() } as Chapter
      setChapter(chap)

      if (!chap.quizId) { toast.error('No quiz for this chapter'); return }

      const quizSnap = await getDoc(doc(db, 'quizzes', chap.quizId))
      if (!quizSnap.exists()) return

      const quizData = quizSnap.data()
      const qs: ClientQuestion[] = (quizData.questions ?? []).map((q: ClientQuestion) => ({
        questionText: q.questionText,
        options:      q.options,
        points:       q.points,
      }))
      setQuestions(qs)
      setAnswers(new Array(qs.length).fill(null))
      setLoading(false)
    }
    load()
  }, [chapterId, router])

  function selectAnswer(optIdx: number) {
    setAnswers(prev => {
      const next = [...prev]
      next[current] = optIdx
      return next
    })
  }

  async function handleSubmit() {
    if (answers.some(a => a === null)) {
      toast.error('Answer all questions before submitting')
      return
    }
    if (!chapter?.quizId || !auth.currentUser) return

    setSubmitting(true)
    try {
      const idToken = await auth.currentUser.getIdToken()
      const res = await fetch('/api/quiz/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          answers,
          chapterId,
          quizId: chapter.quizId,
        }),
      })

      const result = await res.json()
      if (!res.ok) { toast.error(result.error ?? 'Grading failed'); setSubmitting(false); return }

      router.push(
        `/subjects/${subjectId}/chapters/${chapterId}/result?` +
        new URLSearchParams({
          score:     String(result.score),
          passed:    String(result.passed),
          rank:      String(result.schoolRank ?? ''),
          first:     String(result.isFirstAttempt),
          xp:        String(result.xpEarned ?? 0),
        })
      )
    } catch {
      toast.error('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[var(--deep-night)] story-mode flex items-center justify-center">
      <div className="skeleton bg-white/10 h-64 w-full max-w-lg rounded-2xl" />
    </div>
  )

  const q       = questions[current]
  const allDone = answers.every(a => a !== null)

  return (
    <div className="min-h-screen bg-[var(--deep-night)] story-mode overflow-hidden">
      <header className="sticky top-0 bg-[var(--deep-night)]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center gap-4 z-40">
        <Link href={`/subjects/${subjectId}/chapters/${chapterId}`} className="text-white/60 hover:text-white transition-colors p-2 bg-white/5 rounded-lg hover:bg-white/10">
          <ArrowLeft weight="bold" className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <p className="text-base font-bold text-white">Quiz — {chapter?.title}</p>
        </div>
        <p className="text-sm font-bold text-[var(--color-accent-yellow)] bg-[var(--color-accent-yellow)]/10 px-3 py-1 rounded-lg border border-[var(--color-accent-yellow)]/20 tabular-nums">
          {current + 1} / {questions.length}
        </p>
      </header>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 px-6 pt-10">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              'h-2.5 rounded-full transition-all duration-300 ease-out cursor-pointer hover:opacity-80',
              i === current       ? 'bg-[var(--color-accent-yellow)] w-10 shadow-[0_0_10px_var(--color-accent-yellow)]' :
              answers[i] !== null ? 'bg-[var(--color-accent-green)] w-4' :
              'bg-white/20 w-4'
            )}
          />
        ))}
      </div>

      <PageTurn keyId={`quiz-q-${current}`}>
        <div className="max-w-xl mx-auto px-6 py-12">
          {/* Question */}
          <div className="mb-10 text-center">
            <p className="text-sm font-bold text-[var(--sunset-coral)] uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
               Question {current + 1}
               <span className="w-1 h-1 rounded-full bg-white/20" />
               {q?.points} pts
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
              {q?.questionText}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-12">
            {q?.options.map((opt, oIdx) => {
              const selected = answers[current] === oIdx
              return (
                <button
                  key={oIdx}
                  onClick={() => selectAnswer(oIdx)}
                  className={cn(
                    'w-full text-left px-6 py-5 rounded-2xl border-2 text-lg font-bold transition-all duration-200 shadow-sm flex items-center',
                    selected
                      ? 'border-[var(--color-accent-yellow)] bg-[var(--color-accent-yellow)]/10 text-white shadow-[0_4px_12px_rgba(240,169,59,0.15)] scale-[1.02]'
                      : 'border-white/10 bg-white/5 text-white hover:border-white/30 hover:bg-white/10 hover:scale-[1.01]'
                  )}
                >
                  <span className={cn(
                    'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mr-4 shrink-0 transition-colors',
                    selected ? 'bg-[var(--color-accent-yellow)] text-slate-900' : 'bg-white/10 text-white/50'
                  )}>
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {selected && <CheckCircle weight="fill" className="w-6 h-6 text-[var(--color-accent-yellow)] ml-3 shrink-0" />}
                </button>
              )
            })}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 items-center">
            {current > 0 ? (
              <Button variant="secondary" onClick={() => setCurrent(c => c - 1)} className="border-white/20 text-white hover:bg-white/10 text-base h-14 px-6 w-32">
                ← Prev
              </Button>
            ) : (
              <div className="w-32" />
            )}
            
            <div className="flex-1 flex justify-center">
              {!allDone && current === questions.length - 1 && (
                <p className="text-sm font-bold text-white/40">
                  {answers.filter(a => a !== null).length} of {questions.length} answered
                </p>
              )}
            </div>

            {current < questions.length - 1 ? (
              <Button onClick={() => setCurrent(c => c + 1)} className="text-base h-14 px-6 w-32">
                Next →
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={submitting}
                disabled={!allDone}
                className="text-base h-14 px-8 min-w-[128px] bg-[var(--color-accent-green)] hover:bg-[#32855b] text-white"
              >
                Submit
              </Button>
            )}
          </div>
        </div>
      </PageTurn>
    </div>
  )
}
