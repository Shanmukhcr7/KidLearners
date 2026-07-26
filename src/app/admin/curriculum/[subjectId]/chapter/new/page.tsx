'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { collection, doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewChapterPage() {
  const router = useRouter()
  const { subjectId } = useParams() as { subjectId: string }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    order: 1,
    content: '',
    videoUrl: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const newRef = doc(collection(db, 'chapters'))
      await setDoc(newRef, {
        id: newRef.id,
        subjectId,
        title: formData.title,
        order: Number(formData.order),
        content: formData.content,
        videoUrl: formData.videoUrl || null,
      })
      router.push(`/admin/curriculum/${subjectId}`)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to create chapter')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href={`/admin/curriculum/${subjectId}`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Subject
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Add New Chapter</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr_100px] gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Chapter Title</label>
                  <Input 
                    required 
                    placeholder="e.g. What is a Neural Network?" 
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Order</label>
                  <Input 
                    required 
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={e => setFormData({ ...formData, order: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Video URL (Optional)</label>
                <Input 
                  placeholder="e.g. Firebase Storage URL or YouTube link" 
                  value={formData.videoUrl}
                  onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                />
                <p className="text-xs text-slate-500 mt-1">If provided, this video will be embedded at the top of the lesson.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Article Content</label>
                <textarea 
                  required 
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#E0A526] focus:border-transparent transition-all duration-200 min-h-[300px] font-mono"
                  placeholder="Write the educational content here (Markdown/HTML supported if configured)..." 
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Chapter'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
