'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { Subject } from '@/lib/firebase/firestore'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, BookOpen, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function CurriculumPage() {
  const { loading: authLoading, profile } = useAuth()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!profile) return

    const q = query(collection(db, 'subjects'), orderBy('name'))
    const unsub = onSnapshot(q, snap => {
      setSubjects(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Subject))
      setLoading(false)
    })
    return unsub
  }, [authLoading, profile])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this subject? All chapters inside must be deleted manually.')) return
    try {
      await deleteDoc(doc(db, 'subjects', id))
    } catch (error) {
      console.error(error)
      alert("Failed to delete subject.")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Curriculum</h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Manage subjects, chapters, and quizzes.</p>
        </div>
        <Link href="/admin/curriculum/subject/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Add Subject
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading subjects...</p>
      ) : subjects.length === 0 ? (
        <div className="text-center py-20 border border-slate-200 rounded-2xl bg-white shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="font-bold text-slate-900 mb-1 text-lg">No subjects yet</h3>
          <p className="text-slate-500 text-sm mb-4">Create your first subject to start building the curriculum.</p>
          <Link href="/admin/curriculum/subject/new">
            <Button variant="outline">Add Subject</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(subject => (
            <Link key={subject.id} href={`/admin/curriculum/${subject.id}`}>
              <Card hover className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">{subject.iconName || '📚'}</span>
                    </div>
                    <button 
                      onClick={(e) => handleDelete(e, subject.id)}
                      className="text-slate-500 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{subject.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">{subject.description}</p>
                  <div className="text-xs font-bold uppercase tracking-wide text-[var(--color-primary)]">
                    {subject.chapterCount} Chapters
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
