'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { auth } from '@/lib/firebase/client'
import { signInWithCustomToken } from 'firebase/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { GoogleLogo, UserFocus } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { FadeIn } from '@/components/ui/Transitions'
import { Preloader } from '@/components/ui/Preloader'

export default function LoginPage() {
  const router = useRouter()
  const { loginWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState('')
  const [loginMethod, setLoginMethod] = useState<'google' | 'student'>('google')
  
  // Student Login State
  const [studentCode, setStudentCode] = useState('')
  const [password, setPassword] = useState('')

  const handleGoogleLogin = async () => {
    setGlobalError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      router.push('/dashboard')
    } catch (err: any) {
      setGlobalError(err.message || 'Failed to sign in with Google.')
    } finally {
      setLoading(false)
    }
  }

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError('')
    setLoading(true)
    
    try {
      const res = await fetch('/api/auth/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentCode, password })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }
      
      await signInWithCustomToken(auth, data.token)
      router.push('/dashboard')
    } catch (err: any) {
      setGlobalError(err.message || 'Invalid Student Code or Password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900">
      <Preloader />

      {/* Minimal Header */}
      <div className="absolute top-8 left-8">
        <Link href="/">
          <img src="/images/logo.jpg" alt="KidLearners" className="h-12 w-auto mix-blend-multiply" />
        </Link>
      </div>

      <FadeIn className="w-full max-w-md">
        <div className="bg-white border border-slate-200 shadow-md rounded-[16px] p-10 md:p-14">
          
          <div className="mb-10 text-center md:text-left">
            <h1 className="font-display text-4xl text-slate-900 mb-2">
              Welcome
            </h1>
            <p className="text-slate-500 text-base font-sans">
              Sign in or create an account to start learning.
            </p>
          </div>

          <div className="space-y-6">
            {globalError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm font-medium rounded-lg">
                {globalError}
              </div>
            )}

            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${loginMethod === 'google' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                onClick={() => setLoginMethod('google')}
              >
                Parents / Teachers
              </button>
              <button
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${loginMethod === 'student' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                onClick={() => setLoginMethod('student')}
              >
                Students
              </button>
            </div>

            {loginMethod === 'google' ? (
              <Button
                onClick={handleGoogleLogin}
                className="w-full h-14 text-lg font-bold bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-3"
                loading={loading}
              >
                {!loading && <GoogleLogo className="w-6 h-6" weight="bold" />}
                Sign in with Google
              </Button>
            ) : (
              <form onSubmit={handleStudentLogin} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Student Code</label>
                  <Input 
                    required 
                    placeholder="e.g. STU-JO0001" 
                    value={studentCode}
                    onChange={e => setStudentCode(e.target.value.toUpperCase())}
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                  <Input 
                    required 
                    type="password" 
                    placeholder="Enter temp password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-bold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] rounded-xl shadow-sm transition-all flex items-center justify-center gap-3 mt-6"
                  loading={loading}
                >
                  {!loading && <UserFocus className="w-6 h-6" weight="bold" />}
                  Login to Portal
                </Button>
              </form>
            )}
          </div>

          <div className="mt-10 pt-8 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500">
              By signing in, you agree to our{' '}
              <Link href="#" className="text-slate-900 font-bold hover:text-[var(--color-accent-blue)] transition-colors underline underline-offset-4">
                Terms
              </Link>
              {' '}and{' '}
              <Link href="#" className="text-slate-900 font-bold hover:text-[var(--color-accent-blue)] transition-colors underline underline-offset-4">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>
      </FadeIn>
    </main>
  )
}
