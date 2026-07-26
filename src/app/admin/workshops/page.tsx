'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { Workshop } from '@/lib/firebase/firestore'
import { DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, Video, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AdminWorkshopsPage() {
  const { loading: authLoading, profile } = useAuth()
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading || !profile) return

    const q = query(collection(db, 'workshops'), orderBy('date', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setWorkshops(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Workshop))
      setLoading(false)
    })
    return unsub
  }, [authLoading, profile])

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this workshop?')) return
    try {
      await deleteDoc(doc(db, 'workshops', id))
      toast.success('Workshop deleted')
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workshops</h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Manage live sessions and recorded events.</p>
        </div>
        <Link href="/admin/workshops/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Add Workshop
          </Button>
        </Link>
      </div>

      <DataTable
        loading={loading}
        data={workshops as unknown as Record<string, unknown>[]}
        emptyVariant="schools"
        emptyAction={<Link href="/admin/workshops/new"><Button size="sm">Create first workshop</Button></Link>}
        columns={[
          {
            key: 'title', header: 'Workshop Title', sortable: true,
            render: (row) => {
              const w = row as unknown as Workshop
              return (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                    {w.thumbnailUrl ? (
                      <img src={w.thumbnailUrl} alt={w.title} className="w-full h-full object-cover" />
                    ) : (
                      <Video className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{w.title}</div>
                    <div className="text-xs text-slate-500 font-medium truncate max-w-[250px]">{w.description}</div>
                  </div>
                </div>
              )
            }
          },
          {
            key: 'date', header: 'Date', sortable: true,
            render: (row) => {
              const w = row as unknown as Workshop
              return (
                <div className="flex items-center gap-1.5 text-slate-600 font-medium text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(w.date).toLocaleDateString()}
                </div>
              )
            }
          },
          {
            key: 'tags', header: 'Tags',
            render: (row) => {
              const w = row as unknown as Workshop
              return (
                <div className="flex gap-1 flex-wrap">
                  {w.tags?.map(t => (
                    <Badge key={t} variant="muted" className="text-[10px] py-0.5 px-2 font-semibold">
                      {t}
                    </Badge>
                  ))}
                </div>
              )
            }
          },
          {
            key: 'published', header: 'Status',
            render: (row) => {
              const w = row as unknown as Workshop
              return <Badge variant={w.published ? 'success' : 'muted'}>{w.published ? 'Published' : 'Draft'}</Badge>
            },
          },
          {
            key: 'actions', header: '',
            render: (row) => {
              const w = row as unknown as Workshop
              return (
                <div className="flex items-center gap-2">
                  <Link href={`/admin/workshops/${w.id}`}>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(w.id)}>
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
