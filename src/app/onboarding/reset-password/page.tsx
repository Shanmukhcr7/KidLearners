'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BookOpen, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const router   = useRouter()
  const [pw,     setPw]     = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (pw.length < 8) { toast.error('Password must be at least 8 characters'); return }
    if (pw !== confirm) { toast.error('Passwords do not match'); return }

    setLoading(true)
    try {
      const idToken = await auth.currentUser?.getIdToken()
      const res     = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
        body:    JSON.stringify({ newPassword: pw }),
      })
      if (!res.ok) { toast.error('Could not update password'); setLoading(false); return }
      toast.success('Password updated!')
      router.push('/onboarding')
    } catch {
      toast.error('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <img src="/images/logo.jpg" alt="KidLearners" className="h-10 w-auto mix-blend-multiply" />
        </div>

        <div className="bg-[var(--color-accent-yellow)]/8 border border-[#E0A526]/20 rounded-[8px] p-4 mb-6">
          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-[#B9821A] mt-0.5 shrink-0" />
            <p className="text-sm text-slate-900">
              Your school issued you a temporary password. Please set a new one before continuing.
            </p>
          </div>
        </div>

        <h2 className="font-sora text-2xl font-bold text-slate-900 mb-6">Set your password</h2>

        <form onSubmit={handleReset} className="space-y-4">
          <Input
            id="new-password"
            label="New password"
            type="password"
            placeholder="At least 8 characters"
            value={pw}
            onChange={e => setPw(e.target.value)}
            autoComplete="new-password"
          />
          <Input
            id="confirm-password"
            label="Confirm password"
            type="password"
            placeholder="Type it again"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
          <Button type="submit" className="w-full mt-2" size="lg" loading={loading}>
            Set password & continue
          </Button>
        </form>
      </div>
    </div>
  )
}
