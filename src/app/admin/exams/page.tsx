'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { Exam } from '@/lib/firebase/firestore'
import { DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { Plus, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminExamsPage() {
  const { loading: authLoading, profile } = useAuth()
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading || !profile) return

    const q = query(collection(db, 'exams'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setExams(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Exam))
      setLoading(false)
    })
    return unsub
  }, [authLoading, profile])

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this exam?')) return
    try {
      await deleteDoc(doc(db, 'exams', id))
      toast.success('Exam deleted')
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Exams</h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Schedule and manage online assessments.</p>
        </div>
        <Button disabled>
          <Plus className="w-4 h-4 mr-2" /> Schedule Exam (Coming Soon)
        </Button>
      </div>

      <DataTable
        loading={loading}
        data={exams as unknown as Record<string, unknown>[]}
        emptyVariant="schools"
        emptyAction={<Button size="sm" disabled>Schedule first exam</Button>}
        columns={[
          {
            key: 'title', header: 'Exam', sortable: true,
            render: (row) => {
              const e = row as unknown as Exam
              return (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="font-semibold text-slate-900">{e.title}</div>
                    <div className="text-xs text-slate-500 font-medium capitalize">{e.type}</div>
                  </div>
                </div>
              )
            }
          },
          {
            key: 'startTime', header: 'Scheduled Time', sortable: true,
            render: (row) => {
              const e = row as unknown as Exam
              return <span className="font-medium text-slate-600">{new Date(e.startTime).toLocaleString()}</span>
            }
          },
          {
            key: 'durationMinutes', header: 'Duration',
            render: (row) => {
              const e = row as unknown as Exam
              return <span className="font-medium text-slate-600">{e.durationMinutes} mins</span>
            }
          },
          {
            key: 'actions', header: '',
            render: (row) => {
              const e = row as unknown as Exam
              return (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(e.id)}>
                    Delete
                  </Button>
                </div>
              )
            },
          },
        ]}
      />
    </div>
  )
}
