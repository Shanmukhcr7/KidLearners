"use client";

import { Megaphone, Send, Clock, Plus, Users } from "lucide-react";

export default function AdminAnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Announcements</h2>
          <p className="text-sm text-slate-500 mt-1">Broadcast messages to all users, specific schools, or roles.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus size={18} /> New Announcement
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[
            { title: "Platform Maintenance Notice", target: "All Users", date: "Today, 10:00 AM", status: "Sent", icon: <Megaphone className="text-blue-500" /> },
            { title: "New Python Course Available!", target: "Students", date: "Yesterday, 2:30 PM", status: "Sent", icon: <Megaphone className="text-green-500" /> },
            { title: "Q3 Billing Reminder", target: "School Admins", date: "Oct 15, 2026", status: "Scheduled", icon: <Clock className="text-orange-500" /> }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1"><Users size={14} /> {item.target}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {item.date}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                item.status === 'Sent' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-900">Quick Draft</h3>
          </div>
          <div className="p-4 flex-1 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Audience</label>
              <select className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50">
                <option>All Users</option>
                <option>School Admins Only</option>
                <option>Teachers Only</option>
                <option>Students Only</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Subject</label>
              <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-sm" placeholder="e.g. Server Maintenance" />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Message</label>
              <textarea className="w-full border border-slate-300 rounded-lg p-2 text-sm flex-1 resize-none" placeholder="Type your announcement here..."></textarea>
            </div>
          </div>
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
            <button className="flex-1 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50">Schedule</button>
            <button className="flex-1 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg flex justify-center items-center gap-2 hover:bg-blue-700"><Send size={16} /> Send Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
