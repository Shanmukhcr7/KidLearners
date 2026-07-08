"use client"

import { motion } from "framer-motion"
import { ExternalLink, Code, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

const projects = [
  {
    title: "AI Story Generator",
    student: "Alex, Age 11",
    description: "An app that takes three keywords and generates a short illustrated story using OpenAI API.",
    tags: ["React", "OpenAI API", "CSS"],
    color: "from-blue-500/20 to-purple-500/20",
  },
  {
    title: "Eco-Bot Chat",
    student: "Sarah, Age 14",
    description: "A chatbot trained to answer questions about climate change and recycling best practices.",
    tags: ["Python", "NLP", "Streamlit"],
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    title: "Smart Study Timer",
    student: "David, Age 16",
    description: "Pomodoro timer that uses computer vision to pause when you look away from the screen.",
    tags: ["JavaScript", "TensorFlow.js", "Webcam"],
    color: "from-orange-500/20 to-red-500/20",
  }
]

export function FeaturedProjects() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-primary-blue/10 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-primary-blue" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-4">
            Built by KidLearners
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Check out some of the amazing projects our students have built. Real code, real applications, real impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image Placeholder */}
              <div className={`h-48 bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/50 group-hover:bg-transparent transition-colors duration-300"></div>
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold shadow-sm text-slate-900 dark:text-white transform group-hover:scale-110 transition-transform duration-300">
                  Preview Image
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-1">
                      {project.title}
                    </h3>
                    <p className="text-sm font-medium text-primary-blue">
                      By {project.student}
                    </p>
                  </div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 h-10">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Code className="w-4 h-4" /> Code
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1 gap-2">
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/projects">
            <Button variant="ghost" size="lg" className="text-slate-600 dark:text-slate-300">
              View Student Gallery <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
