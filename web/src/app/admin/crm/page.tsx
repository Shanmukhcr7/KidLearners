"use client";

import { useState, useEffect } from "react";
import { Search, Mail, Phone, Plus, Loader2 } from "lucide-react";
import { auth } from "@/utils/firebase";

interface Lead {
  id: string;
  schoolName: string;
  contactName: string;
  email: string;
  phone: string;
  stage: string;
  createdAt: string;
}

const STAGES = ["New Leads", "Contacted", "In Trial", "Converted"];

export default function AdminCrmPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newLead, setNewLead] = useState({
    schoolName: "",
    contactName: "",
    email: "",
    phone: "",
    stage: "New Leads"
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/crm/leads", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setLeads(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!newLead.schoolName || !newLead.contactName || !newLead.email) return;
    setCreating(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/crm/leads", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newLead)
      });
      if (res.ok) {
        setShowModal(false);
        setNewLead({ schoolName: "", contactName: "", email: "", phone: "", stage: "New Leads" });
        fetchLeads();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  }

  async function updateStage(id: string, stage: string) {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + `/crm/leads/${id}/stage`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ stage })
      });
      if (res.ok) {
        fetchLeads();
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) return <div className="p-12 text-center text-slate-500 flex flex-col items-center"><Loader2 size={32} className="animate-spin mb-4" /> Loading CRM...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">CRM & Leads</h2>
          <p className="text-sm text-slate-500 mt-1">Manage relationships with schools and track their onboarding pipeline.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add Lead
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter(l => l.stage === stage);
          return (
            <div key={stage} className="bg-slate-100 rounded-xl p-4 flex flex-col h-[600px] border border-slate-200 shadow-inner min-w-[280px]">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                {stage}
                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {stageLeads.length}
                </span>
              </h3>
              
              <div className="space-y-3 overflow-y-auto flex-1">
                {stageLeads.map((lead) => (
                  <div key={lead.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-blue-400 transition-colors group">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm text-slate-900">{lead.schoolName}</h4>
                      <select 
                        className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        value={lead.stage}
                        onChange={(e) => updateStage(lead.id, e.target.value)}
                      >
                        {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">{lead.contactName}</p>
                    <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                      <a href={`mailto:${lead.email}`} className="text-slate-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50"><Mail size={16} /></a>
                      {lead.phone && <a href={`tel:${lead.phone}`} className="text-slate-400 hover:text-green-600 p-1 rounded-md hover:bg-green-50"><Phone size={16} /></a>}
                      <div className="ml-auto text-[10px] font-bold text-slate-400 uppercase">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
                {stageLeads.length === 0 && (
                  <div className="text-center text-xs text-slate-400 py-4 border-2 border-dashed border-slate-200 rounded-lg">No leads in this stage</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">Add New Lead</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">School / Organization Name</label>
                <input 
                  type="text" 
                  value={newLead.schoolName}
                  onChange={e => setNewLead({...newLead, schoolName: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                  placeholder="e.g. Springfield High" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person</label>
                <input 
                  type="text" 
                  value={newLead.contactName}
                  onChange={e => setNewLead({...newLead, contactName: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                  placeholder="e.g. Principal Skinner" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={newLead.email}
                    onChange={e => setNewLead({...newLead, email: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input 
                    type="text" 
                    value={newLead.phone}
                    onChange={e => setNewLead({...newLead, phone: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Stage</label>
                <select 
                  value={newLead.stage}
                  onChange={e => setNewLead({...newLead, stage: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                >
                  {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2 justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreate}
                disabled={creating || !newLead.schoolName || !newLead.contactName || !newLead.email}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                Add Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
