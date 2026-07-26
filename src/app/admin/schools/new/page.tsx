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

export default function NewSchoolPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    schoolCode: '',
    city: '',
    contactPerson: '',
    contactEmail: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const newRef = doc(collection(db, 'schools'))
      await setDoc(newRef, {
        id: newRef.id,
        name: formData.name,
        schoolCode: formData.schoolCode,
        logoUrl: '',
        city: formData.city,
        contactPerson: formData.contactPerson,
        contactEmail: formData.contactEmail,
        tieUpDate: new Date().toISOString(),
        active: true,
        aggregateScore: 0,
        averageScore: 0,
        activeStudentCount: 0,
        rank: 999, // default unranked
        rankTrend: 0,
      })
      router.push('/admin/schools')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to create school')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/admin/schools" className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] mb-6 transition-colors font-semibold">
        <ArrowLeft className="w-4 h-4" /> Back to Schools
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Add New School</CardTitle>
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
                <label className="block text-sm font-medium text-slate-900 mb-1">School Name</label>
                <Input 
                  required 
                  placeholder="e.g. Oakridge International" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">School Code</label>
                <Input 
                  required 
                  placeholder="e.g. KL-OAK01" 
                  value={formData.schoolCode}
                  onChange={e => setFormData({ ...formData, schoolCode: e.target.value })}
                />
                <p className="text-xs text-slate-500 mt-1">This code is used by students to login.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">City</label>
                <Input 
                  required 
                  placeholder="e.g. Hyderabad" 
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Contact Person</label>
                  <Input 
                    required 
                    placeholder="e.g. Jane Doe" 
                    value={formData.contactPerson}
                    onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Contact Email</label>
                  <Input 
                    required 
                    type="email"
                    placeholder="e.g. jane@school.com" 
                    value={formData.contactEmail}
                    onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" loading={loading}>
                {loading ? 'Creating...' : 'Create School'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
