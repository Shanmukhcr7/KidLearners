import RoleGuard from "@/components/auth/RoleGuard";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut,
  Bell,
  Search
} from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export default function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["school_admin", "super_admin"]}>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
        {/* Sidebar - Professional Style (Desktop Only) */}
        <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col z-10 sticky top-0 h-screen">
          <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-200">
            <img src="/loki.jpg" alt="KidLearners Logo" className="w-8 h-8 rounded-md object-cover shadow-sm" />
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">School Portal</h1>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            <NavItem href="/school" icon={<LayoutDashboard size={20} />} label="Overview" active />
            <NavItem href="/school/students" icon={<Users size={20} />} label="Students" />
            <NavItem href="/school/courses" icon={<BookOpen size={20} />} label="Curriculum" />
          </nav>

          <div className="px-4 py-4 border-t border-gray-200 space-y-1">
             <NavItem href="/school/settings" icon={<Settings size={20} />} label="Settings" />
             <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors text-left text-sm">
               <LogOut size={20} />
               <span>Sign Out</span>
             </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shadow-sm md:shadow-none">
            <div className="flex items-center text-gray-400 focus-within:text-gray-600">
              <Search size={20} className="absolute ml-3" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-md focus:bg-white focus:border-gray-300 focus:ring-0 text-sm w-48 md:w-96 transition-all"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-500 hover:text-gray-700 relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="h-8 w-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
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

        {/* Bottom Navigation Bar (Mobile Only) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex justify-around items-center px-2 py-3 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <MobileNavItem href="/school" icon={<LayoutDashboard size={24} />} label="Overview" />
          <MobileNavItem href="/school/students" icon={<Users size={24} />} label="Students" />
          <MobileNavItem href="/school/courses" icon={<BookOpen size={24} />} label="Courses" />
          <MobileNavItem href="/school/settings" icon={<Settings size={24} />} label="Settings" />
        </nav>
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
        ? "bg-indigo-50 text-indigo-700" 
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MobileNavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string, active?: boolean }) {
  return (
    <Link href={href} className={`flex flex-col items-center justify-center p-2 rounded-xl active:scale-95 transition-transform ${active ? "text-indigo-600" : "text-gray-500"}`}>
      {icon}
      <span className="text-xs font-medium mt-1">{label}</span>
    </Link>
  );
}
