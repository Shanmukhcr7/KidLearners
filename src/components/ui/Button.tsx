import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { CircleNotch } from '@phosphor-icons/react/dist/ssr'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?:    'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none'

    const variants = {
      primary:   'bg-[var(--color-primary)] text-white shadow-sm hover:bg-[var(--color-primary-hover)] active:scale-[0.98]',
      secondary: 'bg-white border border-slate-200 shadow-sm text-slate-900 hover:bg-slate-50 active:scale-[0.98]',
      ghost:     'text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-[0.98]',
      danger:    'bg-[var(--color-accent-red)] text-white shadow-sm hover:brightness-95 active:scale-[0.98]',
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm gap-1.5 font-medium',
      md: 'h-10 px-4 text-sm gap-2 font-medium',
      lg: 'h-12 px-6 text-base gap-2 font-medium',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <CircleNotch weight="bold" className="animate-spin w-5 h-5 mr-1" />
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
