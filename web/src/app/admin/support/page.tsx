"use client";

import { useState, useEffect } from "react";
import { Search, MessageCircle, Clock, CheckCircle, Users, Mail } from "lucide-react";
import { auth } from "@/utils/firebase";

interface Ticket {
  id: string;
  displayId: string;
  subject: string;
  message: string;
  userId: string;
  userEmail: string;
  status: string;
  priority: string;
  createdAt: string;
  replies: Array<{
    userId: string;
    userEmail: string;
    role: string;
    message: string;
    createdAt: string;
  }>;
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/support", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
        if (data.length > 0 && !selectedTicket) setSelectedTicket(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleReply() {
    if (!replyText.trim() || !selectedTicket) return;
    
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + `/support/${selectedTicket.id}/reply`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: replyText })
      });
      
      if (res.ok) {
        setReplyText("");
        fetchTickets(); // Refresh
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function markResolved(ticketId: string) {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + `/support/${ticketId}/status`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: "Closed" })
      });
      
      if (res.ok) {
        fetchTickets(); // Refresh
      }
    } catch (e) {
      console.error(e);
    }
  }

  const filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.displayId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update selectedTicket reference if tickets change
  useEffect(() => {
    if (selectedTicket) {
      const updated = tickets.find(t => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    }
  }, [tickets]);

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
              <input 
                type="text" 
                placeholder="Search tickets..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-0" 
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-slate-500">Loading tickets...</div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-4 text-center text-slate-500">No tickets found.</div>
            ) : (
              filteredTickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 border-b border-slate-200 cursor-pointer transition-colors ${selectedTicket?.id === ticket.id ? 'bg-white border-l-4 border-l-blue-600' : 'hover:bg-white border-l-4 border-l-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-500">{ticket.displayId}</span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock size={10} /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1 line-clamp-1">{ticket.subject}</h4>
                  <p className="text-xs text-slate-500 mb-2 truncate">{ticket.userEmail}</p>
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' : 
                      ticket.status === 'Closed' ? 'bg-slate-200 text-slate-600' : 'bg-yellow-100 text-yellow-700'
                    }`}>{ticket.status}</span>
                    {ticket.priority === 'Critical' && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">Critical</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ticket Detail View */}
        {selectedTicket ? (
          <div className="flex-1 flex flex-col bg-white h-full">
            <div className="p-6 border-b border-slate-200 shrink-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                      selectedTicket.status === 'Open' ? 'bg-blue-100 text-blue-800' : 
                      selectedTicket.status === 'Closed' ? 'bg-slate-200 text-slate-600' : 'bg-yellow-100 text-yellow-800'
                    }`}>{selectedTicket.status}</span>
                    <span className="text-sm font-bold text-slate-400">{selectedTicket.displayId}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedTicket.subject}</h2>
                </div>
                {selectedTicket.status !== 'Closed' && (
                  <button onClick={() => markResolved(selectedTicket.id)} className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-bold flex items-center gap-2">
                    <CheckCircle size={16} /> Mark Resolved
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Mail size={14} /> {selectedTicket.userEmail}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              {/* Original Message */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 flex items-center justify-center font-bold text-slate-500">
                  {selectedTicket.userEmail.charAt(0).toUpperCase()}
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-xl rounded-tl-none shadow-sm flex-1">
                  <div className="text-xs font-bold text-slate-400 mb-2">
                    {new Date(selectedTicket.createdAt).toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedTicket.message}
                  </p>
                </div>
              </div>

              {/* Replies */}
              {selectedTicket.replies?.map((reply, idx) => {
                const isSupportAgent = reply.role === 'super_admin' || reply.role === 'school_admin';
                return (
                  <div key={idx} className={`flex gap-4 ${isSupportAgent ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold ${
                      isSupportAgent ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {reply.userEmail.charAt(0).toUpperCase()}
                    </div>
                    <div className={`border p-4 shadow-sm flex-1 ${
                      isSupportAgent 
                        ? 'bg-blue-50 border-blue-200 rounded-xl rounded-tr-none' 
                        : 'bg-white border-slate-200 rounded-xl rounded-tl-none'
                    }`}>
                      <div className={`text-xs font-bold mb-2 flex justify-between ${isSupportAgent ? 'text-blue-500' : 'text-slate-400'}`}>
                        <span>{isSupportAgent ? 'Support Agent' : 'User'}</span>
                        <span>{new Date(reply.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {reply.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedTicket.status !== 'Closed' && (
              <div className="p-4 border-t border-slate-200 bg-white shrink-0">
                <div className="relative">
                  <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-4 pr-16 resize-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    rows={3} 
                    placeholder="Type your reply..."
                  ></textarea>
                  <button 
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-50"
                  >
                    <MessageCircle size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400 flex-col">
            <MessageCircle size={48} className="mb-4 opacity-50" />
            <p>Select a ticket to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
