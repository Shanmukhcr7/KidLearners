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
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/schools", {
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

  const handleCreateSchool = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/schools", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newSchool)
      });
      
      if (res.ok) {
        const data = await res.json();
        alert(`School ${data.school.name} created! Admin assigned: ${data.adminAssigned ? "Yes" : "No"}`);
        setShowModal(false);
        // Simply reload to fetch again
        window.location.reload();
      } else {
        alert("Failed to create school.");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating school.");
    }
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

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
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
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
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

        {/* Mobile Cards View */}
        <div className="md:hidden flex flex-col divide-y divide-slate-200">
          {schools.map((school, i) => (
            <div key={i} className="p-4 flex flex-col gap-4 bg-white hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-base">{school.name}</div>
                    <div className="text-sm text-slate-500">{school.domain}</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Status</div>
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                    school.pending ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                  }`}>
                    {school.status}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Students</div>
                  <div className="font-medium text-slate-700 text-sm">{school.students} enrolled</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <button className="flex-1 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2"><Edit2 size={16} /> Edit</button>
                <button className="flex-1 py-2.5 text-sm font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2"><ShieldAlert size={16} /> Suspend</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Register New School</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500"><X size={20} /></button>
            </div>
            <div className="space-y-4 relative">
              <div>
                <label className="block text-sm font-medium mb-1">School Name</label>
                <input type="text" className="w-full border rounded-lg p-2" onChange={e => setNewSchool({...newSchool, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Domain</label>
                <input type="text" className="w-full border rounded-lg p-2" onChange={e => setNewSchool({...newSchool, domain: e.target.value})} />
              </div>
              
              <EmailSearchInput 
                onSelect={(email) => setNewSchool({...newSchool, adminEmail: email})} 
              />
              
              <button onClick={handleCreateSchool} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg mt-4 transition-colors">Create School</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmailSearchInput({ onSelect }: { onSelect: (email: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 3) {
        searchUsers();
      } else {
        setResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + `/users/search?email=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">Admin Email (Search existing users)</label>
      <input 
        type="email" 
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSelect(e.target.value); // In case they want to type a brand new email
        }}
        onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
        className="w-full border rounded-lg p-2" 
        placeholder="Search by email..."
      />
      {loading && <div className="absolute right-3 top-9 text-xs text-slate-400">Searching...</div>}
      
      {showDropdown && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 shadow-lg rounded-lg overflow-hidden max-h-48 overflow-y-auto">
          {results.map(user => (
            <div 
              key={user.id} 
              className="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-0"
              onClick={() => {
                setQuery(user.email);
                onSelect(user.email);
                setShowDropdown(false);
              }}
            >
              <div className="font-bold text-sm text-slate-900">{user.email}</div>
              <div className="text-xs text-slate-500">{user.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
