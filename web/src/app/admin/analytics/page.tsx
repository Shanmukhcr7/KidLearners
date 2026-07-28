"use client";

import { useState, useEffect } from "react";
import { auth } from "@/utils/firebase";
import { Users, BookOpen, Building, TrendingUp, Clock, Activity, Loader2 } from "lucide-react";

export default function AdminGlobalAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/analytics/global", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setData(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-12 text-center text-slate-500"><Loader2 size={32} className="animate-spin mx-auto mb-4" /> Aggregating global data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Global Analytics</h2>
          <p className="text-sm text-slate-500 mt-1">Platform-wide statistics and usage metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Users size={20} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{data.activeUsersTrend}</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{data.totalUsers.toLocaleString()}</h3>
          <p className="text-sm font-medium text-slate-500">Total Users</p>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <Building size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{data.totalSchools}</h3>
          <p className="text-sm font-medium text-slate-500">Active Schools</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <BookOpen size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{data.totalCourses}</h3>
          <p className="text-sm font-medium text-slate-500">Total Courses Published</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
              <Activity size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{data.dailyLogins.toLocaleString()}</h3>
          <p className="text-sm font-medium text-slate-500">Daily Active Logins</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm h-80 flex flex-col items-center justify-center text-slate-400">
          <TrendingUp size={48} className="mb-4 text-slate-200" />
          <p className="font-medium text-sm">Growth Chart Visualization</p>
          <p className="text-xs">Integrate Recharts here</p>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-center">
          <h3 className="font-bold text-lg text-slate-900 mb-6">Engagement Overview</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">Course Completion Rate</span>
                <span className="font-bold text-slate-900">68%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">Average Session Duration</span>
                <span className="font-bold text-slate-900">{data.avgSessionTime}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
