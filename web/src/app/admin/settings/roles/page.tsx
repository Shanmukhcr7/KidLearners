"use client";

import { useState, useEffect } from "react";
import { auth } from "@/utils/firebase";
import { Users, ShieldCheck, Check, Loader2, Save } from "lucide-react";

export default function AdminRolesSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Custom roles config
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/settings/roles", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSettings({
          allowCustomRoles: data.allowCustomRoles !== false,
          teachersCanManageUsers: data.teachersCanManageUsers || false,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/settings/roles", {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(settings)
      });
      alert("Role settings saved!");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-500"><Loader2 size={32} className="animate-spin mx-auto mb-4" /> Loading roles...</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Roles & Permissions</h2>
          <p className="text-sm text-slate-500 mt-1">Configure what different user types can do on the platform.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><ShieldCheck size={20} className="text-blue-600" /> Policy Toggles</h3>
          <label className="flex items-center justify-between cursor-pointer border-b border-slate-100 pb-4">
            <div>
              <div className="font-bold text-slate-800 text-sm">Allow Custom Roles</div>
              <div className="text-xs text-slate-500">Enable creation of roles beyond standard types.</div>
            </div>
            <input type="checkbox" checked={settings.allowCustomRoles} onChange={e => setSettings({...settings, allowCustomRoles: e.target.checked})} className="w-5 h-5 text-blue-600 rounded" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="font-bold text-slate-800 text-sm">Teachers Can Manage Users</div>
              <div className="text-xs text-slate-500">Allow teachers to add/remove students from their school.</div>
            </div>
            <input type="checkbox" checked={settings.teachersCanManageUsers} onChange={e => setSettings({...settings, teachersCanManageUsers: e.target.checked})} className="w-5 h-5 text-blue-600 rounded" />
          </label>
        </div>
        
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Standard Roles Matrix</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center p-3 bg-white rounded border border-slate-200 shadow-sm">
              <span className="font-bold text-slate-800">Super Admin</span>
              <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded">All Permissions</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded border border-slate-200 shadow-sm">
              <span className="font-bold text-slate-800">School Admin</span>
              <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded">Manage Own School</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded border border-slate-200 shadow-sm">
              <span className="font-bold text-slate-800">Teacher</span>
              <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded">Content & Grading</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded border border-slate-200 shadow-sm">
              <span className="font-bold text-slate-800">Student</span>
              <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded">Learning Only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
