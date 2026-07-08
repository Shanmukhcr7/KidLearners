"use client"

import { motion } from "framer-motion"
import { Code2, ShieldCheck, Users, Award, BookOpen, BrainCircuit } from "lucide-react"

const features = [
  {
    title: "Project-Based Learning",
    description: "Kids build real apps, games, and AI tools. No boring lectures, just pure creation.",
    icon: <BookOpen className="w-6 h-6 text-primary-blue" />,
    color: "bg-primary-blue/10 border-primary-blue/20"
  },
  {
    title: "Hands-on AI",
    description: "Interact with safe, sandboxed AI models to understand how the future works.",
    icon: <BrainCircuit className="w-6 h-6 text-primary-green" />,
    color: "bg-primary-green/10 border-primary-green/20"
  },
  {
    title: "Coding from Scratch",
    description: "From block-based basics to Python and web dev, we teach foundational skills.",
    icon: <Code2 className="w-6 h-6 text-accent-orange" />,
    color: "bg-accent-orange/10 border-accent-orange/20"
  },
  {
    title: "Safe AI for Kids",
    description: "Our platform uses moderated AI to ensure a 100% safe learning environment.",
    icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />,
    color: "bg-indigo-500/10 border-indigo-500/20"
  },
  {
    title: "Small Live Classes",
    description: "Max 5 students per session ensures personalized attention from expert mentors.",
    icon: <Users className="w-6 h-6 text-rose-500" />,
    color: "bg-rose-500/10 border-rose-500/20"
  },
  {
    title: "Certificates",
    description: "Earn recognizable certificates for completing paths and showcasing projects.",
    icon: <Award className="w-6 h-6 text-emerald-500" />,
    color: "bg-emerald-500/10 border-emerald-500/20"
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export function WhyKidLearners() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-4">
            Why Choose KidLearners?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            We don't just teach kids how to use technology; we teach them how to build it, understand it, and shape the future with it.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={item}
              className="group p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
