import { PageHeader } from "@/components/layout/PageHeader"
import { Bot, Sparkles, Image as ImageIcon, MessageSquare, Mic } from "lucide-react"

const labs = [
  {
    title: "AI Chatbot Builder",
    description: "Train your very own AI assistant. Feed it facts and see how it responds to questions.",
    icon: <MessageSquare className="w-8 h-8 text-primary-blue" />,
    color: "bg-primary-blue/10 border-primary-blue/20"
  },
  {
    title: "Image Playground",
    description: "Use prompt engineering to generate incredible art, game assets, and character designs.",
    icon: <ImageIcon className="w-8 h-8 text-primary-green" />,
    color: "bg-primary-green/10 border-primary-green/20"
  },
  {
    title: "Voice Clone Lab",
    description: "Learn how text-to-speech works and build an AI that can narrate your stories.",
    icon: <Mic className="w-8 h-8 text-accent-orange" />,
    color: "bg-accent-orange/10 border-accent-orange/20"
  },
  {
    title: "Smart Game NPC",
    description: "Code a non-player character that actually understands what you type instead of just having pre-programmed responses.",
    icon: <Bot className="w-8 h-8 text-indigo-500" />,
    color: "bg-indigo-500/10 border-indigo-500/20"
  }
]

export default function AILabsPage() {
  return (
    <>
      <PageHeader 
        title="Interactive AI Labs" 
        description="Get hands-on experience with the latest AI technologies in our secure, sandboxed environment."
      />
      <div className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {labs.map((lab, index) => (
              <div key={index} className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col items-start gap-6 hover:shadow-xl transition-shadow">
                <div className={`p-4 rounded-2xl border ${lab.color}`}>
                  {lab.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2">
                    {lab.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {lab.description}
                  </p>
                </div>
                <button className="mt-auto px-6 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Try it Out
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
