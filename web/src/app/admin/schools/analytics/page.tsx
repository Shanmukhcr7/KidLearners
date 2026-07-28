"use client";

import { useState, useEffect } from "react";
import { auth } from "@/utils/firebase";
import { Building, GraduationCap, Users, BarChart3, Loader2 } from "lucide-react";

export default function AdminSchoolsAnalyticsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/analytics/schools", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSchools(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-12 text-center text-slate-500"><Loader2 size={32} className="animate-spin mx-auto mb-4" /> Aggregating school data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Schools Performance Matrix</h2>
          <p className="text-sm text-slate-500 mt-1">Compare engagement and performance across all onboarded schools.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                <th className="px-6 py-4">School</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4">Teachers</th>
                <th className="px-6 py-4">Avg Health Score</th>
                <th className="px-6 py-4">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {schools.map((school) => (
                <tr key={school.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Building size={16} />
                      </div>
                      <span className="font-bold text-slate-900">{school.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <GraduationCap size={16} className="text-slate-400" />
                      {school.students.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Users size={16} className="text-slate-400" />
                      {school.teachers.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-2">
                        <div className={`h-2 rounded-full ${school.score > 80 ? 'bg-green-500' : school.score > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${school.score}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{school.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <BarChart3 size={16} className="text-slate-400" />
                      {school.completion}%
                    </div>
                  </td>
                </tr>
              ))}
              {schools.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-slate-500">No schools found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
