"use client";

import { Navbar } from "@/components/ui/Navbar";
import Link from "next/link";
import { ArrowRight, BookOpen, Trophy, Image as ImageIcon, CheckCircle2, Users, Building2, Star } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [stats, setStats] = useState({ schools: 0, students: 0, modules: 120, satisfaction: 98 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/schools/stats")
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
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      <Navbar />

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm mb-8 border border-blue-100">
          <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
          Empowering schools with AI-driven education
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-[1.1] mb-6">
          The Next-Generation <span className="text-blue-600">LMS</span> for Modern Schools.
        </h1>
        
        <p className="text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
          A fully integrated platform that provides professional administration for teachers, while delivering a highly engaging, gamified learning experience for students.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/demo" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm shadow-blue-200 transition-all flex items-center gap-2 text-lg">
            Request a Demo <ArrowRight size={20} />
          </Link>
          <Link href="/courses" className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg border border-slate-200 transition-all flex items-center gap-2 text-lg">
            View Curriculum
          </Link>
        </div>
      </main>

      {/* Dynamic Stats Section */}
      <div className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 gap-8 text-center divide-x divide-slate-200">
          <div>
            <div className="flex justify-center mb-3 text-blue-600"><Building2 size={32} /></div>
            <div className="text-4xl font-extrabold text-slate-900 mb-1">
              {loading ? "..." : stats.schools}
            </div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Schools</div>
          </div>
          <div>
            <div className="flex justify-center mb-3 text-purple-600"><Users size={32} /></div>
            <div className="text-4xl font-extrabold text-slate-900 mb-1">
              {loading ? "..." : stats.students}+
            </div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Registered Students</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 text-left w-full">
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Enterprise School Admin</h3>
            <p className="text-slate-600">Manage students, track performance metrics, and assign curriculum modules through our secure B2B portal.</p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Gamified Student Hub</h3>
            <p className="text-slate-600">Students enter a dedicated, distraction-free environment featuring XP tracking, leaderboards, and interactive tech lessons.</p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Data Isolation & Security</h3>
            <p className="text-slate-600">Strict tenant boundaries ensure your school's data remains entirely private. Students only see their own school's curriculum.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
