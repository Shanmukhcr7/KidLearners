import { AnimatedCard } from "@/components/ui/AnimatedSection";
import { PlayCircle, Trophy, Terminal, Code2, Cpu } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-12">
      
      <div className="bg-[var(--color-navy)] comic-border rounded-2xl p-8 flex justify-between items-center relative overflow-hidden">
        <div className="z-10 text-white">
          <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight text-white">Welcome back!</h1>
          <p className="text-xl font-bold text-gray-300">Ready to start learning?</p>
        </div>
        <div className="text-[var(--color-secondary)] hidden md:block z-10 animate-pulse">
          <Terminal size={100} strokeWidth={1.5} />
        </div>
        {/* Decorative background shapes */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white opacity-5 rounded-full comic-border border-white"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Learning Area */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-2">
            🚀 Today's Mission
          </h2>
          
          <AnimatedCard className="comic-card bg-[#E5F9E0] p-8 flex flex-col md:flex-row gap-8 items-center border-[4px]">
            <div className="w-32 h-32 bg-white rounded-full comic-border flex items-center justify-center flex-shrink-0 text-[var(--color-secondary)]">
              <Cpu size={60} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-3xl font-black mb-3 text-[var(--color-navy)]">No Active Modules</h3>
              <p className="text-lg font-bold text-gray-700 mb-6">Your teacher hasn't assigned any modules yet.</p>
            </div>
          </AnimatedCard>

          <h2 className="text-3xl font-black tracking-tight flex items-center gap-2 pt-4">
            📚 Up Next
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 text-gray-500 font-bold">No upcoming modules.</div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <h2 className="text-3xl font-black tracking-tight">📈 Stats</h2>
          
          <AnimatedCard delay={0.1} className="comic-card bg-white p-6 border-[4px]">
            <div className="flex items-center justify-between mb-6">
              <span className="font-black text-xl">My XP Points</span>
              <span className="bg-[var(--color-navy)] text-white px-3 py-1 rounded-full font-black text-lg comic-border border-[2px]">
                0
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-6 comic-border border-[2px] overflow-hidden">
              <div className="bg-[var(--color-primary)] h-full rounded-r-full border-r-[2px] border-[var(--color-navy)]" style={{ width: "0%" }}></div>
            </div>
            <p className="text-center font-bold text-gray-500 mt-3 text-sm">Level 1 (100 XP to Next Level)</p>
          </AnimatedCard>

          <AnimatedCard delay={0.2} className="comic-card bg-[#F9F9F9] p-6 border-[4px]">
            <h3 className="font-black text-xl mb-4 flex items-center gap-2">
              <Trophy className="text-[var(--color-primary)]" strokeWidth={2} /> Latest Achievements
            </h3>
            <div className="text-center font-bold text-gray-500 py-4">No achievements yet.</div>
          </AnimatedCard>
        </div>

      </div>
    </div>
  );
}
