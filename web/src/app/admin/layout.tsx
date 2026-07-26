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

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <div className="min-h-screen bg-slate-50 flex font-sans">
        {/* Sidebar - Super Admin Dark Mode */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-10 sticky top-0 h-screen text-slate-300">
          <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
            <ShieldCheck size={24} className="text-blue-500 mr-3" />
            <h1 className="text-xl font-bold text-white tracking-tight">System Admin</h1>
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
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-500">Super Admin (KidLearners HQ)</span>
              <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-inner">
                HQ
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
        ? "bg-blue-600/10 text-blue-500" 
        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
