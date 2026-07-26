'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy, where, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { User, School } from '@/lib/firebase/firestore'
import { DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { Search, Copy } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { FadeIn } from '@/components/ui/Transitions'

export default function AdminStudentsPage() {
  const { role, schoolId, loading: authLoading } = useAuth()
  const [students, setStudents] = useState<User[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [school, setSchool] = useState<School | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!role) return

    if (role === 'school_admin' && schoolId) {
      getDoc(doc(db, 'schools', schoolId)).then(snap => {
        if(snap.exists()) setSchool({ id: snap.id, ...snap.data() } as School)
      })
    }

    let q = query(collection(db, 'users'), where('role', '==', 'student'), orderBy('name'))
    if (role === 'school_admin' && schoolId) {
      q = query(collection(db, 'users'), where('role', '==', 'student'), where('schoolId', '==', schoolId), orderBy('name'))
    }

    const unsub = onSnapshot(q, snap => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() }) as User))
      setLoading(false)
    })
    return unsub
  }, [role, schoolId, authLoading])

  const filtered = students.filter(s =>
    search === '' ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleCopyCode = () => {
    if (school?.schoolCode) {
      navigator.clipboard.writeText(school.schoolCode)
      alert('Invite code copied to clipboard!')
    }
  }

  return (
    <FadeIn>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Students</h1>
          <p className="text-sm text-slate-500">{students.length} students enrolled</p>
        </div>
        
        {role === 'school_admin' && school && (
          <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-xl flex items-center gap-4">
             <div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Your School Invite Code</p>
               <p className="font-display text-xl font-bold text-[var(--color-accent-blue)] tracking-widest">{school.schoolCode}</p>
             </div>
             <Button onClick={handleCopyCode} variant="ghost" className="border border-slate-200">
                <Copy className="w-5 h-5" />
             </Button>
          </div>
        )}
      </div>

      <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <Input
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm border-none bg-slate-50 h-10"
        />
      </div>

      <div className="bg-white rounded-[16px] border border-slate-200 shadow-sm p-6 overflow-x-auto">
        <DataTable
          loading={loading}
          data={filtered as unknown as Record<string, unknown>[]}
          emptyVariant={search ? 'search' : 'students'}
          columns={[
            {
              key: 'name', header: 'Student', sortable: true,
              render: (row) => {
                const s = row as unknown as User
                return (
                  <Link href={`/admin/students/${s.id}`} className="hover:text-[var(--color-accent-blue)] transition-colors">
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <div className="text-xs text-slate-500 font-bold">{s.email}</div>
                  </Link>
                )
              },
            },
            { key: 'grade', header: 'Grade', sortable: true },
            {
              key: 'schoolId', header: 'School',
              render: (row) => {
                const s = row as unknown as User
                return <span className="text-xs font-mono font-bold text-slate-500">{s.schoolId}</span>
              },
            },
            {
              key: 'streak', header: 'Streak', sortable: true,
              render: (row) => {
                const s = row as unknown as User
                return <span className="font-display font-black text-[var(--color-accent-yellow)] text-lg">🔥 {s.streak ?? 0}</span>
              },
            },
            {
              key: 'actions', header: '',
              render: (row) => {
                const s = row as unknown as User
                return (
                  <Link href={`/admin/students/${s.id}`}>
                    <Button variant="ghost" size="sm" className="font-bold">Manage</Button>
                  </Link>
                )
              },
            },
          ]}
        />
      </div>
    </FadeIn>
  )
}
