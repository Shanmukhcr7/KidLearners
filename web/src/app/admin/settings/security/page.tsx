import { toast } from "react-hot-toast";
"use client";

import { useState, useEffect } from "react";
import { auth } from "@/utils/firebase";
import { Settings, Shield, Globe, Lock, Save, Loader2 } from "lucide-react";

export default function AdminSecuritySettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/settings/security", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSettings({
          require2fa: data.require2fa || false,
          passwordExpirationDays: data.passwordExpirationDays || 90,
          sessionTimeoutMins: data.sessionTimeoutMins || 60,
          allowedIpRanges: data.allowedIpRanges || "",
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
      await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/settings/security", {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(settings)
      });
      toast.success("Security settings saved!");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-500 flex flex-col items-center"><Loader2 size={32} className="animate-spin mb-4" /> Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Security Settings</h2>
          <p className="text-sm text-slate-500 mt-1">Configure global platform security and access policies.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2"><Shield size={20} className="text-blue-600" /> Authentication</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="font-bold text-slate-800 text-sm">Require 2FA for Admins</div>
                <div className="text-xs text-slate-500">Force all Super Admins and School Admins to use 2-Factor Authentication.</div>
              </div>
              <input type="checkbox" checked={settings.require2fa} onChange={e => setSettings({...settings, require2fa: e.target.checked})} className="w-5 h-5 text-blue-600 rounded" />
            </label>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="font-bold text-slate-800 text-sm">Password Expiration (Days)</div>
                <div className="text-xs text-slate-500">Force password resets after this many days. 0 to disable.</div>
              </div>
              <input type="number" value={settings.passwordExpirationDays} onChange={e => setSettings({...settings, passwordExpirationDays: parseInt(e.target.value) || 0})} className="border border-slate-300 rounded p-1.5 w-20 text-center" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 text-sm">Session Timeout (Minutes)</div>
                <div className="text-xs text-slate-500">Automatically log out inactive users.</div>
              </div>
              <input type="number" value={settings.sessionTimeoutMins} onChange={e => setSettings({...settings, sessionTimeoutMins: parseInt(e.target.value) || 0})} className="border border-slate-300 rounded p-1.5 w-20 text-center" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2"><Globe size={20} className="text-slate-600" /> Network Restrictions</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-800 text-sm mb-1">Allowed IP Ranges (CIDR)</label>
              <p className="text-xs text-slate-500 mb-2">Comma separated list of IP addresses allowed to access the admin portal. Leave blank to allow all.</p>
              <input type="text" value={settings.allowedIpRanges} onChange={e => setSettings({...settings, allowedIpRanges: e.target.value})} className="w-full border border-slate-300 rounded p-2 text-sm" placeholder="e.g. 192.168.1.0/24, 10.0.0.0/8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
