'use client'

import { ReactNode, useEffect } from 'react'
import Lenis from 'lenis'

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Lenis disabled to fix scroll issues
  }, [])

  return <>{children}</>
}
