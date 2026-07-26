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

export default function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["school_admin", "super_admin"]}>
      <div className="min-h-screen bg-gray-50 flex font-sans">
        {/* Sidebar - Professional Style */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-10 sticky top-0 h-screen">
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <div className="w-8 h-8 bg-[var(--color-navy)] rounded-md flex items-center justify-center text-white font-bold mr-3">
              K
            </div>
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
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center text-gray-400 focus-within:text-gray-600">
              <Search size={20} className="absolute ml-3" />
              <input 
                type="text" 
                placeholder="Search students, courses..." 
                className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-md focus:bg-white focus:border-gray-300 focus:ring-0 text-sm w-64 md:w-96 transition-all"
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
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
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
        ? "bg-indigo-50 text-indigo-700" 
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
