// Shared skeleton loader — content-shaped placeholders, never bare spinners
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton', className)} aria-hidden="true" />
}

// Pre-composed skeleton layouts for common cards

export function ChapterCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex items-start gap-4">
      <Skeleton className="w-10 h-10 rounded-[8px] shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-2 w-full mt-3 rounded-full" />
      </div>
    </div>
  )
}

export function SubjectCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
      <Skeleton className="w-12 h-12 rounded-[8px]" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-2 w-full rounded-full mt-2" />
    </div>
  )
}

export function DashboardStatSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <Skeleton className="h-3 w-1/2 mb-3" />
      <Skeleton className="h-8 w-1/3 mb-2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

export function SchoolRankCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-12 w-1/4" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}

export function LeaderboardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
      <Skeleton className="h-4 w-1/3 mb-6" />
      <Skeleton className="h-12 w-1/4" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}
