import { PageHeader } from "@/components/layout/PageHeader"
import { Users, Target, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <>
      <PageHeader 
        title="About KidLearners" 
        description="Our mission is to inspire the next generation of innovators, creators, and problem-solvers through AI education."
      />
      <div className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-16">
            
            <section className="text-center">
              <h2 className="text-3xl font-bold font-heading mb-6">Our Story</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                KidLearners started with a simple observation: kids love interacting with technology, but the traditional education system often struggles to keep up with the rapid pace of innovation, especially in fields like Artificial Intelligence.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                We set out to build a platform that doesn't just teach kids how to consume media, but empowers them to understand the algorithms behind it and build their own intelligent applications from scratch.
              </p>
            </section>

            <div className="grid md:grid-cols-3 gap-8 py-8 border-y border-slate-100 dark:border-slate-800">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary-blue/10 rounded-full flex items-center justify-center mb-4 text-primary-blue">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-heading mb-2">Our Mission</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">To make AI and modern technology education accessible and engaging for children worldwide.</p>
              </div>
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center mb-4 text-primary-green">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-heading mb-2">Our Values</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Curiosity, safety, inclusivity, and hands-on creation over passive consumption.</p>
              </div>
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-accent-orange/10 rounded-full flex items-center justify-center mb-4 text-accent-orange">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-heading mb-2">Our Community</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">A global network of parents, educators, and young creators shaping the future.</p>
              </div>
            </div>

            <section className="text-center">
              <h2 className="text-3xl font-bold font-heading mb-8">Leadership Team</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-slate-200 dark:bg-slate-800 mb-4 overflow-hidden grayscale opacity-50"></div>
                    <h4 className="font-bold text-lg">Jane Doe</h4>
                    <p className="text-primary-blue text-sm">Co-Founder & CEO</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  )
}
