'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { School } from '@/lib/firebase/firestore'
import { DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import Link from 'next/link'

export default function AdminSchoolsPage() {
  const { loading: authLoading, profile } = useAuth()
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!profile) return

    const q = query(collection(db, 'schools'), orderBy('rank', 'asc'))
    const unsub = onSnapshot(q, snap => {
      setSchools(snap.docs.map(d => ({ id: d.id, ...d.data() }) as School))
      setLoading(false)
    })
    return unsub
  }, [authLoading, profile])

  function exportCSV() {
    const header = 'Name,Code,City,Rank,Avg Score,Active Students,Status\n'
    const rows   = schools.map(s =>
      `"${s.name}","${s.schoolCode}","${s.city}",${s.rank},${s.averageScore},${s.activeStudentCount},${s.active ? 'Active' : 'Inactive'}`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a'); a.href = url; a.download = 'schools.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const TrendIcon = ({ trend }: { trend: number }) => {
    if (trend > 0) return <TrendingUp  className="w-3.5 h-3.5 text-[#16A34A]" />
    if (trend < 0) return <TrendingDown className="w-3.5 h-3.5 text-[#E76F51]" />
    return <Minus className="w-3.5 h-3.5 text-slate-500" />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Schools</h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">{schools.length} schools on the platform</p>
        </div>
        <Link href="/admin/schools/new">
          <Button>
            <Plus className="w-4 h-4" /> Add School
          </Button>
        </Link>
      </div>

      <DataTable
        loading={loading}
        data={schools as unknown as Record<string, unknown>[]}
        emptyVariant="schools"
        emptyAction={<Link href="/admin/schools/new"><Button size="sm">Add first school</Button></Link>}
        onExportCSV={exportCSV}
        columns={[
          {
            key: 'rank', header: 'Rank', sortable: true, width: 'w-16',
            render: (row) => {
              const s = row as unknown as School
              return (
                <div className="flex items-center gap-1">
                  <span className="font-bold text-slate-900">#{s.rank}</span>
                  <TrendIcon trend={s.rankTrend ?? 0} />
                </div>
              )
            },
          },
          {
            key: 'name', header: 'School', sortable: true,
            render: (row) => {
              const s = row as unknown as School
              return (
                <Link href={`/admin/schools/${s.id}`} className="hover:text-[var(--color-primary)] transition-colors font-semibold">
                  <div>{s.name}</div>
                  <div className="text-xs text-slate-500 font-medium">{s.schoolCode}</div>
                </Link>
              )
            },
          },
          { key: 'city', header: 'City', sortable: true },
          {
            key: 'averageScore', header: 'Avg Score', sortable: true,
            render: (row) => {
              const s = row as unknown as School
              return (
                <span className="font-bold text-slate-900">
                  {s.averageScore?.toFixed(1) ?? '—'}
                </span>
              )
            },
          },
          {
            key: 'activeStudentCount', header: 'Students', sortable: true,
            render: (row) => {
              const s = row as unknown as School
              return <span className="text-slate-500">{s.activeStudentCount ?? 0}</span>
            },
          },
          {
            key: 'active', header: 'Status',
            render: (row) => {
              const s = row as unknown as School
              return <Badge variant={s.active ? 'success' : 'muted'}>{s.active ? 'Active' : 'Inactive'}</Badge>
            },
          },
          {
            key: 'actions', header: '',
            render: (row) => {
              const s = row as unknown as School
              return (
                <Link href={`/admin/schools/${s.id}`}>
                  <Button variant="ghost" size="sm">Manage →</Button>
                </Link>
              )
            },
          },
        ]}
      />
    </div>
  )
}
