'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { doc, updateDoc, collection, query, where, getDocs, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FadeIn } from '@/components/ui/Transitions'
import Link from 'next/link'
import { ArrowLeft, UserCircle, Buildings } from '@phosphor-icons/react/dist/ssr'

export default function ProfilePage() {
  const { profile, user, logout } = useAuth()
  const router = useRouter()

  const [name, setName] = useState(profile?.name || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '')
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setLoading(true)
    setMessage('')
    setError('')
    try {
      await updateDoc(doc(db, 'users', profile.id), {
        name,
        avatarUrl,
      })
      setMessage('Profile updated successfully!')
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinSchool = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    if (!inviteCode) return
    
    setLoading(true)
    setMessage('')
    setError('')
    
    try {
      // Find school by invite code (schoolCode)
      const q = query(collection(db, 'schools'), where('schoolCode', '==', inviteCode.toUpperCase()))
      const snap = await getDocs(q)
      
      if (snap.empty) {
        throw new Error('Invalid Invite Code. School not found.')
      }
      
      const schoolId = snap.docs[0].id
      
      // Update user role to student and assign schoolId
      await updateDoc(doc(db, 'users', profile.id), {
        role: 'student',
        schoolId: schoolId,
        // initialize some student fields
        difficultyTier: 'beginner',
        streak: 0,
        xp: 0
      })
      
      setMessage('Successfully joined school! Reloading dashboard...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to join school.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await logout()
    router.push('/login')
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-900 font-sans">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 font-bold transition-colors">
          <ArrowLeft weight="bold" /> Back to Dashboard
        </Link>
        
        <FadeIn>
          <h1 className="font-display text-4xl font-black mb-8">Profile Settings</h1>
          
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl font-bold">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl font-bold">
              {error}
            </div>
          )}

          <div className="bg-white border border-slate-200 shadow-md rounded-2xl p-8 mb-8">
            <h2 className="flex items-center gap-3 font-display text-2xl font-bold mb-6">
              <UserCircle className="w-8 h-8 text-[var(--color-accent-blue)]" weight="fill" />
              Your Details
            </h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your Name"
                  className="h-14 bg-slate-50 text-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Avatar URL (Optional)</label>
                <Input
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="h-14 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                <Input
                  value={user?.email || ''}
                  disabled
                  className="h-14 bg-slate-100 text-slate-400 cursor-not-allowed"
                />
              </div>

              <Button type="submit" loading={loading} className="h-12 px-8 font-bold text-white bg-slate-900 border border-slate-200 rounded-xl shadow-sm hover:bg-slate-800 active:translate-y-1 active:shadow-none transition-all">
                Save Profile
              </Button>
            </form>
          </div>

          <div className="bg-white border border-slate-200 shadow-md rounded-2xl p-8 mb-8">
            <h2 className="flex items-center gap-3 font-display text-2xl font-bold mb-6">
              <Buildings className="w-8 h-8 text-[var(--color-accent-yellow)]" weight="fill" />
              School Membership
            </h2>
            
            {profile.schoolId ? (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="font-bold text-slate-700">You are enrolled in a school.</p>
                <p className="text-sm text-slate-500 mt-1">School ID: {profile.schoolId}</p>
                <p className="text-sm text-[var(--color-accent-green)] font-bold mt-4">You have access to the School Portal!</p>
              </div>
            ) : (
              <form onSubmit={handleJoinSchool} className="space-y-6">
                <p className="text-slate-500">
                  Are you a student? Enter the Invite Code provided by your teacher to join your school and unlock exams and leaderboards.
                </p>
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Invite Code</label>
                  <Input
                    value={inviteCode}
                    onChange={e => setInviteCode(e.target.value)}
                    placeholder="e.g. KL-HYD042"
                    className="h-14 bg-slate-50 text-lg uppercase"
                    autoCapitalize="characters"
                  />
                </div>
                <Button type="submit" loading={loading} className="h-12 px-8 font-bold text-slate-900 bg-[var(--color-accent-yellow)] border border-slate-200 rounded-xl shadow-sm hover:brightness-95 active:translate-y-1 active:shadow-none transition-all">
                  Join School
                </Button>
              </form>
            )}
          </div>

          <div className="flex justify-end mt-12">
             <Button variant="outline" onClick={handleSignOut} className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 border border-slate-200 shadow-sm rounded-xl">
               Sign Out
             </Button>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
