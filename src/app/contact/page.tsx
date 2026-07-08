import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/Button"
import { Mail, MapPin, MessageSquare } from "lucide-react"

export default function ContactPage() {
  return (
    <>
      <PageHeader 
        title="Get in Touch" 
        description="Have a question about our programs? Want to partner with us? We'd love to hear from you."
      />
      <div className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            
            <div>
              <h2 className="text-3xl font-bold font-heading mb-6">Contact Information</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-12">
                Our team is available Monday through Friday to answer your questions and help you find the perfect program for your child.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-blue/10 p-3 rounded-xl text-primary-blue">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Email Us</h3>
                    <p className="text-slate-500 text-sm mt-1 mb-2">We aim to respond to all inquiries within 24 hours.</p>
                    <a href="mailto:hello@kidlearners.example.com" className="font-medium text-primary-blue hover:underline">hello@kidlearners.example.com</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary-green/10 p-3 rounded-xl text-primary-green">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Live Support</h3>
                    <p className="text-slate-500 text-sm mt-1 mb-2">Available for enrolled parents and students via the dashboard.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-accent-orange/10 p-3 rounded-xl text-accent-orange">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Headquarters</h3>
                    <p className="text-slate-500 text-sm mt-1">123 Innovation Drive<br/>Tech City, TC 90210<br/>United States</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-2xl font-bold font-heading mb-6">Send a Message</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-primary-blue" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-primary-blue" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input type="email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-primary-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-primary-blue">
                    <option>General Inquiry</option>
                    <option>Program Support</option>
                    <option>School Partnerships</option>
                    <option>Press</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea rows={4} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-primary-blue resize-none"></textarea>
                </div>
                <Button className="w-full h-11" variant="primary">Send Message</Button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
