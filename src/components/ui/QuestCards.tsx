'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { Star, Medal, Lightning, CheckCircle } from '@phosphor-icons/react/dist/ssr'

export function QuestCards() {
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
        
        {/* Card 1: Level Up Badge (Top Right) */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-1/4 right-[10%] md:right-[15%] w-56 rounded-3xl border-4 border-[var(--background)] bg-[var(--paper)] shadow-[0_16px_40px_rgba(255,51,102,0.15)] p-5 transform rotate-6 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[var(--clay)] flex items-center justify-center mb-3 shadow-inner shadow-black/10">
            <Medal weight="fill" className="w-8 h-8 text-[var(--sunburst)]" />
          </div>
          <h4 className="font-display font-black text-xl text-slate-900 mb-1">Level 5 Reached!</h4>
          <p className="text-[var(--stone)] text-sm font-medium mb-3">AI Explorer</p>
          <div className="w-full bg-[var(--hairline)] rounded-full h-3 overflow-hidden shadow-inner">
            <div className="bg-[var(--moss)] w-3/4 h-full rounded-full" />
          </div>
          <div className="w-full flex justify-between text-xs font-bold text-[var(--stone)] mt-1 px-1">
            <span>XP 450</span>
            <span>500</span>
          </div>
        </motion.div>

        {/* Card 2: Daily Streak (Bottom Left) */}
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-1/4 left-[5%] md:left-[15%] w-64 rounded-3xl border-4 border-[var(--background)] bg-[var(--paper)] shadow-[0_16px_40px_rgba(0,229,255,0.15)] p-5 transform -rotate-3"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--sunburst)] flex items-center justify-center shadow-inner shadow-black/10">
              <Lightning weight="fill" className="w-7 h-7 text-white" />
            </div>
            <div>
              <h4 className="font-display font-black text-lg text-slate-900">7 Day Streak!</h4>
              <p className="text-[var(--clay)] font-bold text-sm">+50 Bonus XP</p>
            </div>
          </div>
          <div className="flex gap-2 justify-between">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div key={day} className={`w-6 h-6 rounded-full flex items-center justify-center ${day === 7 ? 'bg-[var(--sunburst)] text-white' : 'bg-[var(--moss)] text-white'}`}>
                <CheckCircle weight="fill" className="w-4 h-4" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Card 3: Mini Quest (Center Right Background) */}
        <motion.div 
          style={{ y: y3 }}
          className="absolute top-[40%] left-[10%] md:left-[25%] w-48 rounded-2xl border-4 border-[var(--background)] bg-[var(--paper)] shadow-[0_8px_20px_rgba(255,214,0,0.2)] p-4 transform -rotate-12 opacity-90"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[var(--moss)] flex items-center justify-center">
              <Star weight="fill" className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-slate-900">Daily Quest</span>
          </div>
          <div className="h-3 w-full bg-[var(--hairline)] rounded-full mb-1">
             <div className="bg-[var(--clay)] w-1/2 h-full rounded-full" />
          </div>
          <span className="text-[10px] font-bold text-[var(--stone)] uppercase tracking-wider">5/10 Questions</span>
        </motion.div>

      </motion.div>
    </div>
  )
}
