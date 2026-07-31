"use client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { toast } from "react-hot-toast";

import { Users, Search, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import { auth } from "@/utils/firebase";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchUsers();
    });
    return () => unsubscribe();
  }, []);

  const handleRoleChange = async (uid: string, newRole: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/users/role", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ uid, role: newRole })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === uid ? { ...u, role: newRole } : u));
        toast.success("Role updated successfully! Note: The user may need to re-login to see changes.");
      } else {
        toast.error("Failed to update role");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating role");
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Users</h2>
          <p className="text-sm text-slate-500 mt-1">View all registered users and manage their access roles.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Filters Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4">XP Level</th>
                <th className="px-6 py-4">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12"><LoadingSpinner /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-slate-500">No users found.</td></tr>
              ) : (
                users.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold shrink-0">
                          {u.name ? u.name[0].toUpperCase() : <Users size={20} />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{u.name || "Unknown"}</div>
                          <div className="text-sm text-slate-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                        u.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 
                        u.role === 'school_admin' ? 'bg-blue-100 text-blue-800' : 
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {u.role || "user"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      Lvl {u.level || 1} ({u.xp || 0} XP)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select 
                        className="border border-slate-300 rounded p-1 text-sm bg-white"
                        value={u.role || "user"}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="student">Student</option>
                        <option value="school_admin">School Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden flex flex-col divide-y divide-slate-200">
          {loading ? (
            <LoadingSpinner />
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No users found.</div>
          ) : (
            users.map((u, i) => (
              <div key={i} className="p-4 flex flex-col gap-4 bg-white hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold shrink-0 text-lg">
                    {u.name ? u.name[0].toUpperCase() : <Users size={24} />}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-base">{u.name || "Unknown"}</div>
                    <div className="text-sm text-slate-500">{u.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-500">Lvl {u.level || 1}</div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-xs text-slate-500">Role & Access</div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                      u.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 
                      u.role === 'school_admin' ? 'bg-blue-100 text-blue-800' : 
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {u.role || "user"}
                    </span>
                    <select 
                      className="border border-slate-300 rounded p-1.5 text-sm bg-white font-medium"
                      value={u.role || "user"}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="student">Student</option>
                      <option value="school_admin">School Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
