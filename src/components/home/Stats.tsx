"use client"

import { motion } from "framer-motion"

const stats = [
  { value: "50+", label: "Interactive Projects" },
  { value: "12", label: "Learning Modules" },
  { value: "4", label: "Age-Based Paths" },
  { value: "100%", label: "Safe & Moderated" },
]

export function Stats() {
  return (
    <section className="py-20 bg-primary-blue text-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-2"
            >
              <div className="text-4xl md:text-5xl font-extrabold font-heading tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-blue-100 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
