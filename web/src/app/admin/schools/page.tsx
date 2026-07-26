"use client";

import { Building2, Search, Plus, MoreVertical, Edit2, ShieldAlert, X } from "lucide-react";
import { useState, useEffect } from "react";
import { auth } from "@/utils/firebase";

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newSchool, setNewSchool] = useState({ name: "", domain: "", adminEmail: "" });

  useEffect(() => {
    async function fetchSchools() {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch("http://localhost:3001/admin/schools", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSchools(data.map((s: any) => ({
            name: s.name || s.id,
            domain: s.domain || "N/A",
            students: s.studentCount || 0,
            status: s.status || "Active",
            date: new Date(s.createdAt?._seconds * 1000 || Date.now()).toLocaleDateString(),
            pending: s.status === "pending"
          })));
        }
      } catch (err) {
        console.error("Failed to fetch schools", err);
      }
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchSchools();
    });
    return () => unsubscribe();
  }, []);

  const handleCreateSchool = () => {
    // Need backend POST endpoint for full functionality.
    // For now just close the modal.
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Schools</h2>
          <p className="text-sm text-slate-500 mt-1">Approve, edit, and suspend school accounts on the platform.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus size={18} /> Register New School
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Filters Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search schools by name or domain..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                <th className="px-6 py-4">School Details</th>
                <th className="px-6 py-4">Total Students</th>
                <th className="px-6 py-4">Plan Status</th>
                <th className="px-6 py-4">Registration Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {schools.map((school, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{school.name}</div>
                        <div className="text-sm text-slate-500">{school.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{school.students}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                      school.pending ? "bg-yellow-100 text-yellow-800 border border-yellow-200" : "bg-green-100 text-green-800 border border-green-200"
                    }`}>
                      {school.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{school.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50"><Edit2 size={18} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"><ShieldAlert size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Register New School</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">School Name</label>
                <input type="text" className="w-full border rounded-lg p-2" onChange={e => setNewSchool({...newSchool, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Domain</label>
                <input type="text" className="w-full border rounded-lg p-2" onChange={e => setNewSchool({...newSchool, domain: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Admin Email</label>
                <input type="email" className="w-full border rounded-lg p-2" onChange={e => setNewSchool({...newSchool, adminEmail: e.target.value})} />
              </div>
              <button onClick={handleCreateSchool} className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg mt-4">Create School</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
