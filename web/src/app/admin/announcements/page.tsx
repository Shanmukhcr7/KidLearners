"use client";

import { useState, useEffect } from "react";
import { Megaphone, Send, Clock, Plus, Users, Loader2 } from "lucide-react";
import { auth } from "@/utils/firebase";

interface Announcement {
  id: string;
  subject: string;
  message: string;
  audience: string;
  status: string;
  createdAt: string;
  authorRole: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [audience, setAudience] = useState("All Users");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/announcements", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(isScheduled: boolean = false) {
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/announcements", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          subject, 
          message, 
          audience,
          isScheduled
        })
      });
      
      if (res.ok) {
        setSubject("");
        setMessage("");
        fetchAnnouncements();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Announcements</h2>
          <p className="text-sm text-slate-500 mt-1">Broadcast messages to all users, specific schools, or roles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center">
              <Loader2 className="animate-spin mb-4" size={24} />
              Loading history...
            </div>
          ) : announcements.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 shadow-sm">
              No announcements sent yet.
            </div>
          ) : announcements.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  <Megaphone className={item.audience === 'All Users' ? 'text-blue-500' : 'text-green-500'} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{item.subject}</h3>
                  <p className="text-sm text-slate-700 mb-3 whitespace-pre-wrap">{item.message}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1"><Users size={14} /> {item.audience}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-full whitespace-nowrap self-start ${
                item.status === 'Sent' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[500px] sticky top-6">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-900">Quick Draft</h3>
          </div>
          <div className="p-4 flex-1 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Audience</label>
              <select 
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50"
              >
                <option>All Users</option>
                <option>School Admins Only</option>
                <option>Teachers Only</option>
                <option>Students Only</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Subject</label>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                placeholder="e.g. Server Maintenance" 
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Message</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm flex-1 resize-none" 
                placeholder="Type your announcement here..."
              ></textarea>
            </div>
          </div>
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
            <button 
              onClick={() => handleSend(true)}
              disabled={submitting || !subject || !message}
              className="flex-1 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              Schedule
            </button>
            <button 
              onClick={() => handleSend(false)}
              disabled={submitting || !subject || !message}
              className="flex-1 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg flex justify-center items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              Send Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
