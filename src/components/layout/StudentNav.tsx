'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { SoundToggle } from '@/components/ui/SoundToggle'
import {
  House, BookOpenText, Trophy, User, SignOut, Robot, UsersThree
} from '@phosphor-icons/react/dist/ssr'

const NAV_ITEMS = [
  { label: 'Home',       href: '/dashboard',          icon: House },
  { label: 'School',     href: '/dashboard/school',   icon: UsersThree },
  { label: 'Library',    href: '/subjects',           icon: BookOpenText },
  { label: 'Rankings',   href: '/leaderboard',        icon: Trophy },
  { label: 'Profile',    href: '/dashboard/profile',  icon: User },
]

export function StudentNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { profile } = useAuth()
  
  const firstName = profile?.name?.split(' ')[0] ?? 'Student'

  async function handleSignOut() {
    await signOut(auth)
    document.cookie = '__session=; path=/; max-age=0'
    router.push('/login')
  }

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="hidden md:flex sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[var(--color-primary)] rounded-xl flex items-center justify-center">
            <Robot weight="fill" className="w-5 h-5 text-white" />
          </div>
          <img src="/images/logo.jpg" alt="KidLearners" className="h-10 w-auto mix-blend-multiply" />
        </div>
        
        <div className="flex items-center gap-2">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm',
                  isActive ? 'bg-slate-100 text-[var(--color-primary)]' : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <Icon weight={isActive ? "fill" : "regular"} className="w-5 h-5" />
                {label}
              </Link>
            )
          })}
          
          <div className="w-px h-6 bg-slate-200 mx-2" />
          <SoundToggle />
          
          <button 
            onClick={handleSignOut} 
            className="text-slate-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 ml-1"
            title="Sign Out"
          >
            <SignOut weight="bold" className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Top Header (Just Logo & Sign out) */}
      <nav className="md:hidden sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
            <Robot weight="fill" className="w-4 h-4 text-white" />
          </div>
          <img src="/images/logo.jpg" alt="KidLearners" className="h-8 w-auto mix-blend-multiply" />
        </div>
        <div className="flex items-center gap-2">
          <SoundToggle />
          <button onClick={handleSignOut} className="p-2 text-slate-500 hover:text-red-600">
            <SignOut weight="bold" className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-[env(safe-area-inset-bottom)] z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center justify-center w-full h-full gap-1',
                  isActive ? 'text-[var(--color-primary)]' : 'text-slate-500 hover:text-slate-900'
                )}
              >
                <Icon weight={isActive ? "fill" : "regular"} className="w-6 h-6" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
