'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { collection, doc, getDoc, query, where, orderBy, onSnapshot, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { Subject, Chapter } from '@/lib/firebase/firestore'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, ArrowLeft, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'

export default function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>()
  const { loading: authLoading, profile } = useAuth()
  const [subject, setSubject] = useState<Subject | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!profile) return

    async function loadSubject() {
      const snap = await getDoc(doc(db, 'subjects', subjectId))
      if (snap.exists()) setSubject({ id: snap.id, ...snap.data() } as Subject)
    }
    loadSubject()

    const q = query(
      collection(db, 'chapters'), 
      where('subjectId', '==', subjectId)
    )
    const unsub = onSnapshot(q, snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Chapter)
      docs.sort((a, b) => a.order - b.order)
      setChapters(docs)
      setLoading(false)
    })
    
    return unsub
  }, [subjectId, authLoading, profile])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this chapter? This will also remove any progress students have made.')) return
    try {
      await deleteDoc(doc(db, 'chapters', id))
    } catch (error) {
      console.error(error)
      alert("Failed to delete chapter.")
    }
  }

  if (!subject && !loading) {
    return <div className="text-center py-20 text-red-500 font-bold">Subject not found.</div>
  }

  return (
    <div>
      <Link href="/admin/curriculum" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Curriculum
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[var(--color-accent-yellow)]/10 rounded-xl flex items-center justify-center text-3xl">
            {subject?.iconName || '📚'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-sora">{subject?.name || 'Loading...'}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{chapters.length} chapters</p>
          </div>
        </div>
        <Link href={`/admin/curriculum/${subjectId}/chapter/new`}>
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Add Chapter
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading chapters...</p>
      ) : chapters.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <h3 className="font-bold text-slate-900 mb-1">No chapters yet</h3>
          <p className="text-slate-500 text-sm mb-4">Add the first chapter to start building out this subject.</p>
          <Link href={`/admin/curriculum/${subjectId}/chapter/new`}>
            <Button variant="outline">Add Chapter</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {chapters.map(chapter => (
            <Card key={chapter.id} className="overflow-hidden">
              <CardContent className="p-0 flex items-stretch">
                <div className="bg-slate-100 w-12 flex flex-col items-center justify-center font-bold text-slate-500 border-r border-slate-200">
                  {chapter.order}
                </div>
                <div className="flex-1 p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{chapter.title}</h3>
                    <p className="text-xs text-slate-500 max-w-2xl truncate">
                      {chapter.content ? 'Content exists' : 'No content'} 
                      {chapter.videoUrl && ' • Has Video'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Placeholder for editing chapter content/quizzes */}
                    <Link href={`/admin/curriculum/${subjectId}/chapter/${chapter.id}`}>
                      <Button variant="outline" size="sm">Manage Content & Quizzes</Button>
                    </Link>
                    <button 
                      onClick={(e) => handleDelete(e, chapter.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-md border border-transparent text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
