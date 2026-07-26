'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { QuizQuestion, Chapter } from '@/lib/firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Plus, Trash2, Save, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function QuizBuilderPage() {
  const { quizId } = useParams<{ quizId: string }>()

  const [chapterId,  setChapterId]  = useState('')
  const [subjectId,  setSubjectId]  = useState('')
  const [questions,  setQuestions]  = useState<QuizQuestion[]>([])
  const [threshold,  setThreshold]  = useState(70)
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)

  useEffect(() => {
    async function load() {
      const quizSnap = await getDoc(doc(db, 'quizzes', quizId))
      if (quizSnap.exists()) {
        const data = quizSnap.data()
        setChapterId(data.chapterId)
        setQuestions(data.questions ?? [])
        setThreshold(data.passThreshold ?? 70)

        const chapSnap = await getDoc(doc(db, 'chapters', data.chapterId))
        if (chapSnap.exists()) setSubjectId((chapSnap.data() as Chapter).subjectId)
      }
      setLoading(false)
    }
    load()
  }, [quizId])

  function addQuestion() {
    setQuestions(qs => [...qs, { questionText: '', options: ['', '', '', ''], correctIndex: 0, points: 10 }])
  }

  function updateQuestion(idx: number, field: keyof QuizQuestion, value: unknown) {
    setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, [field]: value } : q))
  }

  function updateOption(qIdx: number, oIdx: number, value: string) {
    setQuestions(qs => qs.map((q, i) =>
      i === qIdx ? { ...q, options: q.options.map((o, j) => j === oIdx ? value : o) } : q
    ))
  }

  function removeQuestion(idx: number) {
    setQuestions(qs => qs.filter((_, i) => i !== idx))
  }

  async function handleSave() {
    const invalid = questions.find(q => !q.questionText.trim() || q.options.some(o => !o.trim()))
    if (invalid) { toast.error('Fill in all questions and options'); return }

    setSaving(true)
    try {
      await setDoc(doc(db, 'quizzes', quizId), {
        chapterId,
        questions,
        passThreshold: threshold,
      }, { merge: true })

      // Update chapter with quizId
      if (chapterId) {
        await updateDoc(doc(db, 'chapters', chapterId), { quizId })
      }

      toast.success('Quiz saved')
    } catch {
      toast.error('Failed to save quiz')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="skeleton h-64 rounded-[12px]" />

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href={subjectId ? `/admin/subjects/${subjectId}` : '/admin/subjects'} className="flex items-center gap-1 hover:text-[var(--color-accent-yellow)]">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to subject
        </Link>
        <span>/</span>
        <span>Quiz Builder</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 font-sora">Quiz Builder</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Pass threshold</span>
            <input
              type="number" min={0} max={100}
              value={threshold}
              onChange={e => setThreshold(Number(e.target.value))}
              className="w-16 h-8 rounded-[8px] border border-slate-200 bg-white text-center text-sm text-slate-900 focus:outline-none focus:border-[#E0A526]"
            />
            <span className="text-sm text-slate-500">%</span>
          </div>
          <Button onClick={handleSave} loading={saving} size="sm">
            <Save className="w-4 h-4" /> Save Quiz
          </Button>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4 mb-6">
        {questions.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-[12px]">
            <p className="text-slate-500 text-sm mb-3">No questions yet. Add the first one.</p>
            <Button size="sm" onClick={addQuestion}><Plus className="w-4 h-4" /> Add Question</Button>
          </div>
        )}

        {questions.map((q, qIdx) => (
          <Card key={qIdx}>
            <CardHeader className="pb-0">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[var(--color-accent-yellow)] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-white">{qIdx + 1}</span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={q.questionText}
                    onChange={e => updateQuestion(qIdx, 'questionText', e.target.value)}
                    placeholder="Question text…"
                    rows={2}
                    className="w-full rounded-[8px] border border-slate-200 bg-white text-slate-900 text-sm px-3 py-2 resize-none focus:outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20"
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1">
                    <input
                      type="number" min={1} max={100}
                      value={q.points}
                      onChange={e => updateQuestion(qIdx, 'points', Number(e.target.value))}
                      className="w-14 h-8 rounded-[8px] border border-slate-200 bg-white text-center text-sm text-slate-900 focus:outline-none focus:border-[#E0A526]"
                    />
                    <span className="text-xs text-slate-500">pts</span>
                  </div>
                  <button
                    onClick={() => removeQuestion(qIdx)}
                    className="text-[#E76F51] hover:bg-[#E76F51]/10 p-1.5 rounded-[6px] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-2 mt-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Options (click ✓ to mark correct)</p>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuestion(qIdx, 'correctIndex', oIdx)}
                      className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        q.correctIndex === oIdx
                          ? 'bg-[#16A34A] border-[#16A34A] text-white'
                          : 'border-slate-200 hover:border-[#E0A526]'
                      }`}
                    >
                      {q.correctIndex === oIdx && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <input
                      value={opt}
                      onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                      className={`flex-1 h-9 rounded-[8px] border px-3 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E0A526]/20 transition-colors ${
                        q.correctIndex === oIdx
                          ? 'border-[#16A34A] bg-[#16A34A]/5'
                          : 'border-slate-200 focus:border-[#E0A526]'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {questions.length > 0 && (
        <Button variant="secondary" onClick={addQuestion}>
          <Plus className="w-4 h-4" /> Add Another Question
        </Button>
      )}

      {/* Summary */}
      {questions.length > 0 && (
        <div className="mt-6 p-4 bg-white border border-slate-200 rounded-[12px]">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{questions.length}</span> questions ·{' '}
            <span className="font-semibold text-slate-900">
              {questions.reduce((s, q) => s + q.points, 0)}
            </span> total points · Pass at{' '}
            <span className="font-semibold text-slate-900">{threshold}%</span>
          </p>
        </div>
      )}
    </div>
  )
}
