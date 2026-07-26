import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'muted' | 'primary'
  className?: string
  children:   React.ReactNode
}

const VARIANTS = {
  success: 'bg-[var(--color-accent-green)]/10 text-[var(--color-accent-green)] border-[var(--color-accent-green)]/20',
  warning: 'bg-[var(--color-accent-yellow)]/20 text-slate-900 border-[var(--color-accent-yellow)]',
  danger:  'bg-[var(--color-accent-red)]/10 text-[var(--color-accent-red)] border-[var(--color-accent-red)]/20',
  muted:   'bg-[var(--color-muted)]/10 text-[var(--color-muted)] border-[var(--color-muted)]/20',
  primary: 'bg-[var(--color-accent-blue)] text-white border-[var(--color-accent-blue)]',
}

export function Badge({ variant = 'muted', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
