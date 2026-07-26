'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function AnimatedPencilDrawing() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 1440 800" 
        preserveAspectRatio="xMidYMid slice"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Abstract Brain / Node Network Drawing */}
        <motion.path
          d="M 100,600 C 200,500 300,700 400,600 S 500,400 600,500 S 800,700 900,500 S 1100,400 1200,600 S 1300,700 1440,600"
          stroke="var(--foreground)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 4, ease: "easeInOut", delay: 0.5 }}
        />
        
        {/* Geometric Accents */}
        <motion.circle
          cx="400" cy="600" r="40"
          stroke="var(--foreground)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0, rotate: -90 }}
          animate={{ pathLength: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 2, ease: "easeOut", delay: 1.5 }}
        />
        <motion.rect
          x="860" y="460" width="80" height="80"
          stroke="var(--foreground)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 2.5 }}
        />
        
        {/* Elegant connection lines */}
        <motion.path
          d="M 440,600 L 860,500 L 1200,600"
          stroke="var(--foreground)"
          strokeWidth="1"
          strokeDasharray="4 8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 3, ease: "easeInOut", delay: 2 }}
        />

        {/* Floating Abstract Squiggles */}
        <motion.path
          d="M 150,200 Q 250,100 350,250 T 550,200"
          stroke="var(--foreground)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 3, ease: "easeInOut", delay: 1 }}
        />
        
        <motion.path
          d="M 1100,200 C 1200,100 1300,300 1400,200"
          stroke="var(--foreground)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 3, ease: "easeInOut", delay: 3 }}
        />
      </svg>
    </div>
  )
}
