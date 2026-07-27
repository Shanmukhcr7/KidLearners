"use client";

import { useEffect, useState } from "react";
import { Users, Search, Mail, ShieldAlert, CheckCircle2, UserPlus, X, Edit2, Download, MoreVertical } from "lucide-react";
import { auth } from "@/utils/firebase";
import Link from "next/link";

export default function SchoolStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/schools/${schoolId}/students`, {
        headers: { Authorization: `Bearer ${tokenResult.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Student Directory</h2>
          <p className="text-sm text-slate-500 mt-1">Manage all students enrolled in your school.</p>
        </div>
        <Link href="/school-admin/students/add" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
          <UserPlus size={18} /> Add Students
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Filters Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, roll no, or email..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
          </div>
          <button className="hidden md:flex text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 px-3 py-2 rounded-lg text-sm font-medium items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* Advanced Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                <th className="px-6 py-4">Student Info</th>
                <th className="px-6 py-4">Class & Section</th>
                <th className="px-6 py-4">Gamification (XP/Lv)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">Loading directory...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No students enrolled yet.</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                          {student.name ? student.name.charAt(0).toUpperCase() : <Users size={18} />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{student.name || "Pending Student"}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail size={12} /> {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-700">{student.grade || "Unassigned"}</div>
                      <div className="text-xs text-slate-500">Sec: {student.section || "N/A"} | Roll: {student.rollNumber || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-indigo-700 text-sm">Level {student.level || 1}</div>
                      <div className="text-xs font-semibold text-amber-500">{student.xp || 0} XP</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800 border border-green-200 items-center gap-1">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-1">
                        <button className="text-slate-400 hover:text-indigo-600 transition-colors p-2 rounded hover:bg-indigo-50" title="Edit Student">
                          <Edit2 size={18} />
                        </button>
                        <button className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded hover:bg-red-50" title="Revoke Access">
                          <ShieldAlert size={18} />
                        </button>
                        <button className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded hover:bg-slate-100">
                          <MoreVertical size={18} />
                        </button>
                      </div>
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
