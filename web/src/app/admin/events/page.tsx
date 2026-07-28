"use client";

import { Calendar, Clock, Video, Users, Plus, MapPin } from "lucide-react";

export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Events</h2>
          <p className="text-sm text-slate-500 mt-1">Schedule and manage virtual webinars, live classes, and events.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus size={18} /> Schedule Event
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-4 overflow-x-auto">
          <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 shadow-sm">Upcoming</button>
          <button className="px-4 py-2 bg-transparent text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg">Past Events</button>
          <button className="px-4 py-2 bg-transparent text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg">Drafts</button>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            { title: "Intro to Python LIVE", type: "Webinar", date: "Oct 24, 2026", time: "10:00 AM EST", attendees: 145, status: "Published" },
            { title: "Global Spelling Bee Finals", type: "Competition", date: "Nov 02, 2026", time: "2:00 PM EST", attendees: 320, status: "Published" },
            { title: "Teacher Training Q4", type: "Workshop", date: "Nov 15, 2026", time: "9:00 AM EST", attendees: 45, status: "Draft" },
          ].map((event, idx) => (
            <div key={idx} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">Oct</span>
                  <span className="text-xl font-black text-indigo-900 leading-none">24</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1 flex items-center gap-2">
                    {event.title}
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                      event.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {event.status}
                    </span>
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5"><Clock size={16} /> {event.time}</div>
                    <div className="flex items-center gap-1.5"><Video size={16} /> Virtual Zoom</div>
                    <div className="flex items-center gap-1.5"><Users size={16} /> {event.attendees} Registered</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
                  Edit Details
                </button>
                <button className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
                  View Page
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
