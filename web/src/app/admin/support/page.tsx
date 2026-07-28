"use client";

import { Search, Filter, MessageCircle, AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function AdminSupportPage() {
  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Support Tickets</h2>
          <p className="text-sm text-slate-500 mt-1">Resolve issues submitted by School Admins and Teachers.</p>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Ticket List Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-slate-200 flex flex-col bg-slate-50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search tickets..." className="w-full pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-0" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {[
              { id: "T-1042", subject: "Cannot access Python course", user: "John (Student)", status: "Open", time: "10m ago", priority: "High" },
              { id: "T-1041", subject: "Billing failed issue", user: "Admin (Springfield)", status: "Pending", time: "2h ago", priority: "Critical" },
              { id: "T-1040", subject: "How to add teachers?", user: "Admin (Oakridge)", status: "Closed", time: "1d ago", priority: "Low" },
            ].map((ticket, idx) => (
              <div key={idx} className={`p-4 border-b border-slate-200 cursor-pointer transition-colors ${idx === 0 ? 'bg-white border-l-4 border-l-blue-600' : 'hover:bg-white border-l-4 border-l-transparent'}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-slate-500">{ticket.id}</span>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock size={10} /> {ticket.time}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1 line-clamp-1">{ticket.subject}</h4>
                <p className="text-xs text-slate-500 mb-2">{ticket.user}</p>
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' : 
                    ticket.status === 'Closed' ? 'bg-slate-200 text-slate-600' : 'bg-yellow-100 text-yellow-700'
                  }`}>{ticket.status}</span>
                  {ticket.priority === 'Critical' && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">Critical</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Detail View */}
        <div className="flex-1 flex flex-col bg-white h-full">
          <div className="p-6 border-b border-slate-200 shrink-0">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold uppercase">Open</span>
                  <span className="text-sm font-bold text-slate-400">T-1042</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Cannot access Python course</h2>
              </div>
              <button className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-bold flex items-center gap-2">
                <CheckCircle size={16} /> Mark Resolved
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Users size={14} /> John Doe (Student)</span>
              <span className="flex items-center gap-1"><Mail size={14} /> john.doe@example.com</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {/* Original Message */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 flex items-center justify-center font-bold text-slate-500">J</div>
              <div className="bg-white border border-slate-200 p-4 rounded-xl rounded-tl-none shadow-sm flex-1">
                <div className="text-xs font-bold text-slate-400 mb-2">Today at 9:42 AM</div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Hi Support, <br/><br/>
                  I recently enrolled in the Intro to Python course but when I click on Module 1, it says I don't have permission. My teacher told me to contact you. Can you help?
                </p>
              </div>
            </div>

            {/* System Log */}
            <div className="flex justify-center">
              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-medium">Assigned to Support Agent Alex</span>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-white shrink-0">
            <div className="relative">
              <textarea 
                className="w-full border border-slate-300 rounded-xl p-4 pr-16 resize-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                rows={3} 
                placeholder="Type your reply to John..."
              ></textarea>
              <button className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
                <MessageCircle size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
