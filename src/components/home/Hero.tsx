"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Bot, Code, Cpu } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-blue/10 via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center rounded-full border border-primary-blue/20 bg-primary-blue/10 px-3 py-1 text-sm font-medium text-primary-blue mb-6">
                <SparklesIcon className="mr-2 h-4 w-4" />
                The Future of Education is Here
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                Helping Kids Build the Future with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-primary-green">Artificial Intelligence</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Interactive AI education designed for curious young minds. Project-based learning that transforms kids from passive consumers into active creators.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/get-started">
                  <Button size="lg" variant="primary" className="w-full sm:w-auto gap-2">
                    Start Learning <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/programs">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Explore Programs
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="relative lg:ml-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full max-w-lg mx-auto aspect-square"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary-blue/20 to-primary-green/20 blur-3xl" />
              
              {/* Illustration Placeholder - Normally you'd use a real SVG/Image here */}
              <div className="relative h-full w-full bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-32 h-32 mb-8">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-2 border-dashed border-primary-blue/50"
                    />
                    <Bot className="w-16 h-16 text-primary-blue" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading mb-2">Interactive AI Labs</h3>
                  <p className="text-slate-500">Train models, build bots, and learn coding hands-on.</p>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 left-10 bg-white dark:bg-slate-700 p-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-600"
                >
                  <Cpu className="w-6 h-6 text-primary-green" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-12 right-10 bg-white dark:bg-slate-700 p-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-600"
                >
                  <Code className="w-6 h-6 text-accent-orange" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}
