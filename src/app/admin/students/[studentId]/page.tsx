'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { User } from '@/lib/firebase/firestore'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FadeIn } from '@/components/ui/Transitions'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

export default function AdminStudentDetailPage({ params }: { params: { studentId: string } }) {
  const router = useRouter()
  const { studentId } = params
  const [student, setStudent] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [difficultyTier, setDifficultyTier] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')

  useEffect(() => {
    getDoc(doc(db, 'users', studentId)).then(snap => {
      if (snap.exists()) {
        const data = snap.data() as User
        setStudent({ id: snap.id, ...data })
        setName(data.name)
        setGrade(data.grade || '')
        setDifficultyTier(data.difficultyTier || 'beginner')
      } else {
        setError('Student not found')
      }
      setLoading(false)
    }).catch(err => {
      setError(err.message)
      setLoading(false)
    })
  }, [studentId])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateDoc(doc(db, 'users', studentId), {
        name,
        grade,
        difficultyTier
      })
      alert('Student updated successfully!')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveFromSchool = async () => {
    if (!confirm('Are you sure you want to remove this student from your school? They will lose access to school content.')) return
    setSaving(true)
    try {
      await updateDoc(doc(db, 'users', studentId), {
        role: 'user',
        schoolId: null
      })
      router.push('/admin/students')
    } catch (err: any) {
      alert(err.message)
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>
  if (!student) return null

  return (
    <FadeIn className="p-8">
      <Link href="/admin/students" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to Students
      </Link>

      <h1 className="text-3xl font-display font-bold text-slate-900 mb-8">Edit Student: {student.name}</h1>

      <div className="bg-white rounded-[16px] border border-slate-200 shadow-sm p-8 max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
            <Input value={student.email} disabled className="bg-slate-50 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Grade Level</label>
            <Input value={grade} onChange={e => setGrade(e.target.value)} placeholder="e.g. 5th Grade" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Difficulty Tier</label>
            <select
              value={difficultyTier}
              onChange={e => setDifficultyTier(e.target.value as any)}
              className="w-full h-12 px-4 border-2 border-slate-900 rounded-xl bg-white font-bold"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-slate-200 mt-6">
            <Button type="button" onClick={handleRemoveFromSchool} variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 border border-slate-200">
               Remove from School
            </Button>
            <Button type="submit" loading={saving} className="bg-[var(--color-accent-blue)] text-white hover:brightness-110 font-bold border border-slate-200 shadow-sm gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </form>
      </div>
    </FadeIn>
  )
}
