'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { Subject, Chapter, ChapterProgress } from '@/lib/firebase/firestore'
import { Card, CardContent } from '@/components/ui/Card'
import { SubjectCardSkeleton } from '@/components/shared/SkeletonLoader'
import { EmptyState } from '@/components/shared/EmptyState'
import { BookOpen, ChevronRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function ProgressRing({ pct }: { pct: number }) {
  const r  = 20
  const c  = 2 * Math.PI * r
  return (
    <svg width="48" height="48" className="-rotate-90">
      <circle cx="24" cy="24" r={r} fill="none" stroke="#EFE6D3" strokeWidth="4" />
      <circle
        cx="24" cy="24" r={r} fill="none"
        stroke={pct === 100 ? '#16A34A' : '#E0A526'} strokeWidth="4"
        strokeDasharray={c}
        strokeDashoffset={c - (pct / 100) * c}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 600ms ease-out' }}
      />
    </svg>
  )
}

export default function SubjectsPage() {
  const { loading: authLoading, profile } = useAuth()
  const [subjects,  setSubjects]  = useState<Subject[]>([])
  const [chapters,  setChapters]  = useState<Chapter[]>([])
  const [progress,  setProgress]  = useState<Record<string, ChapterProgress>>({})
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!profile) return // Wait for student profile

    const unsubSub = onSnapshot(query(collection(db, 'subjects'), orderBy('name')), snap => {
      setSubjects(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Subject))
    })
    const unsubChap = onSnapshot(collection(db, 'chapters'), snap => {
      setChapters(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Chapter))
    })

    const unsubProg = onSnapshot(
      collection(db, 'studentChapterProgress', profile.id, 'chapters'),
      snap => {
        const map: Record<string, ChapterProgress> = {}
        snap.docs.forEach(d => { map[d.id] = d.data() as ChapterProgress })
        setProgress(map)
        setLoading(false)
      }
    )
    return () => { unsubSub(); unsubChap(); unsubProg() }
  }, [authLoading, profile])

  const subjectProgress = subjects.map(sub => {
    const subChaps = chapters.filter(c => c.subjectId === sub.id)
    const done     = subChaps.filter(c => progress[c.id]?.status === 'completed').length
    return { ...sub, done, total: subChaps.length, pct: subChaps.length > 0 ? Math.round(done / subChaps.length * 100) : 0 }
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 px-6 py-3 flex items-center gap-4 z-40">
        <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="font-sora font-bold text-slate-900">All Subjects</h1>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SubjectCardSkeleton key={i} />)}
          </div>
        ) : subjects.length === 0 ? (
          <EmptyState variant="subjects" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectProgress.map(sub => (
              <Link key={sub.id} href={`/subjects/${sub.id}`}>
                <Card hover className="h-full">
                  <CardContent className="pt-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-[var(--color-accent-yellow)]/10 rounded-[10px] flex items-center justify-center text-2xl">
                        📚
                      </div>
                      <ProgressRing pct={sub.pct} />
                    </div>
                    <h3 className="font-sora font-semibold text-slate-900 mb-1">{sub.name}</h3>
                    <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-2">{sub.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{sub.done}/{sub.total} chapters</span>
                      <span className={`text-xs font-semibold ${sub.pct === 100 ? 'text-[#16A34A]' : 'text-[var(--color-accent-yellow)]'}`}>
                        {sub.pct}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
