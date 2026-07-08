import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/Button"
import { Building, BookOpen, Users, Trophy } from "lucide-react"

export default function SchoolsPage() {
  return (
    <>
      <PageHeader 
        title="KidLearners for Schools" 
        description="Empower your educators with a turn-key AI and Computer Science curriculum."
      />
      <div className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-6">Bring the future of education to your classrooms</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
                We partner with K-12 schools to provide everything you need to start teaching AI and coding tomorrow. No prior technical experience required from your teachers.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  { icon: BookOpen, text: "Comprehensive structured curriculum" },
                  { icon: Building, text: "School-wide admin dashboard" },
                  { icon: Users, text: "Teacher training and ongoing support" },
                  { icon: Trophy, text: "Student certification and hackathons" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-medium text-slate-700 dark:text-slate-300">
                    <div className="bg-primary-blue/10 p-2 rounded-lg text-primary-blue">
                      <item.icon className="w-5 h-5" />
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>
              <Button size="lg" variant="primary">Get a Demo for Your School</Button>
            </div>
            
            <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
              <form className="space-y-4">
                <h3 className="text-xl font-bold font-heading mb-4">Contact our Partnerships Team</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">School Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-primary-blue" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input type="text" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-primary-blue" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input type="text" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-primary-blue" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Work Email</label>
                  <input type="email" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-primary-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-primary-blue">
                    <option>Principal / Administrator</option>
                    <option>Teacher</option>
                    <option>IT Director</option>
                    <option>Other</option>
                  </select>
                </div>
                <Button className="w-full mt-4" variant="primary">Submit Request</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
