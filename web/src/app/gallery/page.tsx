import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pt-24 pb-12 px-6">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-slate-500 hover:text-blue-600 flex items-center gap-2 font-medium mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Gallery</h1>
        <p className="text-lg text-slate-600 mb-12 max-w-2xl">
          See KidLearners in action. Discover how students across the country are using our gamified platform to learn AI and modern tech skills.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-slate-200 rounded-xl aspect-[4/3] flex items-center justify-center border border-slate-300">
            <span className="text-slate-400 font-medium">Classroom Setup</span>
          </div>
          <div className="bg-slate-200 rounded-xl aspect-[3/4] flex items-center justify-center border border-slate-300 row-span-2">
            <span className="text-slate-400 font-medium">Student Dashboard</span>
          </div>
          <div className="bg-slate-200 rounded-xl aspect-[4/3] flex items-center justify-center border border-slate-300">
            <span className="text-slate-400 font-medium">Teacher Portal</span>
          </div>
          <div className="bg-slate-200 rounded-xl aspect-[4/3] flex items-center justify-center border border-slate-300">
            <span className="text-slate-400 font-medium">Coding Session</span>
          </div>
          <div className="bg-slate-200 rounded-xl aspect-[4/3] flex items-center justify-center border border-slate-300">
            <span className="text-slate-400 font-medium">School Admin Panel</span>
          </div>
        </div>
      </div>
    </div>
  );
}
