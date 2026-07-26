'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { School, User } from '@/lib/firebase/firestore'
import { Card, CardContent } from '@/components/ui/Card'
import { StudentNav } from '@/components/layout/StudentNav'
import { Trophy, Image as ImageIcon, Video, UserFocus } from 'lucide-react'
import { FadeIn } from '@/components/ui/Transitions'
import Link from 'next/link'

export default function SchoolHubPage() {
  const { profile, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [school, setSchool] = useState<School | null>(null)
  const [leaderboard, setLeaderboard] = useState<User[]>([])
  const [gallery, setGallery] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!profile) { router.push('/login'); return }
    if (!profile.schoolId) { setLoading(false); return }

    async function loadSchoolData() {
      try {
        // School Info
        const schoolSnap = await getDoc(doc(db, 'schools', profile!.schoolId!))
        if (schoolSnap.exists()) setSchool({ id: schoolSnap.id, ...schoolSnap.data() } as School)

        // Local Leaderboard
        const lbQ = query(collection(db, 'users'), where('schoolId', '==', profile!.schoolId), orderBy('streak', 'desc'), limit(10))
        const lbSnap = await getDocs(lbQ)
        setLeaderboard(lbSnap.docs.map(d => ({ id: d.id, ...d.data() }) as User))

        // School Gallery
        const gQ = query(collection(db, 'gallery'), where('schoolId', '==', profile!.schoolId), orderBy('createdAt', 'desc'), limit(6))
        const gSnap = await getDocs(gQ)
        setGallery(gSnap.docs.map(d => ({ id: d.id, ...d.data() })))

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadSchoolData()
  }, [authLoading, profile, router])

  if (loading || authLoading) return <div className="p-10 text-center">Loading School Hub...</div>

  if (!profile?.schoolId || !school) {
    return (
      <div className="min-h-screen bg-slate-50">
        <StudentNav />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <Card>
            <CardContent className="p-10">
              <UserFocus className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Not Enrolled</h1>
              <p className="text-slate-500 mb-6">You are not connected to a school. Join a school to access the School Hub.</p>
              <Link href="/dashboard/profile" className="text-[var(--color-primary)] font-bold">Go to Profile settings →</Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <StudentNav />
      
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        <FadeIn>
          <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-lg border border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[var(--color-primary)]/30 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-sm mb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  School Hub
                </p>
                <h1 className="text-4xl font-display font-black mb-2">{school.name}</h1>
                <p className="text-white/70 font-medium">Connect, compete, and view memories with your classmates.</p>
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-[1fr,300px] gap-8">
          <div className="space-y-8">
            <FadeIn delay={0.1}>
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-[var(--color-primary)]" />
                School Gallery
              </h2>
              {gallery.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {gallery.map(item => (
                    <div key={item.id} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 group shadow-sm border border-slate-200">
                      {item.imageUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i) ? (
                        <video src={item.imageUrl} className="w-full h-full object-cover" />
                      ) : (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p className="text-white font-bold text-sm truncate">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No photos or videos posted yet.</p>
                  </CardContent>
                </Card>
              )}
            </FadeIn>
          </div>

          <div className="space-y-8">
            <FadeIn delay={0.2}>
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-[var(--color-accent-yellow)]" />
                Leaderboard
              </h2>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {leaderboard.map((student, i) => (
                      <div key={student.id} className={`flex items-center gap-3 p-4 transition-colors ${student.id === profile.id ? 'bg-[var(--color-accent-yellow)]/10' : 'hover:bg-slate-50'}`}>
                        <div className={`w-6 text-center font-bold text-sm ${i === 0 ? 'text-[var(--color-accent-yellow)]' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-700' : 'text-slate-400'}`}>
                          #{i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-sm truncate ${student.id === profile.id ? 'text-slate-900' : 'text-slate-700'}`}>
                            {student.name} {student.id === profile.id && '(You)'}
                          </p>
                        </div>
                        <div className="text-xs font-bold text-[var(--color-primary)]">
                          {student.streak} <Fire className="w-3 h-3 inline -mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}

function Fire(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}><path d="M213.66,82.34l-56-56A8,8,0,0,0,144,32V72H96a8,8,0,0,0-5.66,2.34l-56,56a8,8,0,0,0,0,11.32l8,8A8,8,0,0,0,48,152v64a8,8,0,0,0,8,8H200a8,8,0,0,0,8-8V152a8,8,0,0,0,5.66-2.34l8-8A8,8,0,0,0,213.66,82.34ZM192,208H64V160H192Zm0-64H64L69.66,138.34,120,88h24V43.31l48,48Z"></path></svg>
}
