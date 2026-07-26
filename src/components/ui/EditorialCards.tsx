'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { BookOpen, TrendUp } from '@phosphor-icons/react/dist/ssr'

export function EditorialCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Parallax on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 150])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100])

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
        
        {/* Editorial Card 1 (Top Right) */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-[20%] right-[10%] md:right-[15%] w-64 md:w-80 border border-[var(--foreground)] bg-slate-50 p-6 transform rotate-3 shadow-[8px_8px_0_0_#111111]"
        >
          <div className="flex items-center gap-3 border-b border-[var(--foreground)] pb-4 mb-4">
            <BookOpen className="w-6 h-6 text-slate-900" />
            <h4 className="font-display text-xl uppercase tracking-widest text-slate-900">Chapter IV</h4>
          </div>
          <p className="font-serif text-slate-900 italic text-lg leading-relaxed mb-4">
            "The neural pathways activated as the student solved the algorithm."
          </p>
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[var(--stone)]">
            <span>Pg. 42</span>
            <span>AI Foundations</span>
          </div>
        </motion.div>

        {/* Editorial Card 2 (Bottom Left) */}
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-[20%] left-[5%] md:left-[15%] w-56 md:w-72 border border-[var(--foreground)] bg-transparent backdrop-blur-md p-6 transform -rotate-3 border-dashed"
        >
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-sans text-sm uppercase tracking-[0.2em] font-bold text-slate-900">Growth</h4>
            <TrendUp className="w-5 h-5 text-slate-900" />
          </div>
          <div className="text-5xl font-display font-light text-slate-900 mb-2">
            +48<span className="text-xl">%</span>
          </div>
          <p className="text-sm font-sans text-[var(--stone)]">
            Increase in student engagement across pilot schools in Q3.
          </p>
        </motion.div>

      </motion.div>
    </div>
  )
}
