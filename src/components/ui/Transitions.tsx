'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

export function FadeIn({ children, delay = 0, className }: { children: ReactNode, delay?: number, className?: string }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function PageTurn({ children, className, keyId }: { children: ReactNode, className?: string, keyId: string }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      key={keyId}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, rotateY: -15, transformPerspective: 1200 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, rotateY: 0, transformPerspective: 1200 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, rotateY: 15, transformPerspective: 1200 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className={className}
      style={{ transformOrigin: 'left center' }}
    >
      {children}
    </motion.div>
  )
}
