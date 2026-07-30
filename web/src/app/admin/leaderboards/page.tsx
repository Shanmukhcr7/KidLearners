"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, Star, ArrowUpRight } from "lucide-react";
import { auth } from "@/utils/firebase";

export default function AdminLeaderboardsPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/leaderboards/global", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Global Leaderboards</h2>
          <p className="text-sm text-slate-500 mt-1">View top performing students across all schools worldwide.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">School ID</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12"><LoadingSpinner /></td>
                </tr>
              ) : leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No students found.
                  </td>
                </tr>
              ) : (
                leaderboard.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold">
                        {student.rank === 1 ? <Trophy size={16} className="text-yellow-500" /> : 
                         student.rank === 2 ? <Medal size={16} className="text-gray-400" /> : 
                         student.rank === 3 ? <Medal size={16} className="text-amber-600" /> : 
                         student.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {student.schoolId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full flex items-center w-max gap-1">
                        <Star size={12} className="fill-blue-800" />
                        Level {student.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-green-600 flex items-center justify-end gap-1">
                      {student.xp} XP
                      <ArrowUpRight size={16} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
