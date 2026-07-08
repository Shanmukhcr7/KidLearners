'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, LayoutDashboard, BookOpen, Users, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signout } from '@/app/auth/actions'

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname()

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
    // Show students only if teacher
    ...(role === 'teacher' ? [{ name: 'Students', href: '/dashboard/students', icon: Users }] : []),
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col text-slate-300">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group mb-8">
          <div className="bg-primary-blue rounded-xl p-1.5 text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold font-heading tracking-tight text-white">
            KidLearners
          </span>
        </Link>

        <div className="mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {role} Panel
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors",
                  isActive ? "bg-primary-blue text-white" : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <form action={signout}>
          <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}
