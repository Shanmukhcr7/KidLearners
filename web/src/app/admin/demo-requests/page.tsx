"use client";

import { useEffect, useState } from "react";
import { auth } from "@/utils/firebase";
import { Mail, Calendar, User, Building2, ExternalLink } from "lucide-react";

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

  if (loading) {
    return <div className="p-8 text-slate-500">Loading demo requests...</div>;
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
              
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${req.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {req.status?.toUpperCase()}
                </span>
                <button className="px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors text-sm flex items-center gap-2">
                  Contact <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
