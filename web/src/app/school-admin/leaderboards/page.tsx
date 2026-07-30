"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, Star, ArrowUpRight } from "lucide-react";
import { auth } from "@/utils/firebase";

export default function SchoolLeaderboardsPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;
      
      const tokenResult = await user.getIdTokenResult();
      const schoolId = tokenResult.claims.schoolId;
      
      if (!schoolId) {
        console.error("No schoolId found on admin token");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/leaderboards/school/${schoolId}`, {
        headers: { Authorization: `Bearer ${tokenResult.token}` }
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
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">School Leaderboard</h2>
          <p className="text-sm text-slate-500 mt-1">Top performing students within your school.</p>
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
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12"><LoadingSpinner /></td>
                </tr>
              ) : leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No students have earned XP yet.
                  </td>
                </tr>
              ) : (
                leaderboard.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                        {student.rank === 1 ? <Trophy size={16} className="text-yellow-500" /> : 
                         student.rank === 2 ? <Medal size={16} className="text-gray-400" /> : 
                         student.rank === 3 ? <Medal size={16} className="text-amber-600" /> : 
                         student.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                      {student.name || "Pending Student"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full flex items-center w-max gap-1">
                        <Star size={12} className="fill-indigo-800" />
                        Level {student.level || 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-emerald-600 flex items-center justify-end gap-1">
                      {student.xp || 0} XP
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
