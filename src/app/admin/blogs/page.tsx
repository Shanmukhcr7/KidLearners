'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { Blog } from '@/lib/firebase/firestore'
import { DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, FileText, Calendar } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AdminBlogsPage() {
  const { loading: authLoading, profile } = useAuth()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading || !profile) return

    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Blog))
      setLoading(false)
    })
    return unsub
  }, [authLoading, profile])

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    try {
      await deleteDoc(doc(db, 'blogs', id))
      toast.success('Blog deleted')
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Manage articles and announcements.</p>
        </div>
        <Link href="/admin/blogs/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Write Post
          </Button>
        </Link>
      </div>

      <DataTable
        loading={loading}
        data={blogs as unknown as Record<string, unknown>[]}
        emptyVariant="schools"
        emptyAction={<Link href="/admin/blogs/new"><Button size="sm">Write first post</Button></Link>}
        columns={[
          {
            key: 'title', header: 'Post', sortable: true,
            render: (row) => {
              const b = row as unknown as Blog
              return (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                    {b.coverImageUrl ? (
                      <img src={b.coverImageUrl} alt={b.title} className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{b.title}</div>
                    <div className="text-xs text-slate-500 font-medium">/{b.slug}</div>
                  </div>
                </div>
              )
            }
          },
          {
            key: 'createdAt', header: 'Created', sortable: true,
            render: (row) => {
              const b = row as unknown as Blog
              return (
                <div className="flex items-center gap-1.5 text-slate-600 font-medium text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(b.createdAt).toLocaleDateString()}
                </div>
              )
            }
          },
          {
            key: 'published', header: 'Status',
            render: (row) => {
              const b = row as unknown as Blog
              return <Badge variant={b.published ? 'success' : 'muted'}>{b.published ? 'Published' : 'Draft'}</Badge>
            },
          },
          {
            key: 'actions', header: '',
            render: (row) => {
              const b = row as unknown as Blog
              return (
                <div className="flex items-center gap-2">
                  <Link href={`/admin/blogs/${b.id}`}>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(b.id)}>
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
