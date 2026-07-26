'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { School } from '@/lib/firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { ArrowLeft, Save, ShieldAlert, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function SchoolDetailsPage({ params }: { params: Promise<{ schoolId: string }> }) {
  const router = useRouter()
  const { schoolId } = use(params)
  const [school, setSchool] = useState<School | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<School>>({})

  useEffect(() => {
    async function fetchSchool() {
      try {
        const snap = await getDoc(doc(db, 'schools', schoolId))
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() } as School
          setSchool(data)
          setFormData(data)
        }
      } catch (err) {
        console.error(err)
        toast.error("Failed to load school")
      } finally {
        setLoading(false)
      }
    }
    fetchSchool()
  }, [schoolId])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateDoc(doc(db, 'schools', schoolId), formData)
      setSchool({ ...school, ...formData } as School)
      toast.success("School updated successfully")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to update school")
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus() {
    if (!school) return
    const newStatus = !school.active
    const confirmMsg = newStatus 
      ? `Are you sure you want to activate ${school.name}?` 
      : `Are you sure you want to suspend ${school.name}? Students will not be able to log in.`
    
    if (!confirm(confirmMsg)) return

    try {
      await updateDoc(doc(db, 'schools', schoolId), { active: newStatus })
      setSchool({ ...school, active: newStatus })
      setFormData(prev => ({ ...prev, active: newStatus }))
      toast.success(newStatus ? "School activated" : "School suspended")
    } catch (err: any) {
      console.error(err)
      toast.error("Failed to update status")
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading school details...</div>
  if (!school) return <div className="p-8 text-center text-red-500 font-medium">School not found</div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/admin/schools" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Schools
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{school.name}</h1>
          <p className="text-slate-500 mt-1 font-medium">{school.schoolCode} · {school.city}</p>
        </div>
        <Badge variant={school.active ? 'success' : 'danger'} className="text-sm px-3 py-1">
          {school.active ? 'Active' : 'Suspended'}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>School Information</CardTitle>
          <CardDescription>Update contact and location details</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="edit-form" onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">School Name</label>
                <Input 
                  required 
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">School Code</label>
                <Input 
                  required 
                  value={formData.schoolCode || ''}
                  onChange={e => setFormData({ ...formData, schoolCode: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">City</label>
                <Input 
                  required 
                  value={formData.city || ''}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Subscription Tier</label>
                <select 
                  className="w-full border border-slate-200 bg-white text-slate-900 rounded-lg h-10 px-3 transition-all focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  value={formData.subscriptionTier || 'free'}
                  onChange={e => setFormData({ ...formData, subscriptionTier: e.target.value as any })}
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Contact Person</label>
                <Input 
                  required 
                  value={formData.contactPerson || ''}
                  onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Contact Email</label>
                <Input 
                  required 
                  type="email"
                  value={formData.contactEmail || ''}
                  onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-between">
          <Button 
            type="button" 
            variant={school.active ? 'danger' : 'secondary'}
            onClick={toggleStatus}
          >
            {school.active ? (
              <><ShieldAlert className="w-4 h-4" /> Suspend School</>
            ) : (
              <><CheckCircle2 className="w-4 h-4 text-green-600" /> Activate School</>
            )}
          </Button>
          <Button type="submit" form="edit-form" loading={saving}>
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
