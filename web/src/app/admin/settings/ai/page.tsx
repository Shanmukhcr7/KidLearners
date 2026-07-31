"use client";
import { toast } from "react-hot-toast";

import { useState, useEffect } from "react";
import { auth } from "@/utils/firebase";
import { Sparkles, Save, Loader2, MessageSquare, Zap } from "lucide-react";

export default function AdminAISettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/settings/ai", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSettings({
          enableTutor: data.enableTutor !== false,
          enableQuestionGeneration: data.enableQuestionGeneration !== false,
          model: data.model || "gpt-4o",
          systemPrompt: data.systemPrompt || "You are a helpful teaching assistant for children.",
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
      await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/settings/ai", {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(settings)
      });
      toast.success("AI settings saved!");
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
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">AI & Assistant Settings</h2>
          <p className="text-sm text-slate-500 mt-1">Manage AI models, prompts, and feature toggles.</p>
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
          <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2"><Sparkles size={20} className="text-purple-600" /> Features</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between border-b border-slate-100 pb-4 cursor-pointer">
              <div>
                <div className="font-bold text-slate-800 text-sm flex items-center gap-2"><MessageSquare size={16}/> AI Chat Tutor</div>
                <div className="text-xs text-slate-500">Allow students to chat with the AI teaching assistant.</div>
              </div>
              <input type="checkbox" checked={settings.enableTutor} onChange={e => setSettings({...settings, enableTutor: e.target.checked})} className="w-5 h-5 text-purple-600 rounded" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-bold text-slate-800 text-sm flex items-center gap-2"><Zap size={16}/> Auto-Generate Quizzes</div>
                <div className="text-xs text-slate-500">Allow teachers to auto-generate questions using AI.</div>
              </div>
              <input type="checkbox" checked={settings.enableQuestionGeneration} onChange={e => setSettings({...settings, enableQuestionGeneration: e.target.checked})} className="w-5 h-5 text-purple-600 rounded" />
            </label>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-4">Model Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-800 text-sm mb-1">Default Model</label>
              <select value={settings.model} onChange={e => setSettings({...settings, model: e.target.value})} className="w-full md:w-1/2 border border-slate-300 rounded p-2 text-sm">
                <option value="gpt-4o">GPT-4o (Recommended)</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-800 text-sm mb-1">System Prompt (Tutor Personality)</label>
              <p className="text-xs text-slate-500 mb-2">Instructions the AI follows when interacting with students.</p>
              <textarea 
                value={settings.systemPrompt}
                onChange={e => setSettings({...settings, systemPrompt: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-3 text-sm h-32 resize-none"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
