'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { Blog } from '@/lib/firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function BlogFormPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const { profile } = useAuth()
  const isNew = id === 'new'
  
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Blog>>({
    title: '',
    slug: '',
    content: '',
    coverImageUrl: '',
    published: false
  })

  useEffect(() => {
    if (isNew) return
    async function load() {
      try {
        const snap = await getDoc(doc(db, 'blogs', id))
        if (snap.exists()) {
          setFormData(snap.data() as Blog)
        } else {
          toast.error("Blog not found")
        }
      } catch (err) {
        console.error(err)
        toast.error("Failed to load blog")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isNew])

  // Simple auto-slug generator
  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: isNew ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : prev.slug
    }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    try {
      const payload = { ...formData }

      if (isNew) {
        const newRef = doc(collection(db, 'blogs'))
        await setDoc(newRef, {
          ...payload,
          id: newRef.id,
          authorId: profile.id,
          createdAt: new Date().toISOString()
        })
        toast.success("Blog created!")
        router.push('/admin/blogs')
      } else {
        await updateDoc(doc(db, 'blogs', id), payload)
        toast.success("Blog updated!")
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to save blog")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/admin/blogs" className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors font-semibold">
        <ArrowLeft className="w-4 h-4" /> Back to Blogs
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-slate-900">{isNew ? 'Write Post' : 'Edit Post'}</h1>
        <p className="text-slate-500 mt-1 font-medium">Create rich content for the platform.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form id="blog-form" onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Title</label>
                <Input 
                  required 
                  placeholder="e.g. Why Kids Should Code"
                  value={formData.title || ''}
                  onChange={handleTitleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">URL Slug</label>
                <Input 
                  required 
                  placeholder="e.g. why-kids-should-code"
                  value={formData.slug || ''}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Cover Image URL</label>
                <Input 
                  type="url"
                  placeholder="https://..."
                  value={formData.coverImageUrl || ''}
                  onChange={e => setFormData({ ...formData, coverImageUrl: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Content (Markdown / HTML supported later)</label>
                <textarea
                  required
                  rows={15}
                  className="w-full border border-slate-200 bg-white text-slate-900 rounded-lg p-4 transition-all focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 font-mono text-sm resize-y"
                  placeholder="Write your post content here..."
                  value={formData.content || ''}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  className="w-4 h-4 text-[var(--color-primary)] border-slate-300 rounded focus:ring-[var(--color-primary)]"
                  checked={formData.published || false}
                  onChange={e => setFormData({ ...formData, published: e.target.checked })}
                />
                <label htmlFor="published" className="text-sm font-medium text-slate-900">
                  Publish immediately
                </label>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-end border-t border-slate-100 mt-6 pt-6">
          <Button type="submit" form="blog-form" loading={saving}>
            <Save className="w-4 h-4 mr-2" /> {isNew ? 'Publish Post' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
