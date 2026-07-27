"use client";

import { useEffect, useState } from "react";
import { Building2, Users, CreditCard, Activity } from "lucide-react";
import { auth } from "@/utils/firebase";

export default function SuperAdminDashboardPage() {
  const [stats, setStats] = useState({ schools: 0, students: 0, mrr: 0, health: 100 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    }
    
    // Wait for auth to initialize
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchStats();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Platform Overview</h2>
        <p className="text-sm text-slate-500 mt-1">High-level metrics across the entire KidLearners platform.</p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Schools" value={loading ? "..." : stats.schools.toString()} change="From database" icon={<Building2 size={20} />} />
        <StatCard title="Pending Requests" value="0" change="No pending" icon={<Activity size={20} />} />
        <StatCard title="Total Students" value={loading ? "..." : stats.students.toString()} change="From database" icon={<Users size={20} />} />
        <StatCard title="Active Today" value="0" change="Data syncing..." icon={<Users size={20} />} />
        <StatCard title="Total Courses" value="0" change="Awaiting data" icon={<Building2 size={20} />} />
        <StatCard title="Total Exams" value="0" change="Awaiting data" icon={<CreditCard size={20} />} />
        <StatCard title="Certificates" value="0" change="Awaiting data" icon={<Activity size={20} />} />
        <StatCard title="Platform Uptime" value={`${stats.health}%`} change="Operational" icon={<Activity size={20} />} />
      </div>

      {/* Graphs Section Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Student & School Growth</h3>
          </div>
          <div className="h-64 bg-slate-50 flex items-center justify-center border-b border-slate-100">
             <span className="text-slate-400 font-bold bg-white px-4 py-2 rounded shadow-sm border border-slate-200">No chart data available yet</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Course Completion Rates</h3>
          </div>
          <div className="h-64 bg-slate-50 flex items-center justify-center border-b border-slate-100">
             <span className="text-slate-400 font-bold bg-white px-4 py-2 rounded shadow-sm border border-slate-200">No chart data available yet</span>
          </div>
        </div>
      </div>

      {/* Recent Activity and Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recent Activities</h3>
          </div>
          <div className="p-8 text-center text-slate-500 text-sm">
            No recent activity recorded.
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">System Alerts & Notifications</h3>
          </div>
          <div className="p-8 text-center text-slate-500 text-sm">
            No system alerts at this time.
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon }: { title: string; value: string; change: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs font-bold text-slate-500 uppercase">{title}</p>
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <h4 className="text-2xl font-black text-slate-900">{value}</h4>
        <p className="text-xs font-medium text-green-600 mt-1">{change}</p>
      </div>
    </div>
  );
}
