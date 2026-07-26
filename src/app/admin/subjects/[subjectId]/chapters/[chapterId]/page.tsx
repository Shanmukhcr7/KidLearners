'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { Chapter } from '@/lib/firebase/firestore'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, Save, Clock } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

// Simple rich text editor using a textarea + preview
// In production, replace with TipTap or Lexical

export default function ChapterEditorPage() {
  const params     = useParams<{ subjectId: string; chapterId: string }>()
  const router     = useRouter()
  const isNew      = params.chapterId === 'new'

  const [title,    setTitle]    = useState('')
  const [content,  setContent]  = useState('')
  const [minutes,  setMinutes]  = useState('15')
  const [order,    setOrder]    = useState('1')
  const [loading,  setLoading]  = useState(!isNew)
  const [saving,   setSaving]   = useState(false)
  const [tab,      setTab]      = useState<'write' | 'preview'>('write')

  useEffect(() => {
    if (isNew) return
    getDoc(doc(db, 'chapters', params.chapterId)).then(d => {
      if (d.exists()) {
        const data = d.data() as Chapter
        setTitle(data.title)
        setContent(data.content)
        setMinutes(String(data.estimatedMinutes))
        setOrder(String(data.order))
      }
      setLoading(false)
    })
  }, [params.chapterId, isNew])

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required')
      return
    }
    setSaving(true)
    try {
      const data = {
        subjectId:        params.subjectId,
        title:            title.trim(),
        content:          content.trim(),
        estimatedMinutes: parseInt(minutes) || 15,
        order:            parseInt(order) || 1,
        quizId:           '',
      }

      if (isNew) {
        const ref = await addDoc(collection(db, 'chapters'), data)
        toast.success('Chapter created')
        router.push(`/admin/subjects/${params.subjectId}/chapters/${ref.id}`)
      } else {
        await updateDoc(doc(db, 'chapters', params.chapterId), data)
        toast.success('Chapter saved')
      }
    } catch {
      toast.error('Failed to save chapter')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="animate-pulse space-y-4 max-w-3xl">
      <div className="h-8 w-48 skeleton rounded" />
      <div className="h-12 w-full skeleton rounded" />
      <div className="h-64 w-full skeleton rounded" />
    </div>
  )

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href={`/admin/subjects/${params.subjectId}`} className="flex items-center gap-1 hover:text-[var(--color-accent-yellow)]">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to subject
        </Link>
        <span>/</span>
        <span>{isNew ? 'New Chapter' : 'Edit Chapter'}</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 font-sora mb-6">
        {isNew ? 'New Chapter' : 'Edit Chapter'}
      </h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <Input
            label="Chapter title"
            placeholder="e.g. What is Machine Learning?"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <Input
          label="Order"
          type="number"
          min={1}
          placeholder="1"
          value={order}
          onChange={e => setOrder(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-slate-500" />
          <label className="text-sm font-medium text-slate-900">Estimated read time (minutes)</label>
        </div>
        <input
          type="number" min={1} max={120}
          value={minutes}
          onChange={e => setMinutes(e.target.value)}
          className="w-28 h-10 rounded-[8px] border border-slate-200 bg-white text-slate-900 text-sm px-4 focus:outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20"
        />
      </div>

      {/* Content editor */}
      <div className="mb-6">
        <div className="flex items-center gap-1 mb-2">
          {(['write', 'preview'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-[6px] text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? 'bg-[#3A2E1F] text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'write' ? (
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write chapter content in Markdown or plain HTML…"
            rows={16}
            className="w-full rounded-[8px] border border-slate-200 bg-white text-slate-900 text-sm p-4 font-mono resize-y focus:outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20"
          />
        ) : (
          <div
            className="min-h-64 rounded-[8px] border border-slate-200 bg-white p-6 prose prose-sm max-w-none"
            style={{ fontFamily: 'var(--font-inter)' }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSave} loading={saving}>
          <Save className="w-4 h-4" /> Save Chapter
        </Button>
        <Link href={`/admin/subjects/${params.subjectId}`}>
          <Button variant="secondary">Cancel</Button>
        </Link>
      </div>
    </div>
  )
}
