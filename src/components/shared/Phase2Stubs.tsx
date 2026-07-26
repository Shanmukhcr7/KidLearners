import { BookOpen, MessageSquare, Trophy, BarChart2, ScrollText } from 'lucide-react'

function ComingSoon({ title, desc, Icon }: { title: string; desc: string; Icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-5">
        <Icon className="w-7 h-7 text-slate-500" />
      </div>
      <h2 className="font-sora font-bold text-xl text-slate-900 mb-2">{title}</h2>
      <p className="text-sm text-slate-500 max-w-xs">{desc}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 bg-[var(--color-accent-yellow)]/10 text-[#B9821A] border border-[#E0A526]/20 rounded-full px-3 py-1 text-xs font-medium">
        Coming in Phase 2
      </span>
    </div>
  )
}

export function AiTutorStub() {
  return <ComingSoon title="AI Chat Tutor" desc="Ask questions about AI topics, get explanations, and have your session summarized — coming soon." Icon={MessageSquare} />
}

export function ProjectsStub() {
  return <ComingSoon title="Mini Projects" desc="Guided hands-on AI builds with step-by-step walkthroughs and completion badges — coming soon." Icon={BookOpen} />
}

export function CertificatesStub() {
  return <ComingSoon title="Certificates" desc="Earn verifiable completion certificates for each subject — coming soon." Icon={Trophy} />
}

export function AdminAnalyticsStub() {
  return <ComingSoon title="Analytics" desc="Chapter completion rates, score distributions, active user trends — coming soon." Icon={BarChart2} />
}

export function AdminModerationStub() {
  return <ComingSoon title="Moderation Queue" desc="Flagged AI tutor messages routed here for human review — coming soon." Icon={MessageSquare} />
}

export function AdminAuditLogStub() {
  return <ComingSoon title="Audit Log" desc="Every admin action, timestamped and attributed — coming soon." Icon={ScrollText} />
}
