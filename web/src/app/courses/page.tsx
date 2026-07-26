import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Code2 } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pt-24 pb-12 px-6">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-slate-500 hover:text-blue-600 flex items-center gap-2 font-medium mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Open Curriculum</h1>
        <p className="text-lg text-slate-600 mb-12 max-w-2xl">
          Browse the tech and AI modules available to integrate into your school's curriculum.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
              <Code2 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Neural Networks 101</h3>
            <p className="text-slate-600 mb-6 flex-1">Learn how perceptrons work, weights, biases, and how machines learn from data.</p>
            <div className="flex items-center justify-between text-sm text-slate-500 font-medium pt-4 border-t border-slate-100">
              <span className="flex items-center gap-1.5"><Clock size={16} /> 4 Modules</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md">Beginner</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Python Foundations</h3>
            <p className="text-slate-600 mb-6 flex-1">The essential programming language for modern AI and data science.</p>
            <div className="flex items-center justify-between text-sm text-slate-500 font-medium pt-4 border-t border-slate-100">
              <span className="flex items-center gap-1.5"><Clock size={16} /> 8 Modules</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md">Beginner</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
