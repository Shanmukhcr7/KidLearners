'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ChartBar, Users, BookOpen, TrendUp } from '@phosphor-icons/react/dist/ssr'

export function FloatingDashboard() {
  const containerRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 50, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 50, damping: 20 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full max-w-5xl mx-auto h-[600px] perspective-[2000px] flex items-center justify-center relative z-20 mt-16 group"
    >
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full h-full relative"
      >
        {/* Soft Glow Behind the Dashboard */}
        <div className="absolute inset-0 bg-[var(--clay)]/20 blur-[100px] -z-10 rounded-[40px] transform group-hover:bg-[var(--clay)]/30 transition-colors duration-700" />
        
        {/* The Glass Mockup Frame */}
        <div className="w-full h-full rounded-[24px] border border-[var(--hairline)] bg-[var(--paper)]/60 backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col relative">
          
          {/* Top Window Chrome */}
          <div className="h-12 border-b border-[var(--hairline)] flex items-center px-6 gap-2 bg-[var(--paper)]/40">
            <div className="w-3 h-3 rounded-full bg-[var(--border)] opacity-60" />
            <div className="w-3 h-3 rounded-full bg-[var(--border)] opacity-60" />
            <div className="w-3 h-3 rounded-full bg-[var(--border)] opacity-60" />
            <div className="flex-grow flex justify-center">
              <div className="h-6 w-64 bg-slate-50 rounded-full border border-[var(--hairline)]" />
            </div>
          </div>

          {/* Fake UI Content */}
          <div className="flex-grow flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-[var(--hairline)] bg-slate-50/50 p-6 flex flex-col gap-8">
               <div className="h-8 w-32 bg-slate-900/10 rounded" />
               <div className="space-y-4">
                 <div className="h-4 w-full bg-slate-900/5 rounded" />
                 <div className="h-4 w-3/4 bg-slate-900/5 rounded" />
                 <div className="h-4 w-5/6 bg-slate-900/5 rounded" />
               </div>
               <div className="mt-auto h-32 w-full bg-[var(--clay)]/10 rounded-xl border border-[var(--clay)]/20 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-[var(--clay)]/30" />
               </div>
            </div>

            {/* Main Area */}
            <div className="flex-grow p-8 bg-transparent flex flex-col gap-8">
               {/* Header area */}
               <div className="flex justify-between items-end">
                 <div>
                   <div className="h-5 w-24 bg-[var(--stone)]/20 rounded mb-2" />
                   <div className="h-10 w-64 bg-slate-900/80 rounded" />
                 </div>
                 <div className="h-10 w-32 bg-[var(--clay)] rounded-full" />
               </div>

               {/* Metric Cards Grid */}
               <div className="grid grid-cols-3 gap-6">
                 {[
                   { icon: <Users className="w-6 h-6 text-slate-900" />, val: '1,204', label: 'Active Students' },
                   { icon: <BookOpen className="w-6 h-6 text-[var(--clay)]" />, val: '45,000+', label: 'Questions Answered' },
                   { icon: <TrendUp className="w-6 h-6 text-[var(--moss)]" />, val: '#4', label: 'National Rank' },
                 ].map((metric, i) => (
                   <div key={i} className="p-6 rounded-2xl border border-[var(--hairline)] bg-[var(--paper)]/80 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-[var(--hairline)]">
                        {metric.icon}
                      </div>
                      <div>
                        <div className="text-3xl font-display font-medium text-slate-900">{metric.val}</div>
                        <div className="text-sm font-medium text-[var(--stone)] uppercase tracking-wider mt-1">{metric.label}</div>
                      </div>
                   </div>
                 ))}
               </div>

               {/* Chart Area */}
               <div className="flex-grow rounded-2xl border border-[var(--hairline)] bg-[var(--paper)]/80 p-6 flex flex-col">
                 <div className="h-6 w-48 bg-slate-900/10 rounded mb-8" />
                 <div className="flex-grow flex items-end justify-between gap-4 px-4 pb-4">
                   {[40, 70, 45, 90, 65, 100, 80].map((height, i) => (
                     <div key={i} className="w-full bg-[var(--clay)]/20 rounded-t-sm relative group cursor-pointer transition-all hover:bg-[var(--clay)]" style={{ height: `${height}%` }}>
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-slate-50 text-xs py-1 px-2 rounded font-medium">
                         {height}%
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
