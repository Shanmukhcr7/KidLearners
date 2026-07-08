import { CheckCircle2, ShieldCheck, TrendingUp, MonitorPlay } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import Image from "next/image"

const benefits = [
  {
    title: "100% Safe Environment",
    description: "Strictly moderated content and safe AI sandboxes designed for kids.",
    icon: <ShieldCheck className="w-5 h-5 text-primary-green" />
  },
  {
    title: "No Coding Experience Needed",
    description: "We start from the absolute basics, perfect for complete beginners.",
    icon: <MonitorPlay className="w-5 h-5 text-primary-blue" />
  },
  {
    title: "Track Their Progress",
    description: "Dedicated parent dashboard to monitor completed projects and skills gained.",
    icon: <TrendingUp className="w-5 h-5 text-accent-orange" />
  },
  {
    title: "Future-Ready Skills",
    description: "Equip them with the logical and technical skills needed for tomorrow's careers.",
    icon: <CheckCircle2 className="w-5 h-5 text-indigo-500" />
  }
]

export function ParentSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-blue/10 to-primary-green/10 rounded-3xl transform -rotate-3 scale-105"></div>
            <div className="relative bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg">
              {/* Dashboard mockup placeholder */}
              <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="flex-1 p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-32 bg-slate-200 dark:bg-slate-600 rounded"></div>
                    <div className="h-6 w-16 bg-primary-green/20 rounded"></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 h-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    <div className="flex-1 h-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    <div className="flex-1 h-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Alex finished a project!</p>
                    <p className="text-xs text-slate-500">2 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-6">
              Peace of mind for parents. <br />
              <span className="text-primary-blue">A head start for kids.</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              We know screen time is a concern. That's why KidLearners turns passive consumption into active, educational creation in a secure environment.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-3">
                  <div className="mt-1 flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">{benefit.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/parents">
              <Button size="lg" variant="primary">
                Explore the Parent Dashboard
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
