"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { 
  BarChart, Users, BookOpen, FileText, HelpCircle, 
  Settings, LogOut, GraduationCap, Trophy, 
  Calendar, Bell, MessageSquare, Megaphone, 
  Building2, Activity, Award, ClipboardList, Menu, X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { auth } from "@/utils/firebase";
import { useState } from "react";

export default function SchoolAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <RoleGuard allowedRoles={["school_admin"]}>
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans relative">
        
        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
            onClick={closeMobileMenu}
          ></div>
        )}

        {/* Sidebar - School Admin */}
        <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-indigo-950 border-r border-indigo-900 flex-col z-50 text-slate-300 transition-transform duration-300 ease-in-out md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0 flex' : '-translate-x-full hidden md:flex'}`}>
          <div className="h-16 flex items-center justify-between px-6 border-b border-indigo-900 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">
                <GraduationCap size={20} />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">School Portal</span>
            </div>
            <button className="md:hidden text-slate-400 hover:text-white" onClick={closeMobileMenu}>
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
            <nav className="px-4 py-6 space-y-8">
              
              <div>
                <NavItem href="/school-admin" icon={<BarChart size={18} />} label="Dashboard" active={pathname === "/school-admin"} onClick={closeMobileMenu} />
              </div>

              <div>
                <NavGroup title="👨🎓 Students">
                  <NavItem href="/school-admin/students" label="Student List" active={pathname === "/school-admin/students"} onClick={closeMobileMenu} />
                  <NavItem href="/school-admin/students/add" label="Add Students" active={pathname === "/school-admin/students/add"} onClick={closeMobileMenu} />
                  <NavItem href="/school-admin/classes" label="Classes & Sections" active={pathname === "/school-admin/classes"} onClick={closeMobileMenu} />
                </NavGroup>
              </div>

              <div>
                <NavGroup title="📚 Learning">
                  <NavItem href="/school-admin/courses" label="Courses" active={pathname === "/school-admin/courses"} onClick={closeMobileMenu} />
                  <NavItem href="/school-admin/curriculum" label="Curriculum Progress" active={pathname === "/school-admin/curriculum"} onClick={closeMobileMenu} />
                  <NavItem href="/school-admin/library" label="Resource Library" active={pathname === "/school-admin/library"} onClick={closeMobileMenu} />
                </NavGroup>
              </div>

              <div className="space-y-1">
                <NavItem href="/school-admin/tasks" icon={<ClipboardList size={18} />} label="Tasks" active={pathname === "/school-admin/tasks"} onClick={closeMobileMenu} />
                <NavItem href="/school-admin/exams" icon={<FileText size={18} />} label="Exams" active={pathname === "/school-admin/exams"} onClick={closeMobileMenu} />
                <NavItem href="/school-admin/question-bank" icon={<HelpCircle size={18} />} label="Question Bank" active={pathname === "/school-admin/question-bank"} onClick={closeMobileMenu} />
              </div>

              <div>
                <NavGroup title="📊 Progress & Analytics">
                  <NavItem href="/school-admin/analytics" label="Analytics" active={pathname === "/school-admin/analytics"} onClick={closeMobileMenu} />
                  <NavItem href="/school-admin/reports" label="Reports" active={pathname === "/school-admin/reports"} onClick={closeMobileMenu} />
                </NavGroup>
              </div>

              <div>
                <NavGroup title="🏆 Engagement">
                  <NavItem href="/school-admin/leaderboards" label="Leaderboards" active={pathname === "/school-admin/leaderboards"} onClick={closeMobileMenu} />
                  <NavItem href="/school-admin/achievements" label="Achievements" active={pathname === "/school-admin/achievements"} onClick={closeMobileMenu} />
                  <NavItem href="/school-admin/certificates" label="Certificates" active={pathname === "/school-admin/certificates"} onClick={closeMobileMenu} />
                </NavGroup>
              </div>

              <div className="space-y-1">
                <NavItem href="/school-admin/calendar" icon={<Calendar size={18} />} label="Calendar" active={pathname === "/school-admin/calendar"} onClick={closeMobileMenu} />
                <NavItem href="/school-admin/events" icon={<Award size={18} />} label="Events" active={pathname === "/school-admin/events"} onClick={closeMobileMenu} />
              </div>

              <div>
                <NavGroup title="📢 Communication">
                  <NavItem href="/school-admin/announcements" label="Announcements" active={pathname === "/school-admin/announcements"} onClick={closeMobileMenu} />
                  <NavItem href="/school-admin/notifications" label="Notifications" active={pathname === "/school-admin/notifications"} onClick={closeMobileMenu} />
                  <NavItem href="/school-admin/messages" label="Messages" active={pathname === "/school-admin/messages"} onClick={closeMobileMenu} />
                </NavGroup>
              </div>

              <div className="space-y-1 border-t border-indigo-900 pt-6">
                <NavItem href="/school-admin/profile" icon={<Building2 size={18} />} label="School Profile" active={pathname === "/school-admin/profile"} onClick={closeMobileMenu} />
                <NavItem href="/school-admin/settings" icon={<Settings size={18} />} label="Settings" active={pathname === "/school-admin/settings"} onClick={closeMobileMenu} />
                <NavItem href="/school-admin/support" icon={<HelpCircle size={18} />} label="Help & Support" active={pathname === "/school-admin/support"} onClick={closeMobileMenu} />
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
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shadow-sm shrink-0">
            <div className="flex items-center gap-3 md:hidden">
              <button onClick={() => setMobileMenuOpen(true)} className="text-slate-600 hover:text-indigo-600 p-1">
                <Menu size={24} />
              </button>
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">
                <GraduationCap size={16} />
              </div>
            </div>
            
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-sm font-medium text-gray-500">School Admin</span>
              <div className="h-8 w-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-inner">
                SA
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 bg-slate-50">
            <AnimatedSection className="max-w-7xl mx-auto h-full">
              {children}
            </AnimatedSection>
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}

function NavGroup({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div>
      <div className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-indigo-400">{title}</div>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

function NavItem({ href, icon, label, active = false, onClick }: { href: string; icon?: React.ReactNode; label: string, active?: boolean, onClick?: () => void }) {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
        active 
        ? "bg-indigo-600/20 text-indigo-300" 
        : "text-indigo-200 hover:bg-indigo-900 hover:text-white"
      }`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className={icon ? "" : "pl-6"}>{label}</span>
    </Link>
  );
}
