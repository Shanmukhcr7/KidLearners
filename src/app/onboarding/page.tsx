'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase/client'
import { doc, updateDoc, collection, getDocs } from 'firebase/firestore'
import type { Subject } from '@/lib/firebase/firestore'
import { Button } from '@/components/ui/Button'
import { BookOpen, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

const SELF_ASSESSMENT = [
  {
    q: 'Have you heard of Artificial Intelligence before?',
    options: ['Never', 'A little', 'Quite a bit', 'I know a lot'],
    scores:  [0, 1, 2, 3],
  },
  {
    q: 'Which best describes your experience with technology?',
    options: ['I just use apps', 'I understand how apps work', 'I can code a little', 'I can build things'],
    scores:  [0, 1, 2, 3],
  },
  {
    q: 'How comfortable are you with math?',
    options: ['Prefer to avoid it', 'Basic arithmetic is fine', 'Algebra is okay', 'I enjoy math'],
    scores:  [0, 1, 2, 3],
  },
]

function getTier(score: number): 'beginner' | 'intermediate' | 'advanced' {
  if (score <= 3) return 'beginner'
  if (score <= 6) return 'intermediate'
  return 'advanced'
}

export default function OnboardingPage() {
  const router    = useRouter()
  const [step,    setStep]    = useState(0)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [qaIdx,    setQaIdx]   = useState(0)
  const [scores,   setScores]  = useState<number[]>([])
  const [saving,   setSaving]  = useState(false)

  useEffect(() => {
    getDocs(collection(db, 'subjects')).then(snap => {
      setSubjects(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Subject))
    })
  }, [])

  function toggleSubject(id: string) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  function selectAssessment(score: number) {
    const next = [...scores, score]
    setScores(next)
    if (qaIdx < SELF_ASSESSMENT.length - 1) {
      setQaIdx(i => i + 1)
    } else {
      // Done with assessment — move to saving step
      setStep(3)
    }
  }

  async function finishOnboarding() {
    const user = auth.currentUser
    if (!user) return
    setSaving(true)
    try {
      const totalScore = scores.reduce((a, b) => a + b, 0)
      const tier       = getTier(totalScore)

      await updateDoc(doc(db, 'students', user.uid), {
        subjectsInterested: selected,
        difficultyTier:     tier,
      })

      toast.success("You're all set! Let's learn.")
      router.push('/dashboard')
    } catch {
      toast.error('Could not save preferences')
      setSaving(false)
    }
  }

  const STEPS = ['Subjects', 'Self-assessment', 'Done']

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-12">
        <div className="flex items-center gap-2 mb-8 justify-center lg:justify-start">
          <img src="/images/logo.jpg" alt="KidLearners" className="h-10 w-auto mix-blend-multiply" />
        </div>

      {/* Step indicators */}
      <div className="flex items-center gap-3 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < step
                ? 'bg-[#16A34A] text-white'
                : i === step
                ? 'bg-[var(--color-accent-yellow)] text-white'
                : 'bg-slate-100 text-slate-500'
            }`}>
              {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:block ${i === step ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-slate-100" />}
          </div>
        ))}
      </div>

      {/* Step 0 — Subject selection */}
      {step === 0 && (
        <div className="w-full max-w-lg">
          <h1 className="font-display text-3xl text-slate-900 text-center mb-2">
            What interests you?
          </h1>
          <p className="text-sm text-slate-500 text-center mb-8">
            Pick the subjects you're most excited to explore. You can always change these later.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {subjects.map(sub => {
              const isSelected = selected.includes(sub.id)
              return (
                <button
                  key={sub.id}
                  onClick={() => toggleSubject(sub.id)}
                  className={`p-4 rounded-[12px] border-2 text-left transition-all duration-150 ${
                    isSelected
                      ? 'border-[#E0A526] bg-[var(--color-accent-yellow)]/8'
                      : 'border-slate-200 bg-white hover:border-[#E0A526]/40'
                  }`}
                >
                  <div className="text-2xl mb-2">📚</div>
                  <p className={`text-sm font-semibold ${isSelected ? 'text-slate-900' : 'text-slate-900'}`}>
                    {sub.name}
                  </p>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-yellow)] mt-1" />}
                </button>
              )
            })}
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={() => setStep(1)}
            disabled={selected.length === 0}
          >
            Continue →
          </Button>
        </div>
      )}

      {/* Step 1 — Self-assessment */}
      {step === 1 && (
        <div className="w-full max-w-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-center mb-2">
            Question {qaIdx + 1} of {SELF_ASSESSMENT.length}
          </p>
          <h2 className="font-sora text-xl font-bold text-slate-900 text-center mb-8">
            {SELF_ASSESSMENT[qaIdx].q}
          </h2>

          <div className="space-y-3">
            {SELF_ASSESSMENT[qaIdx].options.map((opt, i) => (
              <button
                key={opt}
                onClick={() => selectAssessment(SELF_ASSESSMENT[qaIdx].scores[i])}
                className="w-full text-left px-5 py-4 rounded-[12px] border border-slate-200 bg-white text-slate-900 text-sm font-medium hover:border-[#E0A526] hover:bg-[var(--color-accent-yellow)]/5 transition-all"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 — Building path */}
      {step === 3 && (
        <div className="w-full max-w-sm text-center">
          <div className="w-20 h-20 bg-[var(--color-accent-yellow)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-[var(--color-accent-yellow)]" />
          </div>
          <h2 className="font-display text-3xl text-slate-900 mb-3">
            All set,{' '}
            <em>
              {getTier(scores.reduce((a, b) => a + b, 0))}
              {' '}learner!
            </em>
          </h2>
          <p className="text-sm text-slate-500 mb-8">
            We&apos;ve set your learning path to <strong className="text-slate-900 capitalize">{getTier(scores.reduce((a, b) => a + b, 0))}</strong> difficulty based on your answers.
            You can always adjust this in your profile.
          </p>
          <Button className="w-full" size="lg" onClick={finishOnboarding} loading={saving}>
            Go to my dashboard →
          </Button>
        </div>
      )}
    </div>
  )
}
