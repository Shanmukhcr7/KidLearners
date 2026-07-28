"use client";

import { Building, GraduationCap, ArrowUpRight } from "lucide-react";

export default function AdminSchoolsAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">School Analytics</h2>
          <p className="text-sm text-slate-500 mt-1">Granular usage statistics broken down by school organization.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="border border-slate-300 rounded-lg p-2 text-sm bg-white font-medium shadow-sm w-64">
            <option>All Schools</option>
            <option>Springfield Elementary</option>
            <option>Oakridge High</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                <th className="px-6 py-4">School Organization</th>
                <th className="px-6 py-4 text-center">Active Students</th>
                <th className="px-6 py-4 text-center">Teachers</th>
                <th className="px-6 py-4 text-center">Avg Score</th>
                <th className="px-6 py-4 text-center">Completion Rate</th>
                <th className="px-6 py-4 text-right">View Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: "Springfield Elementary", students: 1204, teachers: 45, score: 88, completion: 76 },
                { name: "Oakridge High", students: 3450, teachers: 120, score: 82, completion: 65 },
                { name: "St. Jude Academy", students: 850, teachers: 32, score: 91, completion: 89 },
                { name: "Lincoln Middle School", students: 2100, teachers: 80, score: 78, completion: 55 },
              ].map((school, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Building size={20} />
                      </div>
                      <div className="font-bold text-slate-900">{school.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-slate-700">{school.students.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center font-medium text-slate-700">{school.teachers}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${school.score > 85 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {school.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-full max-w-[100px] bg-slate-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${school.completion}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-600">{school.completion}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 p-2 rounded-md hover:bg-blue-50 transition-colors">
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
