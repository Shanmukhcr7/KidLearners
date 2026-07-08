import { createClient } from '@/utils/supabase/server'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { CheckCircle2, Clock } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const role = profile?.role || 'student'
  const firstName = profile?.first_name || user.email?.split('@')[0] || 'User'

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">
          Welcome back, {firstName}!
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Here is an overview of your KidLearners {role} account.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-blue">
              {role === 'student' ? '2' : (role === 'parent' ? '4' : '12')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Projects Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-green">
              {role === 'student' ? '5' : (role === 'parent' ? '10' : '450')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Hours Learned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent-orange">
              {role === 'student' ? '24' : (role === 'parent' ? '48' : '1024')}
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-4">Recent Activity</h2>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <div className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Completed "Python Basics"</p>
                <p className="text-sm text-slate-500">Module 3 - AI Creator Path</p>
              </div>
            </div>
            <div className="text-sm text-slate-400 flex items-center gap-1">
              <Clock className="w-4 h-4" /> 2 hours ago
            </div>
          </div>
          
          <div className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Enrolled in "Intro to Prompts"</p>
                <p className="text-sm text-slate-500">Module 4 - AI Creator Path</p>
              </div>
            </div>
            <div className="text-sm text-slate-400 flex items-center gap-1">
              <Clock className="w-4 h-4" /> 1 day ago
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
