'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewSubjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    iconName: '📚',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const newRef = doc(collection(db, 'subjects'))
      await setDoc(newRef, {
        id: newRef.id,
        name: formData.name,
        description: formData.description,
        iconName: formData.iconName,
        chapterCount: 0,
      })
      router.push('/admin/curriculum')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to create subject')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/admin/curriculum" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Curriculum
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Add New Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Subject Name</label>
                <Input 
                  required 
                  placeholder="e.g. Intro to Artificial Intelligence" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Description</label>
                <textarea 
                  required 
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#E0A526] focus:border-transparent transition-all duration-200 min-h-[100px]"
                  placeholder="A short description of what students will learn..." 
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Emoji Icon</label>
                <Input 
                  required 
                  placeholder="e.g. 🤖" 
                  maxLength={5}
                  value={formData.iconName}
                  onChange={e => setFormData({ ...formData, iconName: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Subject'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
