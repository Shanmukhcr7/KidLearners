import RoleGuard from "@/components/auth/RoleGuard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { BookOpen, Trophy, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["student", "user"]}>
      <div className="min-h-screen bg-[#F5F8FF] font-[var(--font-sans)] flex">
        {/* Sidebar - Comic Style */}
        <aside className="w-64 bg-white border-r-[4px] border-[var(--color-navy)] flex flex-col z-10 sticky top-0 h-screen">
          <div className="p-6 border-b-[4px] border-[var(--color-navy)] bg-[var(--color-primary)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white comic-border rounded-xl flex items-center justify-center text-xl font-bold text-[var(--color-navy)]">
                K
              </div>
              <h1 className="text-2xl font-black tracking-tight text-[var(--color-navy)]">KidLearners</h1>
            </div>
          </div>

          <nav className="flex-1 p-6 space-y-4">
            <NavItem href="/dashboard" icon={<LayoutDashboard />} label="My Hub" color="bg-[#E5F9E0]" />
            <NavItem href="/dashboard/course" icon={<BookOpen />} label="Learning" color="bg-[#FFF3B0]" />
            <NavItem href="/dashboard/leaderboard" icon={<Trophy />} label="Leaderboard" color="bg-[#FFE5EC]" />
            <NavItem href="/dashboard/profile" icon={<User />} label="My Profile" color="bg-[#E0F4FF]" />
          </nav>

          <div className="p-6 border-t-[4px] border-[var(--color-navy)] space-y-4">
            <NavItem href="/settings" icon={<Settings />} label="Settings" color="bg-gray-100" />
            <button className="w-full flex items-center gap-3 p-3 rounded-xl font-bold text-red-600 hover:bg-red-50 border-[3px] border-transparent hover:border-red-600 transition-all text-left">
              <LogOut size={24} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto bg-[var(--color-background)]">
          <AnimatedSection className="max-w-6xl mx-auto">
            {children}
          </AnimatedSection>
        </main>
      </div>
    </RoleGuard>
  );
}

function NavItem({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string, color: string }) {
  return (
    <Link href={href} className={`flex items-center gap-3 p-3 rounded-xl font-bold text-[var(--color-navy)] hover:translate-x-2 transition-transform border-[3px] border-transparent hover:border-[var(--color-navy)] hover:${color}`}>
      {icon}
      <span className="text-lg">{label}</span>
    </Link>
  );
}
