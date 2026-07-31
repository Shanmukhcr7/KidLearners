"use client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { toast } from "react-hot-toast";

import { useEffect, useState } from "react";
import { auth } from "@/utils/firebase";
import { Mail, Calendar, User, Building2, ExternalLink, Trash2, Check } from "lucide-react";

export default function DemoRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const token = await user.getIdToken();
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/demo-requests", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setRequests(data);
        }
      } catch (e) {
        console.error("Failed to fetch requests", e);
      } finally {
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  const fetchRequests = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/demo-requests", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const newStatus = currentStatus === 'pending' ? 'contacted' : 'pending';
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + `/demo-requests/${id}`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`Marked as ${newStatus}`);
        fetchRequests();
      } else {
        toast.error("Failed to update status");
      }
    } catch (e) {
      toast.error("Error updating status");
    }
  };

  const executeDelete = async (id: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + `/demo-requests/${id}/delete`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Request deleted");
        fetchRequests();
      } else {
        toast.error("Failed to delete");
      }
    } catch (e) {
      toast.error("Error deleting request");
    }
  };

  const handleDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-bold text-slate-900">Are you sure you want to delete this request?</p>
        <div className="flex justify-end gap-2 mt-2">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors" onClick={() => toast.dismiss(t.id)}>Cancel</button>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors" onClick={() => { toast.dismiss(t.id); executeDelete(id); }}>Delete</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Demo Requests</h1>
        <p className="text-slate-500 mt-2">Incoming requests from potential schools and districts.</p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-slate-500 font-medium">No demo requests found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map(req => (
            <div key={req.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1">
                    <Building2 size={16} /> {req.enrollment} students
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{req.schoolName}</h3>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-slate-400" />
                    {req.firstName} {req.lastName}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-slate-400" />
                    <a href={`mailto:${req.email}`} className="text-blue-600 hover:underline">{req.email}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" />
                    {new Date(req.createdAt?._seconds ? req.createdAt._seconds * 1000 : req.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${req.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {req.status?.toUpperCase()}
                </span>
                <button 
                  onClick={() => handleToggleStatus(req.id, req.status)}
                  className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-emerald-600 rounded-lg transition-colors"
                  title={req.status === 'pending' ? 'Mark Contacted' : 'Mark Pending'}
                >
                  <Check size={18} />
                </button>
                <a 
                  href={`mailto:${req.email}`}
                  className="p-2 bg-slate-50 text-slate-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors"
                  title="Contact"
                >
                  <ExternalLink size={18} />
                </a>
                <button 
                  onClick={() => handleDelete(req.id)}
                  className="p-2 bg-slate-50 text-slate-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                  title="Delete Request"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
