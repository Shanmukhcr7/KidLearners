"use client";

import { Download, FileText, Calendar, Filter } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Export Reports</h2>
          <p className="text-sm text-slate-500 mt-1">Generate and download CSV/PDF reports for platform data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Student Performance", desc: "Detailed grades and completion metrics across all courses.", type: "CSV / Excel" },
          { title: "Financial & Billing", desc: "MRR, invoices, and subscription statuses for all schools.", type: "CSV / Excel" },
          { title: "Platform Usage", desc: "Login frequency, session durations, and active user counts.", type: "PDF Report" },
          { title: "Audit Logs", desc: "Security events, role changes, and system configurations.", type: "CSV (Encrypted)" },
        ].map((report, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-blue-300 transition-colors group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{report.title}</h3>
            <p className="text-sm text-slate-500 mb-4 h-10">{report.desc}</p>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-xs font-bold text-slate-400 uppercase">{report.type}</span>
              <button className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <Download size={16} /> Generate
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 mb-4">Custom Report Builder</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Data Source</label>
            <select className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50">
              <option>Users</option>
              <option>Courses</option>
              <option>Schools</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Date Range</label>
            <input type="date" className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Format</label>
            <select className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50">
              <option>CSV</option>
              <option>JSON</option>
              <option>PDF</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-colors">
              Build & Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
