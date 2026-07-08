import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description: string
  className?: string
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("pt-24 pb-8 md:pt-28 md:pb-12 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800", className)}>
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          {description}
        </p>
      </div>
    </div>
  )
}
