import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:       string
  error?:       string
  helper?:      string
  leftIcon?:    React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, leftIcon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-bold text-slate-900"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neutral-subtext)]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-12 rounded-xl border-[1.5px] bg-[white] text-slate-900 text-base shadow-sm',
              'placeholder:text-[var(--neutral-subtext)] transition-all duration-200',
              'focus:outline-none focus:border-[var(--color-accent-yellow)] focus:ring-2 focus:ring-[var(--color-accent-yellow)]/30 focus:-translate-y-0.5',
              error
                ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/20'
                : 'border-[var(--border)] hover:border-[var(--neutral-subtext)]',
              leftIcon ? 'pl-11 pr-4' : 'px-4',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs font-semibold text-[var(--error)]">{error}</p>}
        {helper && !error && <p className="text-xs text-[var(--neutral-subtext)]">{helper}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
