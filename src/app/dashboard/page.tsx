'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, doc, getDoc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { School, Subject, Chapter, ChapterProgress, Task, Exam } from '@/lib/firebase/firestore'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DashboardStatSkeleton, SchoolRankCardSkeleton } from '@/components/shared/SkeletonLoader'
import { signOut } from 'firebase/auth'
import {
  TrendUp, TrendDown, Minus, Fire, BookOpenText,
  CaretRight, Trophy, SignOut, Robot, Clock, FileText, CheckCircle
} from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { FadeIn } from '@/components/ui/Transitions'
import { SplitTextReveal, NumberCounter } from '@/components/ui/GSAPAnimations'
import Image from 'next/image'
import { StudentNav } from '@/components/layout/StudentNav'

// Progress bar component
function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="w-full bg-[var(--border)] rounded-full h-2.5 overflow-hidden">
      <div
        className="h-full bg-[var(--color-accent-green)] rounded-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative"
        style={{ width: `${pct}%` }}
      >
        <div className="absolute inset-0 bg-white/20" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { profile, loading: authLoading } = useAuth()
  const router = useRouter()

  const [school,    setSchool]    = useState<School | null>(null)
  const [subjects,  setSubjects]  = useState<Subject[]>([])
  const [chapters,  setChapters]  = useState<Chapter[]>([])
  const [progress,  setProgress]  = useState<Record<string, ChapterProgress>>({})
  const [tasks,     setTasks]     = useState<Task[]>([])
  const [exams,     setExams]     = useState<Exam[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!profile) { router.push('/login'); return }

    async function loadData() {
      try {
        // School rank card
        if (profile!.schoolId) {
          const schoolSnap = await getDoc(doc(db, 'schools', profile!.schoolId))
          if (schoolSnap.exists()) setSchool({ id: schoolSnap.id, ...schoolSnap.data() } as School)
        }

        // Subjects
        const subQ = query(collection(db, 'subjects'), orderBy('name'))
        const unsubSub = onSnapshot(subQ, snap => {
          setSubjects(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Subject))
        }, err => setError(err.message))

        // Chapters
        const chapQ = query(collection(db, 'chapters'))
        const unsubChap = onSnapshot(chapQ, snap => {
          setChapters(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Chapter))
        }, err => setError(err.message))

        // Progress
        const progressQ = collection(db, 'studentChapterProgress', profile!.id, 'chapters')
        const unsubProg = onSnapshot(progressQ, snap => {
          const map: Record<string, ChapterProgress> = {}
          snap.docs.forEach(d => { map[d.id] = d.data() as ChapterProgress })
          setProgress(map)
          setLoading(false)
        }, err => {
          setError(err.message)
          setLoading(false)
        })

        // Tasks
        const tasksQ = query(collection(db, 'tasks'))
        const unsubTasks = onSnapshot(tasksQ, snap => {
          const allTasks = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Task)
          // Filter tasks assigned to 'all' or specifically to this student
          const myTasks = allTasks.filter(t => t.assignedTo?.includes('all') || t.assignedTo?.includes(profile!.id))
          setTasks(myTasks)
        }, err => console.error("Tasks error", err))

        // Exams
        const examsQ = query(collection(db, 'exams'))
        const unsubExams = onSnapshot(examsQ, snap => {
          const allExams = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Exam)
          const myExams = allExams.filter(e => e.schoolId === profile!.schoolId || e.schoolId === 'global')
          setExams(myExams)
        }, err => console.error("Exams error", err))

        return () => { unsubSub(); unsubChap(); unsubProg(); unsubTasks(); unsubExams() }
      } catch (err: any) {
        console.error("Error loading dashboard data:", err)
        setError(err.message)
        setLoading(false)
      }
    }

    const cleanup = loadData()
    return () => { cleanup.then(unsub => unsub && unsub()) }
  }, [authLoading, profile, router])

  const hour        = new Date().getHours()
  const greeting    = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName   = profile?.name?.split(' ')[0] ?? 'there'

  const completedCount = Object.values(progress).filter(p => p.status === 'completed').length
  const totalChapters  = chapters.length

  // Subject progress
  const subjectProgress = subjects.map(sub => {
    const subChaps = chapters.filter(c => c.subjectId === sub.id)
    const done     = subChaps.filter(c => progress[c.id]?.status === 'completed').length
    return { ...sub, done, total: subChaps.length }
  })

  // Recommended next: first incomplete chapter across any subject
  const nextChapter = chapters.find(c => !progress[c.id] || progress[c.id].status === 'not_started' || progress[c.id].status === 'reading')

  async function handleSignOut() {
    await signOut(auth)
    document.cookie = '__session=; path=/; max-age=0'
    router.push('/login')
  }

  if (error) return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center">
      <div className="bg-red-50 border border-red-200 p-8 rounded-2xl">
        <h2 className="text-red-800 font-bold text-xl mb-4">Database Connection Error</h2>
        <p className="text-red-600 mb-6 font-mono text-sm">{error}</p>
        <p className="text-red-700">This usually happens if your Firestore Security Rules haven't been published yet.</p>
        <Button onClick={() => window.location.reload()} className="mt-6" variant="primary">Try Again</Button>
      </div>
    </div>
  )

  if (loading || authLoading) return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      <SchoolRankCardSkeleton />
      <div className="grid sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <DashboardStatSkeleton key={i} />)}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <StudentNav />

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        <FadeIn>
          {/* Greeting */}
          <div className="flex items-start justify-between relative">
            <div className="relative z-10 flex items-center gap-6">
              <div className="hidden sm:block w-24 h-24 relative bg-[white] rounded-full border-4 border-[var(--color-accent-yellow)] shadow-sm overflow-hidden shrink-0">
                 {/* Fake crop from hero image for companion avatar */}
                 <Image src="/images/hero.png" alt="Companion" fill className="object-cover object-top" />
              </div>
              <div>
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                  {greeting}, <em className="text-[var(--sunset-coral)] not-italic">{firstName}!</em>
                </h1>
                <p className="text-[var(--neutral-subtext)] font-medium text-base lg:text-lg">Ready for your next adventure?</p>
              </div>
            </div>
            {/* Streak badge */}
            <div className="flex flex-col items-center justify-center bg-[white] border-2 border-[var(--color-accent-yellow)] rounded-2xl p-3 shadow-sm rotate-3 hover:rotate-0 transition-transform cursor-default">
              <div className="flex items-center gap-1.5">
                <Fire weight="fill" className="w-6 h-6 text-[var(--sunset-coral)]" />
                <NumberCounter value={profile?.streak ?? 0} className="font-display font-black text-2xl text-slate-900" />
              </div>
              <span className="text-xs font-bold text-[var(--neutral-subtext)] uppercase tracking-wide">Day Streak</span>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          {/* School Rank Card */}
          {profile?.schoolId && school ? (
            <div className="bg-slate-900 border border-slate-200 shadow-md rounded-[24px] p-8 text-[white] relative overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[var(--color-accent-blue)]/30 -translate-y-1/2 translate-x-1/4 pointer-events-none blur-2xl" />
              <div className="relative z-10">
                <p className="text-[var(--color-accent-yellow)] text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Trophy weight="fill" className="w-5 h-5" />
                  {school.name} · National Quest Board
                </p>
                <div className="flex flex-wrap items-end gap-6 justify-between">
                  <div>
                    <div className="text-5xl lg:text-6xl font-display font-black text-[var(--color-accent-yellow)] tabular-nums leading-none">
                      #<NumberCounter value={school.rank} />
                    </div>
                    <div className="flex items-center gap-2 mt-4 bg-white/10 px-3 py-1.5 rounded-lg inline-flex">
                      {school.rankTrend > 0 ? (
                        <>
                          <TrendUp weight="bold" className="w-5 h-5 text-[var(--color-accent-green)]" />
                          <span className="text-sm text-[var(--color-accent-green)] font-bold">Up {school.rankTrend} this week</span>
                        </>
                      ) : school.rankTrend < 0 ? (
                        <>
                          <TrendDown weight="bold" className="w-5 h-5 text-red-500" />
                          <span className="text-sm text-red-500 font-bold">Down {Math.abs(school.rankTrend)} this week</span>
                        </>
                      ) : (
                        <>
                          <Minus weight="bold" className="w-5 h-5 text-[white]/60" />
                          <span className="text-sm text-[white]/60 font-bold">Holding steady</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-8 text-right bg-black/40 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                    <div>
                      <p className="text-[white]/60 text-xs font-bold uppercase tracking-wider mb-1">Avg. Score</p>
                      <NumberCounter value={Math.round(school.averageScore ?? 0)} suffix="%" className="font-display font-black text-2xl text-white" />
                    </div>
                    <div>
                      <p className="text-[white]/60 text-xs font-bold uppercase tracking-wider mb-1">Active Heroes</p>
                      <NumberCounter value={school.activeStudentCount} className="font-display font-black text-2xl text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 shadow-md rounded-[24px] p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-[var(--color-accent-yellow)]/20 rounded-full flex items-center justify-center mb-4">
                 <Trophy weight="fill" className="w-8 h-8 text-[var(--color-accent-yellow)]" />
              </div>
              <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">Join a School</h2>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">Connect to your school to unlock leaderboards, specific exams, and start earning points for your team!</p>
              <Link href="/dashboard/profile">
                <Button className="font-bold text-slate-900 bg-[var(--color-accent-yellow)] border border-slate-200 hover:brightness-95">Enter Invite Code</Button>
              </Link>
            </div>
          )}
        </FadeIn>

        <FadeIn delay={0.2}>
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <Card className="text-center py-2">
              <CardContent className="pt-6 pb-5">
                <p className="text-xs font-bold text-[var(--neutral-subtext)] uppercase tracking-wide mb-2">Quests Done</p>
                <p className="text-4xl font-display font-black text-slate-900 tabular-nums">
                  <NumberCounter value={completedCount} />
                  <span className="text-xl font-bold text-[var(--neutral-subtext)] opacity-60">/{totalChapters}</span>
                </p>
              </CardContent>
            </Card>
            <Card className="text-center py-2">
              <CardContent className="pt-6 pb-5">
                <p className="text-xs font-bold text-[var(--neutral-subtext)] uppercase tracking-wide mb-2">Grade Level</p>
                <p className="text-4xl font-display font-black text-slate-900">{profile?.grade ?? '—'}</p>
              </CardContent>
            </Card>
            <Card className="text-center py-2 hidden sm:block">
              <CardContent className="pt-6 pb-5">
                <p className="text-xs font-bold text-[var(--neutral-subtext)] uppercase tracking-wide mb-2">Difficulty</p>
                <p className="text-3xl font-display font-black text-[var(--sunset-coral)] capitalize">{profile?.difficultyTier ?? 'Beginner'}</p>
              </CardContent>
            </Card>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-10">
          <FadeIn delay={0.3} className="space-y-6">
            {/* Recommended next chapter */}
            {nextChapter && (
              <div>
                <h2 className="text-xl font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Robot weight="duotone" className="w-6 h-6 text-[var(--sunset-coral)]" />
                  Continue your journey
                </h2>
                <Link href={`/subjects/${nextChapter.subjectId}/chapters/${nextChapter.id}`}>
                  <Card hover className="bg-[var(--sunset-coral)] border-[var(--sunset-hover)] text-white">
                    <CardContent className="flex items-center gap-5 p-5">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                        <BookOpenText weight="fill" className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-lg text-white truncate mb-1">{nextChapter.title}</p>
                        <p className="text-sm font-semibold text-white/80">{nextChapter.estimatedMinutes} min read</p>
                      </div>
                      <CaretRight weight="bold" className="w-6 h-6 text-white shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              </div>
            )}
            {!nextChapter && (
              <div>
                <h2 className="text-xl font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Robot weight="duotone" className="w-6 h-6 text-[var(--color-accent-green)]" />
                  All Quests Complete!
                </h2>
                <Card className="bg-[var(--color-accent-green)] border-[#32855b] text-white">
                  <CardContent className="p-6 text-center">
                    <Trophy weight="fill" className="w-12 h-12 text-white mx-auto mb-3" />
                    <p className="font-bold text-lg">Amazing job! You have finished all available chapters.</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </FadeIn>

          <FadeIn delay={0.4} className="space-y-6">
            {/* Upcoming Tasks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[var(--color-primary)]" weight="duotone" />
                  Upcoming Tasks
                </h2>
              </div>
              <div className="space-y-4">
                {tasks.length > 0 ? tasks.slice(0, 3).map(task => (
                  <Card key={task.id} hover>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5 text-[var(--color-primary)]" weight="bold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">{task.title}</p>
                        <p className="text-xs text-slate-500 font-medium">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-[var(--color-primary)] font-bold">View</Button>
                    </CardContent>
                  </Card>
                )) : (
                  <p className="text-sm text-slate-500 font-medium py-4">No upcoming tasks.</p>
                )}
              </div>
            </div>

            {/* Upcoming Exams */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[var(--sunset-coral)]" weight="duotone" />
                  Upcoming Exams
                </h2>
              </div>
              <div className="space-y-4">
                {exams.length > 0 ? exams.slice(0, 3).map(exam => (
                  <Card key={exam.id} hover>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-[var(--sunset-coral)]" weight="bold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">{exam.title}</p>
                        <p className="text-xs text-slate-500 font-medium">{new Date(exam.startTime).toLocaleString()} · {exam.durationMinutes}m</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-[var(--sunset-coral)] font-bold">View</Button>
                    </CardContent>
                  </Card>
                )) : (
                  <p className="text-sm text-slate-500 font-medium py-4">No upcoming exams.</p>
                )}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.5} className="space-y-6">
            {/* Subject progress */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-bold text-slate-900">Your Worlds</h2>
                <Link href="/subjects" className="text-sm text-[var(--sunset-coral)] hover:text-[var(--sunset-hover)] font-bold">
                  View all →
                </Link>
              </div>

              <div className="space-y-4">
                {subjectProgress.map(sub => (
                  <Link key={sub.id} href={`/subjects/${sub.id}`}>
                    <Card hover>
                      <CardContent className="flex flex-col gap-3 p-5">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-lg text-slate-900">{sub.name}</p>
                          <p className="text-sm font-bold text-[var(--neutral-subtext)] tabular-nums shrink-0 ml-4">
                            {sub.done}/{sub.total}
                          </p>
                        </div>
                        <ProgressBar value={sub.done} max={sub.total} />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

      </div>
    </div>
  )
}
