import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { signup } from '@/app/auth/actions'

export default function RegisterPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-blue/20 rounded-full blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary-green/20 rounded-full blur-[100px] z-0 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary-blue rounded-xl p-1.5 text-white shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-heading tracking-tight text-slate-900 dark:text-white">
                KidLearners
              </span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2">Create an Account</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Join the future of education today</p>
          </div>

          <form className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            
            <p className="text-xs text-slate-500 text-center">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>

            {searchParams?.message && (
              <p className="text-sm text-red-500 text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                {searchParams.message}
              </p>
            )}

            <Button formAction={signup} variant="primary" className="w-full mt-2 h-11">
              Sign Up
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-6">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary-blue hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
