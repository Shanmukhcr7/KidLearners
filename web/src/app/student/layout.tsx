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
      <div className="min-h-screen bg-[#F5F8FF] font-[var(--font-sans)] flex flex-col md:flex-row">
        {/* Sidebar - Comic Style (Desktop Only) */}
        <aside className="hidden md:flex w-64 bg-white border-r-[4px] border-[var(--color-navy)] flex-col z-10 sticky top-0 h-screen">
          <div className="p-6 border-b-[4px] border-[var(--color-navy)] bg-[var(--color-primary)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white comic-border rounded-xl flex items-center justify-center text-xl font-bold text-[var(--color-navy)]">
                K
              </div>
              <h1 className="text-2xl font-black tracking-tight text-[var(--color-navy)]">KidLearners</h1>
            </div>
          </div>

          <nav className="flex-1 p-6 space-y-4">
            <NavItem href="/student" icon={<LayoutDashboard />} label="My Hub" color="bg-[#E5F9E0]" />
            <NavItem href="/student/course" icon={<BookOpen />} label="Learning" color="bg-[#FFF3B0]" />
            <NavItem href="/student/leaderboard" icon={<Trophy />} label="Leaderboard" color="bg-[#FFE5EC]" />
            <NavItem href="/student/profile" icon={<User />} label="My Profile" color="bg-[#E0F4FF]" />
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
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto bg-[var(--color-background)]">
          <AnimatedSection className="max-w-6xl mx-auto h-full">
            {children}
          </AnimatedSection>
        </main>

        {/* Bottom Navigation Bar (Mobile Only) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-[4px] border-[var(--color-navy)] z-50 flex justify-around items-center px-2 py-3 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <MobileNavItem href="/student" icon={<LayoutDashboard size={24} />} label="Hub" color="bg-[#E5F9E0]" />
          <MobileNavItem href="/student/course" icon={<BookOpen size={24} />} label="Learn" color="bg-[#FFF3B0]" />
          <MobileNavItem href="/student/leaderboard" icon={<Trophy size={24} />} label="Ranks" color="bg-[#FFE5EC]" />
          <MobileNavItem href="/student/profile" icon={<User size={24} />} label="Profile" color="bg-[#E0F4FF]" />
        </nav>
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

function MobileNavItem({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string, color: string }) {
  return (
    <Link href={href} className={`flex flex-col items-center justify-center p-2 rounded-xl text-[var(--color-navy)] active:scale-95 transition-transform active:${color}`}>
      {icon}
      <span className="text-xs font-bold mt-1">{label}</span>
    </Link>
  );
}
