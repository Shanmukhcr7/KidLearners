'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  doc, collection, onSnapshot, query, orderBy,
  updateDoc, deleteDoc, addDoc, getDoc
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { Subject, Chapter } from '@/lib/firebase/firestore'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/shared/EmptyState'
import { ChapterCardSkeleton } from '@/components/shared/SkeletonLoader'
import { Plus, BookOpen, ChevronRight, GripVertical, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function SubjectDetailPage() {
  const { subjectId } = useParams<{ subjectId: string }>()
  const { loading: authLoading, profile } = useAuth()
  const [subject,  setSubject]  = useState<Subject | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!profile) return
    const subSnap = getDoc(doc(db, 'subjects', subjectId))
    subSnap.then(d => {
      if (d.exists()) setSubject({ id: d.id, ...d.data() } as Subject)
    })

    const q = query(
      collection(db, 'chapters'),
      orderBy('order', 'asc')
    )
    const unsub = onSnapshot(q, snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Chapter)
      setChapters(all.filter(c => c.subjectId === subjectId))
      setLoading(false)
    })
    return unsub
  }, [subjectId, authLoading, profile])

  async function deleteChapter(chapterId: string) {
    if (!confirm('Delete this chapter? This also deletes its quiz.')) return
    try {
      await deleteDoc(doc(db, 'chapters', chapterId))
      toast.success('Chapter deleted')
    } catch {
      toast.error('Could not delete chapter')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/admin/subjects" className="hover:text-[var(--color-accent-yellow)]">Subjects</Link>
            <span>/</span>
            <span>{subject?.name ?? '…'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-sora">{subject?.name ?? 'Loading…'}</h1>
          <p className="text-sm text-slate-500 mt-1">{subject?.description}</p>
        </div>
        <Link href={`/admin/subjects/${subjectId}/chapters/new`}>
          <Button><Plus className="w-4 h-4" /> New Chapter</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Chapters', value: chapters.length },
          { label: 'Total Est. Time', value: `${chapters.reduce((s,c) => s + (c.estimatedMinutes ?? 0), 0)} min` },
          { label: 'With Quiz', value: chapters.filter(c => c.quizId).length },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="pt-5 pb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{stat.label}</p>
              <p className="text-2xl font-bold font-sora text-slate-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chapter list */}
      <h2 className="text-base font-semibold text-slate-900 mb-3">Chapters</h2>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <ChapterCardSkeleton key={i} />)}
        </div>
      ) : chapters.length === 0 ? (
        <EmptyState
          variant="chapters"
          action={<Link href={`/admin/subjects/${subjectId}/chapters/new`}><Button size="sm">Add first chapter</Button></Link>}
        />
      ) : (
        <div className="space-y-3">
          {chapters.map((chapter, idx) => (
            <div
              key={chapter.id}
              className="bg-white border border-slate-200 rounded-[12px] p-4 flex items-center gap-4"
            >
              <GripVertical className="w-4 h-4 text-[#EFE6D3] shrink-0 cursor-grab" />
              <div className="w-8 h-8 bg-slate-100 rounded-[8px] flex items-center justify-center shrink-0">
                <span className="text-sm font-bold font-sora text-slate-900">{idx + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">{chapter.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-500">{chapter.estimatedMinutes} min read</span>
                  {chapter.quizId
                    ? <Badge variant="success">Quiz ready</Badge>
                    : <Badge variant="warning">No quiz yet</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/subjects/${subjectId}/chapters/${chapter.id}`}>
                  <Button variant="ghost" size="sm"><Pencil className="w-4 h-4" /></Button>
                </Link>
                {chapter.quizId && (
                  <Link href={`/admin/quizzes/${chapter.quizId}`}>
                    <Button variant="ghost" size="sm"><BookOpen className="w-4 h-4" /></Button>
                  </Link>
                )}
                <Button
                  variant="ghost" size="sm"
                  className="text-[#E76F51] hover:bg-[#E76F51]/10"
                  onClick={() => deleteChapter(chapter.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
