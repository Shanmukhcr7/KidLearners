"use client";

import { useEffect, useState } from "react";
import { Users, BookOpen, Trophy, ArrowUpRight } from "lucide-react";
import { auth } from "@/utils/firebase";

export default function SchoolAdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    averageXp: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyStats() {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/schools/my-stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMyStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2">Welcome to your school's command center.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="Total Enrolled Students" 
          value={loading ? "..." : stats.totalStudents.toString()} 
          icon={<Users size={24} />}
          trend="+12% this month"
          color="bg-blue-600"
          lightColor="bg-blue-50"
          textColor="text-blue-600"
        />
        <KPICard 
          title="Active Courses" 
          value={loading ? "..." : stats.activeCourses.toString()} 
          icon={<BookOpen size={24} />}
          trend="3 new additions"
          color="bg-purple-600"
          lightColor="bg-purple-50"
          textColor="text-purple-600"
        />
        <KPICard 
          title="Average Student XP" 
          value={loading ? "..." : stats.averageXp.toString()} 
          icon={<Trophy size={24} />}
          trend="+85 XP this week"
          color="bg-amber-500"
          lightColor="bg-amber-50"
          textColor="text-amber-600"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                <Users size={24} />
              </div>
              <span className="font-semibold text-slate-700">Invite Students</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                <BookOpen size={24} />
              </div>
              <span className="font-semibold text-slate-700">Assign Course</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Leaderboard Top Performers</h3>
          <div className="space-y-4">
             {/* We will fetch real activity here later, placeholder for now */}
             <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">A</div>
                 <div>
                   <div className="font-bold text-sm text-slate-900">Alex M.</div>
                   <div className="text-xs text-slate-500">Completed "Intro to Robotics"</div>
                 </div>
               </div>
               <span className="text-sm font-bold text-amber-500">+150 XP</span>
             </div>
             <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">S</div>
                 <div>
                   <div className="font-bold text-sm text-slate-900">Sarah K.</div>
                   <div className="text-xs text-slate-500">Ace Exam: "Python Basics"</div>
                 </div>
               </div>
               <span className="text-sm font-bold text-amber-500">+300 XP</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, trend, color, lightColor, textColor }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl ${lightColor} ${textColor} flex items-center justify-center shadow-inner`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-600">
        <ArrowUpRight size={16} />
        {trend}
      </div>
    </div>
  );
}
