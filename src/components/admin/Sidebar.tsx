'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import {
  School, Users, BookOpen, FileText, Folder, Trophy,
  MessageSquare, BarChart2, ScrollText, Settings, LogOut,
  Menu, X
} from 'lucide-react'

interface NavItem {
  label:    string
  href:     string
  icon:     React.ComponentType<{ className?: string }>
  roles:    ('admin' | 'superadmin')[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview',          href: '/admin',                  icon: BarChart2,     roles: ['admin','superadmin'] },
  { label: 'Schools',           href: '/admin/schools',          icon: School,        roles: ['superadmin'] },
  { label: 'Users',             href: '/admin/users',            icon: Users,         roles: ['superadmin'] },
  { label: 'Students',          href: '/admin/students',         icon: Users,         roles: ['admin','superadmin'] },
  { label: 'Curriculum',        href: '/admin/curriculum',       icon: BookOpen,      roles: ['superadmin'] },
  { label: 'Workshops',         href: '/admin/workshops',        icon: MessageSquare, roles: ['superadmin'] },
  { label: 'Blogs',             href: '/admin/blogs',            icon: FileText,      roles: ['superadmin'] },
  { label: 'Media',             href: '/admin/media',            icon: Folder,        roles: ['superadmin'] },
  { label: 'Tasks',             href: '/admin/tasks',            icon: ScrollText,    roles: ['admin','superadmin'] },
  { label: 'Exams',             href: '/admin/exams',            icon: FileText,      roles: ['admin','superadmin'] },
  { label: 'Leaderboard',       href: '/admin/leaderboard',      icon: Trophy,        roles: ['admin','superadmin'] },
  { label: 'Settings',          href: '/admin/settings',         icon: Settings,      roles: ['superadmin'] },
]

export function AdminSidebar() {
  const pathname        = usePathname()
  const router          = useRouter()
  const { role, profile } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [mobileOpen])

  const visibleItems = NAV_ITEMS.filter(item =>
    role && item.roles.includes(role as 'admin' | 'superadmin')
  )

  async function handleSignOut() {
    await signOut(auth)
    document.cookie = '__session=; path=/; max-age=0'
    router.push('/login/admin')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white/70 backdrop-blur-xl border-r border-slate-200/60 shadow-[4px_0_24px_rgb(0,0,0,0.02)]">
      {/* Branding */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100 shrink-0">
        <Link href="/admin" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.jpg" alt="KidLearners" className="h-9 w-auto mix-blend-multiply drop-shadow-sm" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Portal</span>
            <span className="text-sm font-bold text-slate-700 leading-none">
              {role === 'superadmin' ? 'Super Admin' : 'School Admin'}
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
        {visibleItems.map(({ label, href, icon: Icon }) => {
          const isActive = href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-bold transition-all duration-300',
                isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 translate-x-1'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer (Profile & Logout) */}
      <div className="p-4 border-t border-slate-100 shrink-0 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-800 to-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-md ring-2 ring-white/50" title={profile?.name ?? 'Admin'}>
            {profile?.name?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-slate-900 truncate">{profile?.name ?? 'Admin'}</span>
            <span className="text-xs font-medium text-slate-500 truncate">{profile?.email ?? 'admin@kidlearners.com'}</span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" strokeWidth={2.5} />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Header (Fixed Top) */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200 z-40 flex items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.jpg" alt="KidLearners" className="h-8 w-auto mix-blend-multiply" />
          <span className="text-sm font-bold text-slate-700">Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="relative w-[280px] max-w-[calc(100vw-3rem)] h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}
