"use client";

import { useState, useEffect } from "react";
import { auth } from "@/utils/firebase";
import { Check, X, Search, Globe, Mail, Building, Clock } from "lucide-react";

interface SchoolRequest {
  id: string;
  name: string;
  domain: string;
  adminEmail: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  message?: string;
}

export default function AdminSchoolsRequestsPage() {
  const [requests, setRequests] = useState<SchoolRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/schools/onboarding/requests", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleAction = async (id: string, action: "approve" | "reject") => {
    if (!confirm(`Are you sure you want to ${action} this request?`)) return;
    setProcessingId(id);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + `/schools/onboarding/requests/${id}/${action}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchRequests();
      } else {
        alert(`Failed to ${action} request`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading requests...</div>;

  const pendingCount = requests.filter(r => r.status === "Pending").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Onboarding Requests</h2>
          <p className="text-sm text-slate-500 mt-1">Review and approve schools applying to join the platform.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold text-sm">
          {pendingCount} Pending Request{pendingCount !== 1 && 's'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
            No onboarding requests found.
          </div>
        ) : requests.map(req => (
          <div key={req.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-bold">
                  {req.name.charAt(0).toUpperCase()}
                </div>
                <span className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-full ${
                  req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  req.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {req.status}
                </span>
              </div>
              
              <h3 className="font-bold text-lg text-slate-900 mb-4">{req.name}</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Globe size={16} className="text-slate-400" />
                  <span>{req.domain}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  <a href={`mailto:${req.adminEmail}`} className="text-blue-600 hover:underline">{req.adminEmail}</a>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Clock size={16} className="text-slate-400" />
                  <span>Applied {new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              {req.message && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-700 italic border border-slate-100">
                  "{req.message}"
                </div>
              )}
            </div>

            {req.status === 'Pending' && (
              <div className="grid grid-cols-2 border-t border-slate-200 divide-x divide-slate-200">
                <button 
                  onClick={() => handleAction(req.id, 'reject')}
                  disabled={processingId === req.id}
                  className="p-3 text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <X size={16} /> Reject
                </button>
                <button 
                  onClick={() => handleAction(req.id, 'approve')}
                  disabled={processingId === req.id}
                  className="p-3 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Check size={16} /> Approve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
