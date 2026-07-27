import RoleGuard from "@/components/auth/RoleGuard";
import { 
  BarChart, 
  Building2, 
  Users, 
  Settings, 
  ShieldCheck,
  LogOut,
  Mail
} from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
        {/* Sidebar - Super Admin Dark Mode (Desktop Only) */}
        <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-col z-10 sticky top-0 h-screen text-slate-300">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
            <img src="/loki.jpg" alt="KidLearners Logo" className="w-8 h-8 rounded-md object-cover" />
            <span className="font-bold text-lg tracking-tight text-white">KidLearners HQ</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            <NavItem href="/admin" icon={<BarChart size={20} />} label="Overview" active />
            <NavItem href="/admin/schools" icon={<Building2 size={20} />} label="Manage Schools" />
            <NavItem href="/admin/users" icon={<Users size={20} />} label="All Users" />
            <NavItem href="/admin/demo-requests" icon={<Mail size={20} />} label="Demo Requests" />
          </nav>

          <div className="px-4 py-4 border-t border-slate-800 space-y-1 bg-slate-950">
             <NavItem href="/admin/settings" icon={<Settings size={20} />} label="Platform Settings" />
             <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium hover:text-white hover:bg-slate-800 transition-colors text-left text-sm mt-2">
               <LogOut size={20} />
               <span>Sign Out</span>
             </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between md:justify-end px-4 md:px-8 sticky top-0 z-10 shadow-sm">
            <div className="md:hidden flex items-center">
               <ShieldCheck size={24} className="text-blue-600 mr-2" />
               <h1 className="text-lg font-bold text-slate-900 tracking-tight">SysAdmin</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:inline text-sm font-medium text-gray-500">Super Admin (KidLearners HQ)</span>
              <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-inner">
                HQ
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
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 flex justify-around items-center px-2 py-3 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
          <MobileNavItem href="/admin" icon={<BarChart size={24} />} label="Stats" />
          <MobileNavItem href="/admin/schools" icon={<Building2 size={24} />} label="Schools" />
          <MobileNavItem href="/admin/users" icon={<Users size={24} />} label="Users" />
          <MobileNavItem href="/admin/demo-requests" icon={<Mail size={24} />} label="Demos" />
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
        ? "bg-blue-600/10 text-blue-500" 
        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MobileNavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string, active?: boolean }) {
  return (
    <Link href={href} className={`flex flex-col items-center justify-center p-2 rounded-xl active:scale-95 transition-transform ${active ? "text-blue-500" : "text-slate-400"}`}>
      {icon}
      <span className="text-xs font-medium mt-1">{label}</span>
    </Link>
  );
}
