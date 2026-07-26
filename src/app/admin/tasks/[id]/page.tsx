'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { Task, User } from '@/lib/firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, Save, Users as UsersIcon } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function TaskFormPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const { profile, role, schoolId } = useAuth()
  const isNew = id === 'new'
  
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  
  const [students, setStudents] = useState<User[]>([])
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const [assignToAll, setAssignToAll] = useState(true)

  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
    type: 'assignment'
  })

  // Load students for assignment
  useEffect(() => {
    if (!profile) return
    async function fetchStudents() {
      try {
        let q;
        if (role === 'superadmin') {
          q = query(collection(db, 'users'), where('role', '==', 'student'))
        } else {
          q = query(collection(db, 'users'), where('role', '==', 'student'), where('schoolId', '==', schoolId))
        }
        const snap = await getDocs(q)
        setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() }) as User))
      } catch (err) {
        console.error("Failed to load students", err)
      }
    }
    fetchStudents()
  }, [profile, role, schoolId])

  // Load Task
  useEffect(() => {
    if (isNew) return
    async function load() {
      try {
        const snap = await getDoc(doc(db, 'tasks', id))
        if (snap.exists()) {
          const data = snap.data() as Task
          setFormData({
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate).toISOString().slice(0, 16) : ''
          })
          if (data.assignedTo?.includes('all')) {
            setAssignToAll(true)
          } else {
            setAssignToAll(false)
            setSelectedStudents(new Set(data.assignedTo || []))
          }
        } else {
          toast.error("Task not found")
        }
      } catch (err) {
        console.error(err)
        toast.error("Failed to load task")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isNew])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    try {
      const assignedTo = assignToAll ? ['all'] : Array.from(selectedStudents)
      
      const payload = { 
        ...formData, 
        assignedTo,
        dueDate: new Date(formData.dueDate!).toISOString(),
        schoolId: role === 'superadmin' ? 'global' : schoolId
      }

      if (isNew) {
        const newRef = doc(collection(db, 'tasks'))
        await setDoc(newRef, {
          ...payload,
          id: newRef.id,
          createdAt: new Date().toISOString()
        })
        toast.success("Task assigned!")
        router.push('/admin/tasks')
      } else {
        await updateDoc(doc(db, 'tasks', id), payload)
        toast.success("Task updated!")
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to save task")
    } finally {
      setSaving(false)
    }
  }

  function toggleStudent(studentId: string) {
    const newSet = new Set(selectedStudents)
    if (newSet.has(studentId)) {
      newSet.delete(studentId)
    } else {
      newSet.add(studentId)
    }
    setSelectedStudents(newSet)
  }

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/admin/tasks" className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors font-semibold">
        <ArrowLeft className="w-4 h-4" /> Back to Tasks
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-slate-900">{isNew ? 'Assign Task' : 'Edit Task'}</h1>
        <p className="text-slate-500 mt-1 font-medium">Create assignments or reading materials for students.</p>
      </div>

      <div className="grid md:grid-cols-[1fr,300px] gap-6">
        <Card>
          <CardContent className="pt-6">
            <form id="task-form" onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Title</label>
                  <Input 
                    required 
                    placeholder="e.g. Read Chapter 4"
                    value={formData.title || ''}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Task Type</label>
                    <select 
                      className="w-full border border-slate-200 bg-white text-slate-900 rounded-lg h-10 px-3 transition-all focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                      value={formData.type || 'assignment'}
                      onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                    >
                      <option value="reading">Reading</option>
                      <option value="assignment">Assignment</option>
                      <option value="project">Project</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Due Date</label>
                    <Input 
                      type="datetime-local"
                      required
                      value={formData.dueDate || ''}
                      onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Description / Instructions</label>
                  <textarea
                    required
                    rows={6}
                    className="w-full border border-slate-200 bg-white text-slate-900 rounded-lg p-3 transition-all focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 resize-none"
                    placeholder="What should the students do?"
                    value={formData.description || ''}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="justify-end border-t border-slate-100 mt-6 pt-6">
            <Button type="submit" form="task-form" loading={saving}>
              <Save className="w-4 h-4 mr-2" /> {isNew ? 'Assign Task' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>

        {/* Assignment Sidebar */}
        <Card className="h-fit">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-[var(--color-primary)]" />
              Assign To
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center gap-2 mb-2 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer" onClick={() => setAssignToAll(!assignToAll)}>
              <input type="checkbox" checked={assignToAll} readOnly className="w-4 h-4 text-[var(--color-primary)] rounded border-slate-300" />
              <span className="text-sm font-bold text-slate-900">All My Students</span>
            </div>
            
            {!assignToAll && (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {students.map(student => (
                  <label key={student.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-[var(--color-primary)] rounded border-slate-300"
                      checked={selectedStudents.has(student.id)}
                      onChange={() => toggleStudent(student.id)}
                    />
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{student.name}</div>
                      <div className="text-xs text-slate-500">{student.grade || 'No grade'}</div>
                    </div>
                  </label>
                ))}
                {students.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No students found.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
