'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { Task } from '@/lib/firebase/firestore'
import { DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { Plus, CheckSquare } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AdminTasksPage() {
  const { loading: authLoading, profile } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading || !profile) return

    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Task))
      setLoading(false)
    })
    return unsub
  }, [authLoading, profile])

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this task?')) return
    try {
      await deleteDoc(doc(db, 'tasks', id))
      toast.success('Task deleted')
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Assign work and projects to students.</p>
        </div>
        <Link href="/admin/tasks/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Create Task
          </Button>
        </Link>
      </div>

      <DataTable
        loading={loading}
        data={tasks as unknown as Record<string, unknown>[]}
        emptyVariant="schools"
        emptyAction={<Link href="/admin/tasks/new"><Button size="sm">Create first task</Button></Link>}
        columns={[
          {
            key: 'title', header: 'Task', sortable: true,
            render: (row) => {
              const t = row as unknown as Task
              return (
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="font-semibold text-slate-900">{t.title}</div>
                    <div className="text-xs text-slate-500 font-medium capitalize">{t.type}</div>
                  </div>
                </div>
              )
            }
          },
          {
            key: 'dueDate', header: 'Due Date', sortable: true,
            render: (row) => {
              const t = row as unknown as Task
              return <span className="font-medium text-slate-600">{new Date(t.dueDate).toLocaleDateString()}</span>
            }
          },
          {
            key: 'actions', header: '',
            render: (row) => {
              const t = row as unknown as Task
              return (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(t.id)}>
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
