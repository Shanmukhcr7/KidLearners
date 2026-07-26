'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { ChartBar, Terminal, Code, Users } from '@phosphor-icons/react/dist/ssr'

export function FloatingGlassCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Parallax on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 100])

  // Mouse interaction for subtle tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 })
  const rotateX = useTransform(springY, [-0.5, 0.5], ["5deg", "-5deg"])
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-5deg", "5deg"])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
    >
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full h-full relative"
      >
        
        {/* Card 1: AI Terminal (Top Right) */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-1/4 right-[10%] w-64 md:w-80 rounded-2xl border border-[var(--hairline)] bg-[var(--paper)]/60 backdrop-blur-3xl shadow-[0_8px_32px_rgba(23,20,15,0.08)] p-5 transform -rotate-6"
        >
          <div className="flex items-center gap-2 mb-4 border-b border-[var(--hairline)] pb-2">
            <Terminal className="w-5 h-5 text-[var(--stone)]" />
            <span className="text-xs font-mono text-[var(--stone)]">kid_learners_ai_v2.sh</span>
          </div>
          <div className="space-y-2 font-mono text-[10px] md:text-xs text-[var(--stone)]">
            <p className="text-[var(--moss)]">➜  ~ ./initialize_curriculum</p>
            <p>Loading neural pathways...</p>
            <p>Generating personalized quizzes... <span className="text-[var(--clay)]">Done [0.03s]</span></p>
            <p>Ready to learn.</p>
          </div>
        </motion.div>

        {/* Card 2: Student Chart (Bottom Left) */}
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-1/4 left-[5%] md:left-[15%] w-56 md:w-72 rounded-2xl border border-[var(--hairline)] bg-[var(--paper)]/60 backdrop-blur-3xl shadow-[0_8px_32px_rgba(23,20,15,0.08)] p-5 transform rotate-3"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-[var(--hairline)]">
              <ChartBar className="w-5 h-5 text-[var(--clay)]" />
            </div>
            <span className="text-[var(--moss)] font-medium text-sm">+24% this week</span>
          </div>
          <div className="flex items-end gap-2 h-20">
            {[40, 55, 30, 70, 85, 60, 100].map((h, i) => (
              <div key={i} className="flex-1 bg-slate-900/10 rounded-t-sm relative group" style={{ height: `${h}%` }}>
                <div className="absolute inset-0 bg-[var(--clay)] opacity-0 group-hover:opacity-100 transition-opacity rounded-t-sm" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Card 3: Code Snippet (Center Right Background) */}
        <motion.div 
          style={{ y: y3 }}
          className="absolute top-1/2 right-[5%] md:right-[20%] w-48 rounded-xl border border-[var(--hairline)] bg-slate-50/40 backdrop-blur-md shadow-sm p-4 transform rotate-12 opacity-70 blur-[1px]"
        >
           <Code className="w-4 h-4 text-[var(--stone)] mb-2" />
           <div className="h-2 w-full bg-slate-900/5 rounded mb-2" />
           <div className="h-2 w-3/4 bg-slate-900/5 rounded mb-2" />
           <div className="h-2 w-5/6 bg-slate-900/5 rounded" />
        </motion.div>

      </motion.div>
    </div>
  )
}
