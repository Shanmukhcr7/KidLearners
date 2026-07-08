import { ArrowRight, Clock, Star, Terminal } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

const paths = [
  {
    title: "AI Explorer",
    age: "Age 7–10",
    description: "Introduction to logical thinking, basic coding concepts, and safe interactions with AI tools.",
    duration: "12 Weeks",
    projects: "3 Projects",
    skills: ["Scratch", "Logic", "AI Basics"],
    color: "bg-primary-blue",
    lightColor: "bg-primary-blue/10 text-primary-blue",
  },
  {
    title: "AI Creator",
    age: "Age 10–13",
    description: "Transitioning to Python, building simple chatbots, and understanding how AI generates text and images.",
    duration: "16 Weeks",
    projects: "4 Projects",
    skills: ["Python", "Prompting", "Web Basics"],
    color: "bg-primary-green",
    lightColor: "bg-primary-green/10 text-primary-green",
  },
  {
    title: "AI Innovator",
    age: "Age 13–16",
    description: "Deep dive into web development, integrating AI APIs, and building functional applications.",
    duration: "24 Weeks",
    projects: "5 Projects",
    skills: ["JavaScript", "React", "AI APIs"],
    color: "bg-accent-orange",
    lightColor: "bg-accent-orange/10 text-accent-orange",
  },
  {
    title: "Future Engineer",
    age: "Age 16–18",
    description: "Advanced AI concepts, machine learning basics, and building production-ready projects.",
    duration: "24 Weeks",
    projects: "Capstone",
    skills: ["Next.js", "ML Basics", "Databases"],
    color: "bg-indigo-500",
    lightColor: "bg-indigo-500/10 text-indigo-500",
  }
]

export function LearningPaths() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-4">
              Structured Learning Paths
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Age-appropriate curriculums designed by education experts to take your child from beginner to creator.
            </p>
          </div>
          <Link href="/programs">
            <Button variant="outline" className="gap-2">
              View All Programs <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paths.map((path, index) => (
            <div key={index} className="relative group bg-white dark:bg-slate-950 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className={`absolute top-0 right-8 w-16 h-1 rounded-b-md ${path.color}`}></div>
              
              <div className="mb-6 mt-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${path.lightColor}`}>
                  {path.age}
                </span>
                <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2">
                  {path.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {path.description}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {path.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" /> {path.projects}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {path.skills.map(skill => (
                  <span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Terminal className="w-3 h-3" /> {skill}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link href={`/programs/${path.title.toLowerCase().replace(" ", "-")}`}>
                  <Button variant="ghost" className="w-full justify-between group-hover:bg-slate-50 dark:group-hover:bg-slate-800">
                    View Curriculum <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
