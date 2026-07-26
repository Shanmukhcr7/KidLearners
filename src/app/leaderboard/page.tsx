'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { School } from '@/lib/firebase/firestore'
import { Badge } from '@/components/ui/Badge'
import { SchoolRankCardSkeleton } from '@/components/shared/SkeletonLoader'
import { useAuth } from '@/contexts/AuthContext'
import { TrendingUp, TrendingDown, Minus, Trophy, BookOpen, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function LeaderboardPage() {
  const { loading: authLoading, profile, role } = useAuth()
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!profile && !role) return // Wait until properly authenticated as either student or admin

    const q = query(
      collection(db, 'schools'),
      orderBy('rank', 'asc')
    )
    const unsub = onSnapshot(q, snap => {
      setSchools(snap.docs
        .map(d => ({ id: d.id, ...d.data() }) as School)
        .filter(s => s.active)
      )
      setLoading(false)
    })
    return unsub
  }, [authLoading, profile, role])

  const top3 = schools.slice(0, 3)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#3A2E1F] text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
            <Link href="/dashboard" className="flex items-center gap-1.5 hover:text-[var(--color-accent-yellow)] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6 text-[var(--color-accent-yellow)]" />
            <h1 className="font-sora text-2xl font-bold">School Leaderboard</h1>
          </div>
          <p className="text-slate-500 text-sm">
            Ranked by average quiz score across all students. Updated after every quiz submission.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Top 3 podium */}
        {!loading && top3.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[top3[1], top3[0], top3[2]].map((school, i) => {
              const rank    = [2, 1, 3][i]
              const isFirst = rank === 1
              return (
                <div
                  key={school?.id}
                  className={cn(
                    'rounded-[16px] border p-5 text-center',
                    isFirst
                      ? 'bg-[#3A2E1F] border-slate-900 text-white mt-0'
                      : 'bg-white border-slate-200 mt-8'
                  )}
                >
                  <div className={cn(
                    'text-2xl font-sora font-black mb-1',
                    isFirst ? 'text-[var(--color-accent-yellow)]' : 'text-slate-900'
                  )}>
                    #{rank}
                  </div>
                  <p className={cn(
                    'font-semibold text-sm mb-1 truncate',
                    isFirst ? 'text-white' : 'text-slate-900'
                  )}>
                    {school?.name}
                  </p>
                  <p className={cn(
                    'text-xs',
                    isFirst ? 'text-slate-500' : 'text-slate-500'
                  )}>
                    {school?.averageScore?.toFixed(1)}% avg
                  </p>
                  {isFirst && (
                    <div className="mt-3 text-lg">🏆</div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Full table */}
        <div className="bg-white border border-slate-200 rounded-[12px] overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <div className="grid grid-cols-[40px_1fr_80px_80px_80px_60px] gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <span>Rank</span>
              <span>School</span>
              <span className="text-center">Avg Score</span>
              <span className="text-center">Students</span>
              <span className="text-center">City</span>
              <span className="text-center">Trend</span>
            </div>
          </div>

          {loading ? (
            <div className="divide-y divide-[#EFE6D3]">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="px-4 py-4">
                  <div className="skeleton h-5 w-full rounded" />
                </div>
              ))}
            </div>
          ) : schools.length === 0 ? (
            <div className="py-16 text-center">
              <Trophy className="w-8 h-8 text-[#EFE6D3] mx-auto mb-3" />
              <p className="text-sm text-slate-500">Rankings appear once schools complete quizzes.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#EFE6D3]">
              {schools.map((school) => (
                <div
                  key={school.id}
                  className="grid grid-cols-[40px_1fr_80px_80px_80px_60px] gap-4 px-4 py-4 items-center hover:bg-slate-50 transition-colors"
                >
                  {/* Rank */}
                  <span className={cn(
                    'font-sora font-black tabular-nums text-lg',
                    school.rank === 1 ? 'text-[var(--color-accent-yellow)]' :
                    school.rank === 2 ? 'text-slate-500' :
                    school.rank === 3 ? 'text-[#B9821A]' :
                    'text-slate-900'
                  )}>
                    {school.rank}
                  </span>

                  {/* School name */}
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{school.name}</p>
                    <p className="text-xs text-slate-500 font-mono">{school.schoolCode}</p>
                  </div>

                  {/* Avg score */}
                  <div className="text-center">
                    <span className="font-sora font-bold text-slate-900 tabular-nums">
                      {school.averageScore?.toFixed(1) ?? '—'}%
                    </span>
                  </div>

                  {/* Student count */}
                  <div className="text-center text-sm text-slate-500 tabular-nums">
                    {school.activeStudentCount ?? 0}
                  </div>

                  {/* City */}
                  <div className="text-center text-xs text-slate-500">{school.city}</div>

                  {/* Trend */}
                  <div className="flex justify-center">
                    {(school.rankTrend ?? 0) > 0 ? (
                      <TrendingUp className="w-4 h-4 text-[#16A34A]" />
                    ) : (school.rankTrend ?? 0) < 0 ? (
                      <TrendingDown className="w-4 h-4 text-[#E76F51]" />
                    ) : (
                      <Minus className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 text-center mt-4">
          Only school-level averages shown. Individual student scores are never publicly displayed.
        </p>
      </div>
    </div>
  )
}
