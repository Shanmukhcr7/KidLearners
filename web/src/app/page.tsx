"use client";

import { Navbar } from "@/components/ui/Navbar";
import Link from "next/link";
import { ArrowRight, BookOpen, Trophy, Image as ImageIcon, CheckCircle2, Users, Building2, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { AnimatedSection, AnimatedCard } from "@/components/ui/AnimatedSection";

export default function Home() {
  const [stats, setStats] = useState({ schools: 0, students: 0, modules: 120, satisfaction: 98 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/schools/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch stats", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      <Navbar />

      {/* Hero Section with modern subtle gradient */}
      <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-400/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        <AnimatedSection delay={0.1}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-blue-700 font-bold text-xs sm:text-sm mb-8 shadow-sm border border-blue-100 uppercase tracking-wide">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            Empowering schools with AI
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={0.2}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-slate-900 max-w-4xl leading-[1.1] mb-6">
            The Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">LMS</span> for Modern Schools.
          </h1>
        </AnimatedSection>
        
        <AnimatedSection delay={0.3}>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed px-4">
            A fully integrated platform providing professional administration for teachers, and a highly engaging, gamified learning experience for students.
          </p>
        </AnimatedSection>
        
        <AnimatedSection delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
            <Link href="/demo" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 text-lg">
              Request a Demo <ArrowRight size={20} />
            </Link>
            <Link href="/courses" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 text-lg shadow-sm">
              View Curriculum
            </Link>
          </div>
        </AnimatedSection>
      </main>

      {/* Dynamic Stats Section */}
      <AnimatedSection delay={0.5}>
        <div className="bg-white border-y border-slate-200 py-12 md:py-16 relative z-10">
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 gap-8 text-center divide-x divide-slate-100">
            <div>
              <div className="flex justify-center mb-3 text-blue-600"><Building2 size={32} /></div>
              <div className="text-3xl md:text-5xl font-black text-slate-900 mb-1">
                {loading ? "..." : stats.schools}
              </div>
              <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Active Schools</div>
            </div>
            <div>
              <div className="flex justify-center mb-3 text-indigo-600"><Users size={32} /></div>
              <div className="text-3xl md:text-5xl font-black text-slate-900 mb-1">
                {loading ? "..." : stats.students}+
              </div>
              <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Students</div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-16 md:mt-24 text-left w-full">
          <AnimatedCard delay={0.2} className="p-8 rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black mb-3 text-slate-900">Enterprise Admin</h3>
            <p className="text-slate-600 font-medium">Manage students, track performance metrics, and assign curriculum modules through our secure B2B portal.</p>
          </AnimatedCard>

          <AnimatedCard delay={0.4} className="p-8 rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100">
              <Trophy className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black mb-3 text-slate-900">Gamified Hub</h3>
            <p className="text-slate-600 font-medium">Students enter a dedicated, distraction-free environment featuring XP tracking, leaderboards, and tech lessons.</p>
          </AnimatedCard>

          <AnimatedCard delay={0.6} className="p-8 rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black mb-3 text-slate-900">Data Security</h3>
            <p className="text-slate-600 font-medium">Strict tenant boundaries ensure your school's data remains private. Students only see their own school.</p>
          </AnimatedCard>
        </div>
      </div>

    </div>
  );
}
