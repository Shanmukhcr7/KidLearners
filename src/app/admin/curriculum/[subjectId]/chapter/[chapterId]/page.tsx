'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { Chapter, Quiz, QuizQuestion } from '@/lib/firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'
import Link from 'next/link'

export default function EditChapterPage() {
  const { subjectId, chapterId } = useParams() as { subjectId: string, chapterId: string }
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form states for Quiz
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [passThreshold, setPassThreshold] = useState(80)

  useEffect(() => {
    async function loadData() {
      const chapSnap = await getDoc(doc(db, 'chapters', chapterId))
      if (chapSnap.exists()) {
        const c = { id: chapSnap.id, ...chapSnap.data() } as Chapter
        setChapter(c)

        if (c.quizId) {
          const quizSnap = await getDoc(doc(db, 'quizzes', c.quizId))
          if (quizSnap.exists()) {
            const q = { id: quizSnap.id, ...quizSnap.data() } as Quiz
            setQuiz(q)
            setQuestions(q.questions)
            setPassThreshold(q.passThreshold)
          }
        }
      }
      setLoading(false)
    }
    loadData()
  }, [chapterId])

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctIndex: 0, points: 10 }])
  }

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx))
  }

  const updateQuestion = (idx: number, field: keyof QuizQuestion, value: any) => {
    const newQ = [...questions]
    newQ[idx] = { ...newQ[idx], [field]: value }
    setQuestions(newQ)
  }

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    const newQ = [...questions]
    newQ[qIdx].options[oIdx] = value
    setQuestions(newQ)
  }

  const handleSaveQuiz = async () => {
    setSaving(true)
    try {
      let qId = quiz?.id
      if (!qId) {
        // Create new quiz
        const newRef = doc(collection(db, 'quizzes'))
        qId = newRef.id
        await setDoc(newRef, {
          id: qId,
          chapterId,
          questions,
          passThreshold
        })
        // Link to chapter
        await updateDoc(doc(db, 'chapters', chapterId), { quizId: qId })
        setQuiz({ id: qId, chapterId, questions, passThreshold })
      } else {
        // Update existing
        await updateDoc(doc(db, 'quizzes', qId), {
          questions,
          passThreshold
        })
      }
      alert('Quiz saved successfully!')
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to save quiz')
    }
    setSaving(false)
  }

  if (loading) return <p className="p-8 text-slate-500">Loading...</p>
  if (!chapter) return <p className="p-8 text-red-500 font-bold">Chapter not found.</p>

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link href={`/admin/curriculum/${subjectId}`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Chapter List
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 font-sora">Manage: {chapter.title}</h1>
        <p className="text-sm text-slate-500 mt-0.5">Chapter {chapter.order} • {chapter.videoUrl ? 'Video Included' : 'Text Only'}</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quiz Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Pass Threshold (%)</label>
                <Input 
                  type="number" 
                  min="0" max="100" 
                  value={passThreshold} 
                  onChange={e => setPassThreshold(Number(e.target.value))} 
                  className="w-32"
                />
              </div>
              <Button onClick={addQuestion} variant="outline">
                <Plus className="w-4 h-4 mr-2" /> Add Question
              </Button>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <p className="text-slate-500 text-sm mb-4">No questions added yet. A quiz is required to pass the chapter.</p>
                <Button onClick={addQuestion} size="sm">Add First Question</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 relative">
                    <button 
                      onClick={() => removeQuestion(qIdx)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="mb-4 pr-8">
                      <label className="block text-sm font-medium text-slate-900 mb-1">Question {qIdx + 1}</label>
                      <Input 
                        value={q.questionText} 
                        onChange={e => updateQuestion(qIdx, 'questionText', e.target.value)} 
                        placeholder="Enter the question..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name={`correct-${qIdx}`} 
                            checked={q.correctIndex === oIdx}
                            onChange={() => updateQuestion(qIdx, 'correctIndex', oIdx)}
                            className="w-4 h-4 text-[var(--color-accent-yellow)] focus:ring-[#E0A526]"
                            title="Mark as correct answer"
                          />
                          <Input 
                            value={opt}
                            onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                            placeholder={`Option ${oIdx + 1}`}
                            className={q.correctIndex === oIdx ? 'border-[#E0A526] bg-[var(--color-accent-yellow)]/5' : ''}
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-1">Points</label>
                      <Input 
                        type="number" 
                        value={q.points} 
                        onChange={e => updateQuestion(qIdx, 'points', Number(e.target.value))} 
                        className="w-24"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <Button onClick={handleSaveQuiz} disabled={saving || questions.length === 0}>
                {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Quiz</>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
