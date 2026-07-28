"use client";

import { BarChart3, TrendingUp, Users, BookOpen, Clock, Activity } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Global Analytics</h2>
          <p className="text-sm text-slate-500 mt-1">Platform-wide statistics and usage trends.</p>
        </div>
        <select className="border border-slate-300 rounded-lg p-2 text-sm bg-white font-medium shadow-sm">
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
          <option>Year to Date</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Active Users", value: "14,284", trend: "+12%", icon: <Users size={20} className="text-blue-600" /> },
          { label: "Course Completions", value: "3,892", trend: "+24%", icon: <BookOpen size={20} className="text-green-600" /> },
          { label: "Avg Session Time", value: "24m 12s", trend: "+5%", icon: <Clock size={20} className="text-purple-600" /> },
          { label: "Daily Logins", value: "8,941", trend: "-2%", icon: <Activity size={20} className="text-orange-600" /> }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                {stat.icon}
              </div>
              <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">{stat.label}</h3>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <div className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[400px] flex flex-col">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-600" /> Active Users Trend
          </h3>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p className="text-slate-400 font-medium">Chart Visualization Placeholder (e.g. Recharts/ChartJS)</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-600" /> Top Performing Schools
          </h3>
          <div className="space-y-4">
            {[
              { name: "Springfield Elementary", score: 98 },
              { name: "Oakridge High", score: 94 },
              { name: "St. Jude Academy", score: 89 },
              { name: "Lincoln Middle School", score: 85 },
              { name: "Washington Tech", score: 82 }
            ].map((school, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-slate-700">{idx + 1}. {school.name}</span>
                  <span className="text-slate-500 font-medium">{school.score}% Engagement</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${school.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
