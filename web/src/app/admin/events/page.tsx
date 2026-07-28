"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Video, Users, Plus, MapPin, Loader2, Save } from "lucide-react";
import { auth } from "@/utils/firebase";

interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  attendees: number;
  status: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "Webinar",
    date: "",
    time: "",
    status: "Published"
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/events", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateEvent() {
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;
    setSubmitting(true);
    
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/events", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newEvent)
      });
      
      if (res.ok) {
        setShowCreateModal(false);
        setNewEvent({ title: "", type: "Webinar", date: "", time: "", status: "Published" });
        fetchEvents();
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
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Events</h2>
          <p className="text-sm text-slate-500 mt-1">Schedule and manage virtual webinars, live classes, and events.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Schedule Event
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-4 overflow-x-auto">
          <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 shadow-sm">All Events</button>
        </div>

        <div className="divide-y divide-slate-100 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-slate-500">
              <Loader2 className="animate-spin mb-4" size={24} />
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-slate-500">
              No events scheduled yet.
            </div>
          ) : events.map((event) => {
            const dateObj = new Date(event.date);
            const month = dateObj.toLocaleString('default', { month: 'short' });
            const day = dateObj.getDate();
            
            return (
              <div key={event.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">{month}</span>
                    <span className="text-xl font-black text-indigo-900 leading-none">{day}</span>
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
                      <div className="flex items-center gap-1.5"><Video size={16} /> Virtual ({event.type})</div>
                      <div className="flex items-center gap-1.5"><Users size={16} /> {event.attendees || 0} Registered</div>
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
            );
          })}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">Schedule New Event</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Event Title</label>
                <input 
                  type="text" 
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                  placeholder="e.g. Intro to Python LIVE" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                  <select 
                    value={newEvent.type}
                    onChange={e => setNewEvent({...newEvent, type: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                  >
                    <option>Webinar</option>
                    <option>Workshop</option>
                    <option>Competition</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select 
                    value={newEvent.status}
                    onChange={e => setNewEvent({...newEvent, status: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                  >
                    <option>Published</option>
                    <option>Draft</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={newEvent.date}
                    onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                  <input 
                    type="time" 
                    value={newEvent.time}
                    onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2 justify-end">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateEvent}
                disabled={submitting || !newEvent.title || !newEvent.date || !newEvent.time}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
