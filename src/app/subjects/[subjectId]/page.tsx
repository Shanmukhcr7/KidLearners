'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { collection, doc, getDoc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { Subject, Chapter, ChapterProgress } from '@/lib/firebase/firestore'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, BookOpen, CheckCircle, Lock, Play } from 'lucide-react'
import Link from 'next/link'

export default function SubjectDetailPage() {
  const { subjectId } = useParams() as { subjectId: string }
  const { loading: authLoading, profile } = useAuth()
  const [subject, setSubject] = useState<Subject | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [progress, setProgress] = useState<Record<string, ChapterProgress>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!profile) return

    async function fetchSubject() {
      const snap = await getDoc(doc(db, 'subjects', subjectId))
      if (snap.exists()) setSubject({ id: snap.id, ...snap.data() } as Subject)
    }
    fetchSubject()

    const unsubChap = onSnapshot(query(collection(db, 'chapters'), orderBy('order')), snap => {
      setChapters(
        snap.docs
          .map(d => ({ id: d.id, ...d.data() }) as Chapter)
          .filter(c => c.subjectId === subjectId)
      )
    })

    const unsubProg = onSnapshot(collection(db, 'studentChapterProgress', profile.id, 'chapters'), snap => {
      const map: Record<string, ChapterProgress> = {}
      snap.docs.forEach(d => { map[d.id] = d.data() as ChapterProgress })
      setProgress(map)
      setLoading(false)
    })
    return () => { unsubChap(); unsubProg() }
  }, [subjectId, authLoading, profile])

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>
  if (!subject) return <div className="p-8 text-center text-red-500 font-bold">Subject not found</div>

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="sticky top-0 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 flex items-center gap-4 z-40">
        <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-display font-bold text-slate-900 text-lg">{subject.name}</h1>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-[var(--color-accent-yellow)]/10 rounded-[20px] flex items-center justify-center text-4xl mx-auto mb-4 border-2 border-[var(--color-accent-yellow)]/20 shadow-sm">
            {subject.iconName || '📚'}
          </div>
          <h2 className="text-3xl font-display font-black text-slate-900 mb-3">{subject.name}</h2>
          <p className="text-[var(--neutral-subtext)] max-w-xl mx-auto text-lg leading-relaxed">{subject.description}</p>
        </div>

        <div className="space-y-4 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-8 top-10 bottom-10 w-1 bg-[var(--border)] -z-10 rounded-full" />
          
          {chapters.map((chapter, index) => {
            const prevChapter = index > 0 ? chapters[index - 1] : null
            const prevCompleted = prevChapter ? progress[prevChapter.id]?.status === 'completed' : true
            
            const p = progress[chapter.id]
            const isCompleted = p?.status === 'completed'
            const isUnlocked = prevCompleted || isCompleted
            
            return (
              <div key={chapter.id} className={`transition-opacity duration-300 ${isUnlocked ? 'opacity-100' : 'opacity-60'}`}>
                {isUnlocked ? (
                  <Link href={`/subjects/${subjectId}/chapters/${chapter.id}`}>
                    <Card hover className={`border-2 ${isCompleted ? 'border-[var(--color-accent-green)] bg-[white]' : 'border-[var(--color-accent-yellow)] bg-white shadow-md'}`}>
                      <CardContent className="p-5 flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 outline outline-4 outline-[var(--background)] shadow-sm ${
                          isCompleted ? 'bg-[var(--color-accent-green)] text-white border-white' : 'bg-[var(--color-accent-yellow)] text-slate-900 border-white'
                        }`}>
                          {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[var(--neutral-subtext)] uppercase tracking-widest mb-1">Quest {index + 1}</p>
                          <h3 className={`font-display font-bold text-xl ${isCompleted ? 'text-[var(--color-accent-green)]' : 'text-slate-900'}`}>{chapter.title}</h3>
                        </div>
                        {isCompleted && (
                          <div className="flex items-center gap-2 text-[var(--color-accent-green)] font-bold text-sm bg-[#e8f5ed] px-3 py-1.5 rounded-full">
                            <span className="text-lg">🏆</span> 
                            {p.bestAttemptScore}%
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ) : (
                  <Card className="border-2 border-[var(--border)] bg-[white]/50 opacity-75">
                    <CardContent className="p-5 flex items-center gap-5">
                      <div className="w-12 h-12 rounded-full bg-[var(--border)] text-white flex items-center justify-center shrink-0 border-4 border-white outline outline-4 outline-[var(--background)]">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[var(--neutral-subtext)] uppercase tracking-widest mb-1">Quest {index + 1}</p>
                        <h3 className="font-display font-bold text-[var(--neutral-subtext)] text-xl">{chapter.title}</h3>
                        <p className="text-xs text-[var(--neutral-subtext)] mt-1">Complete Quest {index} to unlock</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
