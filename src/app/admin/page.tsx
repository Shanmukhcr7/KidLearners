'use client'

import { useEffect, useState } from 'react'
import { collection, getCountFromServer, onSnapshot, query, orderBy, limit, where } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/Card'
import { DashboardStatSkeleton } from '@/components/shared/SkeletonLoader'
import type { School } from '@/lib/firebase/firestore'
import { 
  School as SchoolIcon, Users, BookOpen, Trophy, 
  TrendingUp, ArrowUpRight, Folder, FileText, CheckSquare, Plus, Video 
} from 'lucide-react'
import Link from 'next/link'
import { Sparkline } from '@/components/ui/Sparkline'
import { FadeIn } from '@/components/ui/Transitions'
import { NumberCounter } from '@/components/ui/GSAPAnimations'
import { cn } from '@/lib/utils'

export default function AdminOverviewPage() {
  const { role, schoolId, profile } = useAuth()
  const [schoolCount,  setSchoolCount]  = useState<number | null>(null)
  const [studentCount, setStudentCount] = useState<number | null>(null)
  const [subjectCount, setSubjectCount] = useState<number | null>(null)
  const [topSchools,   setTopSchools]   = useState<School[]>([])
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    async function loadStats() {
      if (role === 'superadmin') {
        const [sc, stc, subc] = await Promise.all([
          getCountFromServer(collection(db, 'schools')),
          getCountFromServer(query(collection(db, 'users'), where('role', '==', 'student'))),
          getCountFromServer(collection(db, 'subjects')),
        ])
        setSchoolCount(sc.data().count)
        setStudentCount(stc.data().count)
        setSubjectCount(subc.data().count)
      } else if (role === 'school_admin' && schoolId) {
        const stc = await getCountFromServer(
          query(collection(db, 'users'), where('role', '==', 'student'), where('schoolId', '==', schoolId))
        )
        setStudentCount(stc.data().count)
      }

      const topQ = query(collection(db, 'schools'), orderBy('rank', 'asc'), limit(5))
      onSnapshot(topQ, snap => {
        setTopSchools(snap.docs.map(d => ({ id: d.id, ...d.data() }) as School))
        setLoading(false)
      })
    }
    if (role) loadStats()
  }, [role, schoolId])

  const firstName = profile?.name?.split(' ')[0] ?? 'Admin'

  const mockSparklines = {
    schools: [5, 10, 15, 14, 20, 25, 30],
    students: [100, 150, 120, 300, 400, 500, 800],
    subjects: [2, 3, 3, 4, 5, 5, 8],
  }

  const isSuper = role === 'superadmin'

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardStatSkeleton />
        <DashboardStatSkeleton />
        <DashboardStatSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <FadeIn className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight mb-2">
            Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {firstName}.
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            {isSuper ? 'Here is what’s happening across the global platform today.' : 'Here is what’s happening in your school today.'}
          </p>
        </div>
      </FadeIn>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
        
        {/* Main Hero Stat (Takes up more space) */}
        <FadeIn delay={0.1} className="md:col-span-2 lg:col-span-3">
          <Link href="/admin/students" className="block h-full">
            <Card className="h-full bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 flex flex-col justify-between group">
              <div>
                <p className="text-white/60 font-bold uppercase tracking-widest text-xs mb-2">Total Active Students</p>
                <div className="flex items-end gap-4">
                  <h2 className="text-6xl font-display font-black tabular-nums tracking-tighter">
                    <NumberCounter value={studentCount ?? 0} />
                  </h2>
                  <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full text-sm font-medium mb-2">
                    <TrendingUp className="w-4 h-4 text-[var(--color-accent-yellow)]" />
                    <span className="text-[var(--color-accent-yellow)]">+12%</span>
                  </div>
                </div>
              </div>
              
              <div className="h-24 w-full mt-8 opacity-80 group-hover:opacity-100 transition-opacity">
                <Sparkline data={mockSparklines.students} color="#E0A526" type="area" height={96} />
              </div>
            </Card>
          </Link>
        </FadeIn>

        {/* Secondary Stats */}
        {isSuper && (
          <>
            <FadeIn delay={0.15} className="md:col-span-2 lg:col-span-1.5 flex">
              <Link href="/admin/schools" className="block w-full">
                <Card className="h-full p-6 flex flex-col justify-between group bg-white/80">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <SchoolIcon className="w-6 h-6" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-display font-black text-slate-900 tabular-nums">
                      <NumberCounter value={schoolCount ?? 0} />
                    </h3>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mt-1">Partner Schools</p>
                  </div>
                </Card>
              </Link>
            </FadeIn>

            <FadeIn delay={0.2} className="md:col-span-2 lg:col-span-1.5 flex">
              <Link href="/admin/curriculum" className="block w-full">
                <Card className="h-full p-6 flex flex-col justify-between group bg-white/80">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-display font-black text-slate-900 tabular-nums">
                      <NumberCounter value={subjectCount ?? 0} />
                    </h3>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mt-1">Active Subjects</p>
                  </div>
                </Card>
              </Link>
            </FadeIn>
          </>
        )}

        {/* Quick Actions Panel */}
        <FadeIn delay={0.25} className="md:col-span-4 lg:col-span-3">
          <Card hover={false} className="h-full p-6 bg-white/60">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-slate-400" /> Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'New Task', icon: CheckSquare, href: '/admin/tasks/new', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Write Blog', icon: FileText, href: '/admin/blogs/new', color: 'text-rose-600', bg: 'bg-rose-50' },
                { label: 'Upload Media', icon: Folder, href: '/admin/media', color: 'text-sky-600', bg: 'bg-sky-50' },
                { label: 'Live Session', icon: Video, href: '/admin/workshops/new', color: 'text-amber-600', bg: 'bg-amber-50' }
              ].map((action, i) => (
                <Link key={i} href={action.href}>
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-300 hover:shadow-sm transition-all gap-3 h-full group">
                    <div className={`w-10 h-10 rounded-xl ${action.bg} ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 text-center">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </FadeIn>

        {/* Top Schools Leaderboard */}
        {isSuper && (
          <FadeIn delay={0.3} className="md:col-span-4 lg:col-span-3">
            <Card hover={false} className="h-full p-6 bg-white/80 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[var(--color-accent-yellow)]" />
                  Top Performing Schools
                </h3>
                <Link href="/admin/leaderboard" className="text-xs font-bold text-[var(--color-primary)] hover:underline">
                  View All
                </Link>
              </div>
              
              <div className="flex-1 space-y-3">
                {topSchools.map((school, i) => (
                  <Link key={school.id} href={`/admin/schools/${school.id}`} className="block">
                    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm",
                        i === 0 ? "bg-[var(--color-accent-yellow)]/20 text-[var(--color-accent-yellow)]" : "bg-slate-100 text-slate-500"
                      )}>
                        #{school.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">{school.name}</p>
                        <p className="text-xs font-medium text-slate-500 truncate">{school.city}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900 tabular-nums">{school.averageScore?.toFixed(0)}%</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Score</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </FadeIn>
        )}

      </div>
    </div>
  )
}
