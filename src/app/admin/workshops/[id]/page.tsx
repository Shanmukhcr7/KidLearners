'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { Workshop } from '@/lib/firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function WorkshopFormPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const isNew = id === 'new'
  
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Workshop>>({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    date: new Date().toISOString().slice(0, 16),
    tags: [],
    published: false
  })
  const [tagsInput, setTagsInput] = useState('')

  useEffect(() => {
    if (isNew) return
    async function load() {
      try {
        const snap = await getDoc(doc(db, 'workshops', id))
        if (snap.exists()) {
          const data = snap.data() as Workshop
          setFormData({
            ...data,
            date: data.date ? new Date(data.date).toISOString().slice(0, 16) : ''
          })
          setTagsInput(data.tags?.join(', ') || '')
        } else {
          toast.error("Workshop not found")
        }
      } catch (err) {
        console.error(err)
        toast.error("Failed to load workshop")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isNew])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
      const payload = {
        ...formData,
        tags,
        date: new Date(formData.date!).toISOString()
      }

      if (isNew) {
        const newRef = doc(collection(db, 'workshops'))
        await setDoc(newRef, {
          ...payload,
          id: newRef.id,
          createdAt: new Date().toISOString()
        })
        toast.success("Workshop created!")
        router.push('/admin/workshops')
      } else {
        await updateDoc(doc(db, 'workshops', id), payload)
        toast.success("Workshop updated!")
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to save workshop")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/admin/workshops" className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors font-semibold">
        <ArrowLeft className="w-4 h-4" /> Back to Workshops
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-slate-900">{isNew ? 'Create Workshop' : 'Edit Workshop'}</h1>
        <p className="text-slate-500 mt-1 font-medium">Fill in the details for the video/live session.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form id="workshop-form" onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Title</label>
                <Input 
                  required 
                  placeholder="e.g. Intro to Advanced Robotics"
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  className="w-full border border-slate-200 bg-white text-slate-900 rounded-lg p-3 transition-all focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 resize-none"
                  placeholder="What is this workshop about?"
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Video URL (YouTube/Vimeo)</label>
                  <Input 
                    type="url"
                    placeholder="https://..."
                    value={formData.videoUrl || ''}
                    onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Date & Time</label>
                  <Input 
                    type="datetime-local"
                    required
                    value={formData.date || ''}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Thumbnail URL</label>
                <Input 
                  type="url"
                  placeholder="https://..."
                  value={formData.thumbnailUrl || ''}
                  onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Tags (Comma separated)</label>
                <Input 
                  placeholder="e.g. robotics, coding, live"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
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
          <Button type="submit" form="workshop-form" loading={saving}>
            <Save className="w-4 h-4 mr-2" /> {isNew ? 'Create Workshop' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
