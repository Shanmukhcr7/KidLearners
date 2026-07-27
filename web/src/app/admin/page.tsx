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

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Active Schools" value={loading ? "..." : stats.schools.toString()} change="Real-time" icon={<Building2 size={24} />} />
        <StatCard title="Total Students" value={loading ? "..." : stats.students.toString()} change="Real-time" icon={<Users size={24} />} />
        <StatCard title="Monthly MRR" value={`$${stats.mrr}`} change="0%" icon={<CreditCard size={24} />} />
        <StatCard title="System Health" value={`${stats.health}%`} change="All Systems Operational" icon={<Activity size={24} />} />
      </div>

      {/* Platform Activity */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Recent School Signups (Needs Approval)</h3>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All Applications</button>
        </div>
        <div className="p-6 text-center text-slate-500 py-12">
          No pending school registrations at this time.
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon }: { title: string; value: string; change: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <h4 className="text-3xl font-black text-slate-900">{value}</h4>
        <p className="text-sm font-bold text-slate-500 mt-1">{title}</p>
        <p className="text-xs font-medium text-green-600 mt-2">{change}</p>
      </div>
    </div>
  );
}
