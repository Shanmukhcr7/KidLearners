'use client'

import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { User, School } from '@/lib/firebase/firestore'
import { DataTable } from '@/components/admin/DataTable'
import { FadeIn } from '@/components/ui/Transitions'
import { Button } from '@/components/ui/Button'

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    // Load schools for assigning
    getDocs(collection(db, 'schools')).then(snap => {
      setSchools(snap.docs.map(d => ({ id: d.id, ...d.data() }) as School))
    })

    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() }) as User))
      setLoading(false)
    }, err => {
      setError(err.message)
      setLoading(false)
    })
    return unsub
  }, [])

  const handlePromote = async (userId: string, newRole: string, schoolId: string | null = null) => {
    if (!confirm(`Are you sure you want to promote this user to ${newRole}?`)) return
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        schoolId: schoolId
      })
      alert('User promoted successfully.')
    } catch (err: any) {
      alert(err.message || 'Failed to promote user.')
    }
  }

  const columns = [
    { key: 'name', header: 'Name', accessor: (u: User) => u.name },
    { key: 'email', header: 'Email', accessor: (u: User) => u.email },
    { key: 'role', header: 'Role', accessor: (u: User) => (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
        u.role === 'superadmin' ? 'bg-purple-100 text-purple-700' :
        u.role === 'school_admin' ? 'bg-blue-100 text-blue-700' :
        u.role === 'student' ? 'bg-green-100 text-green-700' :
        'bg-slate-100 text-slate-700'
      }`}>
        {u.role.toUpperCase()}
      </span>
    )},
    { key: 'schoolId', header: 'School ID', accessor: (u: User) => u.schoolId || '—' },
    { key: 'actions', header: 'Actions', accessor: (u: User) => (
      <div className="flex gap-2 items-center">
        {u.role === 'user' && (
          <select 
            className="text-xs border-2 border-slate-900 rounded bg-slate-50 px-2 py-1"
            onChange={(e) => {
              if (e.target.value) {
                handlePromote(u.id, 'school_admin', e.target.value)
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>Make School Admin...</option>
            {schools.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        )}
        {u.role === 'user' && (
          <Button 
            onClick={() => handlePromote(u.id, 'superadmin')} 
            className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
          >
            Make Superadmin
          </Button>
        )}
        {u.role !== 'user' && u.role !== 'superadmin' && (
          <Button 
            onClick={() => handlePromote(u.id, 'user', null)} 
            className="h-7 text-xs bg-red-600 hover:bg-red-700 text-white"
          >
            Revoke Access
          </Button>
        )}
      </div>
    )}
  ]

  if (error) return <div className="p-8 text-red-600">{error}</div>

  return (
    <FadeIn className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">All Users</h1>
          <p className="text-slate-500">Manage platform users and assign admin roles.</p>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-slate-200 shadow-sm p-6 overflow-x-auto">
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          emptyMessage="No users found."
        />
      </div>
    </FadeIn>
  )
}
