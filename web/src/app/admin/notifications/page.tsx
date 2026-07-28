"use client";

import { Bell, Mail, Smartphone, Settings } from "lucide-react";

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Notification Rules</h2>
          <p className="text-sm text-slate-500 mt-1">Configure automated email, push, and in-app notifications.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
              <th className="px-6 py-4">Trigger Event</th>
              <th className="px-6 py-4 text-center">In-App</th>
              <th className="px-6 py-4 text-center">Email</th>
              <th className="px-6 py-4 text-center">Push (Mobile)</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: "New Course Assignment", inApp: true, email: true, push: true },
              { name: "Assignment Graded", inApp: true, email: false, push: true },
              { name: "Student Enrolls (Admin Alert)", inApp: true, email: true, push: false },
              { name: "Daily Login Reminder", inApp: false, email: false, push: true },
              { name: "Billing Failed (Super Admin)", inApp: true, email: true, push: true },
            ].map((rule, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800 text-sm">{rule.name}</td>
                <td className="px-6 py-4 text-center">
                  <input type="checkbox" defaultChecked={rule.inApp} className="w-4 h-4 text-blue-600 rounded" />
                </td>
                <td className="px-6 py-4 text-center">
                  <input type="checkbox" defaultChecked={rule.email} className="w-4 h-4 text-blue-600 rounded" />
                </td>
                <td className="px-6 py-4 text-center">
                  <input type="checkbox" defaultChecked={rule.push} className="w-4 h-4 text-blue-600 rounded" />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50"><Settings size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
