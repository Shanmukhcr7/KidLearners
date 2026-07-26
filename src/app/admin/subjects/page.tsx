'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { Subject } from '@/lib/firebase/firestore'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/shared/EmptyState'
import { SubjectCardSkeleton } from '@/components/shared/SkeletonLoader'
import { Plus, BookOpen, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const SUBJECT_ICONS: Record<string, string> = {
  Brain: '🧠', Cpu: '🖥️', Database: '🗄️', Globe: '🌐',
  Sparkles: '✨', Code: '💻', Bot: '🤖', LineChart: '📊',
}

export default function AdminSubjectsPage() {
  const { loading: authLoading, profile } = useAuth()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading,  setLoading]  = useState(true)

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-sora">Subjects & Chapters</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {subjects.length} subjects · All content authored here
          </p>
        </div>
        <Link href="/admin/subjects/new">
          <Button><Plus className="w-4 h-4" /> New Subject</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SubjectCardSkeleton key={i} />)}
        </div>
      ) : subjects.length === 0 ? (
        <EmptyState
          variant="subjects"
          action={<Link href="/admin/subjects/new"><Button size="sm">Create first subject</Button></Link>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(subject => (
            <Link key={subject.id} href={`/admin/subjects/${subject.id}`}>
              <Card hover className="h-full">
                <CardContent className="pt-6">
                  <div className="text-3xl mb-3">
                    {SUBJECT_ICONS[subject.iconName] ?? '📚'}
                  </div>
                  <h3 className="font-sora font-semibold text-slate-900 mb-1">{subject.name}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{subject.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="muted">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {subject.chapterCount ?? 0} chapters
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
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
