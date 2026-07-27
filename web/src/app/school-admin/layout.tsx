"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { 
  BarChart, 
  Users, 
  Settings, 
  LogOut,
  GraduationCap,
  Trophy,
  BookOpen
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { auth } from "@/utils/firebase";

export default function SchoolAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <RoleGuard allowedRoles={["school_admin"]}>
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
        {/* Sidebar - School Admin */}
        <aside className="hidden md:flex w-64 bg-indigo-950 border-r border-indigo-900 flex-col z-10 sticky top-0 h-screen text-slate-300">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-indigo-900">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">
              <GraduationCap size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">School Portal</span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <nav className="px-4 py-6 space-y-6">
              
              {/* Dashboard */}
              <div>
                <NavItem href="/school-admin" icon={<BarChart size={18} />} label="Overview" active={pathname === "/school-admin"} />
              </div>

              {/* Students */}
              <div>
                <div className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-indigo-400">My School</div>
                <div className="space-y-1">
                  <NavItem href="/school-admin/students" icon={<Users size={18} />} label="Students" active={pathname === "/school-admin/students"} />
                  <NavItem href="/school-admin/teachers" icon={<Users size={18} />} label="Teachers" active={pathname === "/school-admin/teachers"} />
                </div>
              </div>

              {/* Learning & Curriculum */}
              <div>
                <div className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-indigo-400">Curriculum</div>
                <div className="space-y-1">
                  <NavItem href="/school-admin/courses" icon={<BookOpen size={18} />} label="Assigned Courses" active={pathname === "/school-admin/courses"} />
                  <NavItem href="/school-admin/tasks" icon={<BookOpen size={18} />} label="Tasks & Exams" active={pathname === "/school-admin/tasks"} />
                </div>
              </div>

              {/* Engagement */}
              <div>
                <div className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-indigo-400">Engagement</div>
                <div className="space-y-1">
                  <NavItem href="/school-admin/leaderboards" icon={<Trophy size={18} />} label="Leaderboard" active={pathname === "/school-admin/leaderboards"} />
                </div>
              </div>

              {/* Settings */}
              <div>
                <div className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-indigo-400">Configuration</div>
                <div className="space-y-1">
                  <NavItem href="/school-admin/settings" icon={<Settings size={18} />} label="Settings" active={pathname === "/school-admin/settings"} />
                </div>
              </div>
            </nav>
          </div>

          <div className="px-4 py-4 border-t border-indigo-900 bg-indigo-950 shrink-0">
             <button onClick={() => auth.signOut()} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium hover:text-white hover:bg-indigo-900 transition-colors text-left text-sm">
               <LogOut size={20} />
               <span>Sign Out</span>
             </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between md:justify-end px-4 md:px-8 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-500">School Admin</span>
              <div className="h-8 w-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-inner">
                SA
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
            <AnimatedSection className="max-w-6xl mx-auto h-full">
              {children}
            </AnimatedSection>
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string, active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
        active 
        ? "bg-indigo-600/20 text-indigo-300" 
        : "text-indigo-200 hover:bg-indigo-900 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
