import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { ArrowRight, Calendar, User } from "lucide-react"

const posts = [
  {
    title: "Why Kids Need to Learn Prompt Engineering",
    excerpt: "The future of coding might not be writing syntax, but knowing how to communicate effectively with AI models.",
    author: "Jane Doe",
    date: "Aug 15, 2026",
    category: "AI for Kids",
    readTime: "5 min read",
    color: "bg-primary-blue/10"
  },
  {
    title: "How to Ensure Your Child is Safe Using AI",
    excerpt: "A comprehensive guide for parents on setting boundaries, monitoring usage, and choosing safe platforms.",
    author: "Michael Smith",
    date: "Aug 10, 2026",
    category: "Parent Guides",
    readTime: "8 min read",
    color: "bg-primary-green/10"
  },
  {
    title: "KidLearners Summer Hackathon Results",
    excerpt: "Check out the amazing projects built by our students during the 48-hour global AI hackathon.",
    author: "KidLearners Team",
    date: "Jul 28, 2026",
    category: "Community",
    readTime: "3 min read",
    color: "bg-accent-orange/10"
  }
]

export default function BlogPage() {
  return (
    <>
      <PageHeader 
        title="KidLearners Blog" 
        description="Insights, guides, and stories about the intersection of education, children, and artificial intelligence."
      />
      <div className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article key={index} className="flex flex-col h-full border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl transition-shadow bg-white dark:bg-slate-900">
                <div className={`h-48 ${post.color} relative flex items-center justify-center`}>
                  <span className="font-bold font-heading text-slate-800 dark:text-white opacity-50">Cover Image</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-primary-blue uppercase tracking-wider">{post.category}</span>
                    <span className="text-xs text-slate-500">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-3 line-clamp-2 text-slate-900 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 text-sm flex-1">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1"><User className="w-3 h-3"/> {post.author}</div>
                      <span className="text-slate-300">•</span>
                      <div className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {post.date}</div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="outline" size="lg">Load More Articles</Button>
          </div>
        </div>
      </div>
    </>
  )
}
