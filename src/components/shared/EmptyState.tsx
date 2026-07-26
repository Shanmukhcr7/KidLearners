import { cn } from '@/lib/utils'
import { BookOpen, Search, Trophy, Inbox, FileText } from 'lucide-react'
import Image from 'next/image'

type EmptyVariant = 'chapters' | 'students' | 'schools' | 'subjects' | 'quizzes' | 'leaderboard' | 'search' | 'generic'

interface EmptyStateProps {
  variant?:    EmptyVariant
  title?:      string
  description?: string
  action?:     React.ReactNode
  className?:  string
  showImage?:  boolean
}

const VARIANTS: Record<EmptyVariant, {
  Icon:        React.ComponentType<{ className?: string }>
  title:       string
  description: string
}> = {
  chapters:    { Icon: BookOpen,  title: 'No chapters yet',       description: 'Add the first chapter to get this subject started.' },
  students:    { Icon: Inbox,     title: 'No students yet',       description: 'Import students via CSV or add them one by one.' },
  schools:     { Icon: Trophy,    title: 'No schools yet',        description: 'Add a school to begin issuing student credentials.' },
  subjects:    { Icon: BookOpen,  title: 'No subjects yet',       description: 'Create the first subject to build learning paths.' },
  quizzes:     { Icon: FileText,  title: 'No quiz yet',           description: 'Create a quiz for this chapter.' },
  leaderboard: { Icon: Trophy,    title: 'Rankings coming soon',  description: 'Once students complete quizzes, your school will appear here.' },
  search:      { Icon: Search,    title: 'No results found',      description: 'Try a different search term or adjust your filters.' },
  generic:     { Icon: Inbox,     title: 'Nothing here yet',      description: 'Check back later.' },
}

export function EmptyState({ variant = 'generic', title, description, action, className, showImage = true }: EmptyStateProps) {
  const { Icon, title: defaultTitle, description: defaultDesc } = VARIANTS[variant]

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      {showImage ? (
        <div className="relative mb-6 w-40 h-40 rounded-3xl overflow-hidden shadow-md border-4 border-[white]">
          <Image src="/images/empty_state.png" alt="Empty state" fill className="object-cover" />
        </div>
      ) : (
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-[white] border border-[var(--border)] shadow-sm flex items-center justify-center">
            <Icon className="w-8 h-8 text-[var(--neutral-subtext)] stroke-[1.5px]" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[var(--color-accent-yellow)] opacity-80" />
        </div>
      )}

      <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
        {title ?? defaultTitle}
      </h3>
      <p className="text-base text-[var(--neutral-subtext)] max-w-sm mb-8 font-medium">
        {description ?? defaultDesc}
      </p>

      {action && <div>{action}</div>}
    </div>
  )
}
