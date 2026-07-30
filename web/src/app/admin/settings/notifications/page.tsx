import { toast } from "react-hot-toast";
"use client";

import { useState, useEffect } from "react";
import { auth } from "@/utils/firebase";
import { Bell, Mail, Smartphone, Save, Loader2 } from "lucide-react";

export default function AdminNotificationsSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/settings/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSettings({
          emailNewTicket: data.emailNewTicket !== false,
          emailNewLead: data.emailNewLead !== false,
          emailSystemError: data.emailSystemError !== false,
          pushNewAnnouncement: data.pushNewAnnouncement !== false,
          pushWeeklyDigest: data.pushWeeklyDigest !== false,
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
      await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/settings/notifications", {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(settings)
      });
      toast.success("Notification settings saved!");
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
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Notification Settings</h2>
          <p className="text-sm text-slate-500 mt-1">Configure email and push alerts for system events.</p>
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
          <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2"><Mail size={20} className="text-blue-500" /> Admin Email Alerts</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between border-b border-slate-100 pb-4 cursor-pointer">
              <div>
                <div className="font-bold text-slate-800 text-sm">New Support Ticket</div>
                <div className="text-xs text-slate-500">Send an email when a new high-priority support ticket is opened.</div>
              </div>
              <input type="checkbox" checked={settings.emailNewTicket} onChange={e => setSettings({...settings, emailNewTicket: e.target.checked})} className="w-5 h-5 text-blue-600 rounded" />
            </label>
            <label className="flex items-center justify-between border-b border-slate-100 pb-4 cursor-pointer">
              <div>
                <div className="font-bold text-slate-800 text-sm">New CRM Lead</div>
                <div className="text-xs text-slate-500">Notify sales when a new school signs up.</div>
              </div>
              <input type="checkbox" checked={settings.emailNewLead} onChange={e => setSettings({...settings, emailNewLead: e.target.checked})} className="w-5 h-5 text-blue-600 rounded" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-bold text-slate-800 text-sm">System Errors</div>
                <div className="text-xs text-slate-500">Alert administrators on backend errors or downtime.</div>
              </div>
              <input type="checkbox" checked={settings.emailSystemError} onChange={e => setSettings({...settings, emailSystemError: e.target.checked})} className="w-5 h-5 text-blue-600 rounded" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
