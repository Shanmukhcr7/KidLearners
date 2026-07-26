'use client'

import React from 'react'
import { AlertTriangle } from 'lucide-react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  errorId:  string
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, errorId: '' }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
      errorId:  Math.random().toString(36).slice(2, 8).toUpperCase(),
    }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production this would send to error tracking (e.g. Sentry)
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-[300px] flex flex-col items-center justify-center text-center px-6 py-16">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-5">
            <AlertTriangle className="w-7 h-7 text-[#B9821A]" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-slate-500 max-w-xs mb-1">
            We&apos;ve been notified and are looking into it.
          </p>
          <p className="text-xs text-slate-500 font-mono mb-6">
            Error ref: {this.state.errorId}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, errorId: '' })}
            className="px-4 py-2 bg-[var(--color-accent-yellow)] text-white text-sm font-medium rounded-[8px] hover:bg-[#B9821A] transition-colors"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
