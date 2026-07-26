'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { ChevronUp, ChevronDown, ChevronsUpDown, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/shared/EmptyState'

export interface Column<T> {
  key:        keyof T | string
  header:     string
  sortable?:  boolean
  width?:     string
  render?:    (row: T) => React.ReactNode
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns:       Column<T>[]
  data:          T[]
  loading?:      boolean
  emptyVariant?: 'students' | 'schools' | 'chapters' | 'subjects' | 'quizzes' | 'search' | 'generic'
  emptyAction?:  React.ReactNode
  onExportCSV?:  () => void
  pageSize?:     number
  className?:    string
}

type SortDir = 'asc' | 'desc' | null

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyVariant = 'generic',
  emptyAction,
  onExportCSV,
  pageSize = 20,
  className,
}: DataTableProps<T>) {
  const [sortKey,  setSortKey]  = useState<string | null>(null)
  const [sortDir,  setSortDir]  = useState<SortDir>(null)
  const [page,     setPage]     = useState(1)

  const handleSort = useCallback((key: string) => {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return }
    if (sortDir === 'asc') { setSortDir('desc'); return }
    setSortKey(null); setSortDir(null)
  }, [sortKey, sortDir])

  const sorted = [...data].sort((a, b) => {
    if (!sortKey || !sortDir) return 0
    const av = a[sortKey] ?? ''
    const bv = b[sortKey] ?? ''
    const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
    return sortDir === 'asc' ? cmp : -cmp
  })

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const pageData   = sorted.slice((page - 1) * pageSize, page * pageSize)

  const SortIcon = ({ col }: { col: Column<T> }) => {
    if (!col.sortable) return null
    const key = String(col.key)
    if (sortKey !== key) return <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
    if (sortDir === 'asc')  return <ChevronUp   className="w-3.5 h-3.5 text-[var(--color-accent-blue)]" />
    return <ChevronDown className="w-3.5 h-3.5 text-[var(--color-accent-blue)]" />
  }

  return (
    <div className={cn('bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden', className)}>
      {/* Toolbar */}
      {onExportCSV && (
        <div className="px-4 py-3 border-b-2 border-slate-900 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onExportCSV}>
            <Download className="w-3.5 h-3.5" /> Export CSV
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-900 bg-slate-50">
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wide whitespace-nowrap',
                    col.sortable && 'cursor-pointer select-none hover:text-slate-900',
                    col.width
                  )}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <span className="flex items-center gap-1">
                    {col.header}
                    <SortIcon col={col} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y-2 divide-slate-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map(col => (
                    <td key={String(col.key)} className="px-4 py-3">
                      <div className="skeleton h-4 w-full rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState variant={emptyVariant} action={emptyAction} />
                </td>
              </tr>
            ) : (
              pageData.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-slate-50 transition-colors duration-100"
                >
                  {columns.map(col => (
                    <td key={String(col.key)} className="px-4 py-3 text-slate-800 font-medium">
                      {col.render
                        ? col.render(row)
                        : String(row[String(col.key)] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && pageData.length > 0 && (
        <div className="px-4 py-3 border-t-2 border-slate-900 flex items-center justify-between bg-slate-50">
          <p className="text-xs font-bold text-slate-600">
            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost" size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 p-0 border-2 border-transparent hover:border-slate-900 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs font-bold text-slate-600 px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="ghost" size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 p-0 border-2 border-transparent hover:border-slate-900 rounded-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
