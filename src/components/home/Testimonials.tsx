"use client"

import { Star } from "lucide-react"

const testimonials = [
  {
    quote: "KidLearners completely changed how my daughter sees the computer. Instead of just playing games, she's now building them with AI. The transformation is incredible.",
    author: "Sarah M.",
    role: "Parent of 10-year-old",
  },
  {
    quote: "The small class sizes mean my son actually gets his questions answered. The mentors are fantastic and really know how to explain complex AI concepts to kids.",
    author: "Michael T.",
    role: "Parent of 13-year-old",
  },
  {
    quote: "We implemented the KidLearners curriculum in our middle school this year. The engagement levels are through the roof. Students who previously had no interest in coding are now top of the class.",
    author: "Dr. Emily Chen",
    role: "Middle School Principal",
  }
]

export function Testimonials() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-4">
            Loved by Parents and Educators
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Don't just take our word for it. Hear from the people seeing the impact firsthand.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 relative">
              <div className="flex gap-1 text-accent-orange mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 italic mb-8 relative z-10 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-500">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {testimonial.author}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
