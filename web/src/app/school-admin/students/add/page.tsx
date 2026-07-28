"use client";

import { useState, useEffect } from "react";
import { Search, Link as LinkIcon, Copy, Mail, PlusCircle, CheckCircle2 } from "lucide-react";
import { auth } from "@/utils/firebase";

export default function AddStudentsPage() {
  const [activeTab, setActiveTab] = useState<"search" | "link" | "bulk">("search");
  
  // Search State
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Invite Link State
  const [inviteLink, setInviteLink] = useState("");
  const [limit, setLimit] = useState(50);
  const [expiry, setExpiry] = useState(7);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Debounced Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 3) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  async function performSearch() {
    setIsSearching(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/users/search?email=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  }

  async function handleAddUser(userEmail: string) {
    try {
      const token = await auth.currentUser?.getIdToken();
      // We can reuse the invite endpoint for direct manual adding if it accepts email
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/users/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: userEmail })
      });
      if (res.ok) {
        alert("Student added successfully!");
        setQuery("");
      } else {
        alert("Failed to add student.");
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function generateInviteLink() {
    setGenerating(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/schools/invites/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ limit, expiryDays: expiry })
      });
      if (res.ok) {
        const data = await res.json();
        // Construct the full URL that a student would click
        const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        setInviteLink(`${origin}/join/${data.token}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error generating link.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Add Students</h2>
        <p className="text-sm text-slate-500 mt-1">Enroll new students into your school's LMS.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50">
          <TabButton active={activeTab === "search"} onClick={() => setActiveTab("search")} icon={<Search size={16} />} label="Search & Add" />
          <TabButton active={activeTab === "link"} onClick={() => setActiveTab("link")} icon={<LinkIcon size={16} />} label="Invite Link" />
          <TabButton active={activeTab === "bulk"} onClick={() => setActiveTab("bulk")} icon={<PlusCircle size={16} />} label="Bulk CSV" disabled />
        </div>

        <div className="p-6 md:p-8">
          {activeTab === "search" && (
            <div className="space-y-6">
              <div className="max-w-xl relative">
                <label className="block text-sm font-bold text-slate-700 mb-2">Search User by Email</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                      if (searchResults.length > 0) setIsSearching(false); // Just to ensure dropdown logic
                    }}
                    placeholder="student@example.com..." 
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  />
                  {isSearching && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-indigo-600 font-bold">Searching...</div>}
                </div>
                
                {/* Dropdown Recommendations */}
                {query.length >= 3 && searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                    {searchResults.map((user) => (
                      <div 
                        key={user.id} 
                        className="flex items-center justify-between p-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                        onClick={() => {
                          setQuery(user.email);
                          setSearchResults([]); // Close dropdown
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xs">
                            {user.name ? user.name.charAt(0).toUpperCase() : <Mail size={14} />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-900">{user.email}</div>
                            <div className="text-xs text-slate-500">{user.name || "Unknown Name"}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {query.length >= 3 && !isSearching && searchResults.length === 0 && (
                  <div className="absolute z-10 w-full mt-1 p-4 bg-white border border-slate-200 shadow-xl rounded-xl text-center text-sm text-slate-500">
                    No users found matching "{query}". You can still send an invite.
                  </div>
                )}
              </div>

              <div className="max-w-xl pt-2">
                <button 
                  onClick={() => handleAddUser(query)} 
                  disabled={!query.includes('@')}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <PlusCircle size={18} />
                  Add or Invite Student
                </button>
              </div>
            </div>
          )}

          {activeTab === "link" && (
            <div className="space-y-8 max-w-xl">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Generate Invite Link</h3>
                <p className="text-sm text-slate-500">Create a secure, trackable URL that students can click to automatically join your school.</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Usage Limit</label>
                  <input type="number" value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-600" />
                  <p className="text-xs text-slate-500 mt-1">Max students who can use this.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Expiry (Days)</label>
                  <input type="number" value={expiry} onChange={(e) => setExpiry(Number(e.target.value))} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-600" />
                  <p className="text-xs text-slate-500 mt-1">Link will expire after these days.</p>
                </div>
              </div>

              <button 
                onClick={generateInviteLink}
                disabled={generating}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-colors"
              >
                {generating ? "Generating..." : "Generate Link"}
              </button>

              {inviteLink && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-green-800 font-bold text-sm">
                    <CheckCircle2 size={16} /> Link generated successfully!
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="text" readOnly value={inviteLink} className="flex-1 bg-white border border-green-200 rounded-lg p-2.5 text-sm text-slate-600 outline-none" />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(inviteLink);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="p-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "bulk" && (
            <div className="text-center py-12">
              <p className="text-slate-500 mb-4">Bulk CSV upload is coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, disabled = false }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold transition-all border-b-2 ${
        active 
          ? "border-indigo-600 text-indigo-600 bg-white" 
          : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {icon}
      {label}
    </button>
  );
}
