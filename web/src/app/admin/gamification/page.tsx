"use client";

import { useState, useEffect } from "react";
import { Trophy, Star, Target, Gift, Plus, Loader2, Save } from "lucide-react";
import { auth } from "@/utils/firebase";

interface GamificationSettings {
  lessonXp: number;
  quizPerfectXp: number;
  dailyLoginXp: number;
  enableGlobalLeaderboard: boolean;
  enableSchoolLeaderboard: boolean;
  resetMonthly: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
}

export default function AdminGamificationPage() {
  const [settings, setSettings] = useState<GamificationSettings | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [newBadge, setNewBadge] = useState({ name: "", description: "" });
  const [creatingBadge, setCreatingBadge] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const token = await auth.currentUser?.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };
      
      const [settingsRes, badgesRes] = await Promise.all([
        fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/gamification/settings", { headers }),
        fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/gamification/badges", { headers })
      ]);

      if (settingsRes.ok) setSettings(await settingsRes.json());
      if (badgesRes.ok) setBadges(await badgesRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSettings() {
    if (!settings) return;
    setSavingSettings(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/gamification/settings", {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) alert("Settings updated!");
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSettings(false);
    }
  }

  async function handleCreateBadge() {
    if (!newBadge.name || !newBadge.description) return;
    setCreatingBadge(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/gamification/badges", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newBadge)
      });
      
      if (res.ok) {
        setShowBadgeModal(false);
        setNewBadge({ name: "", description: "" });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingBadge(false);
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center h-[50vh]"><Loader2 className="animate-spin mb-4" size={32} /> Loading gamification settings...</div>;
  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Gamification Settings</h2>
          <p className="text-sm text-slate-500 mt-1">Configure XP rules, badges, and platform-wide achievements.</p>
        </div>
        <button 
          onClick={handleSaveSettings}
          disabled={savingSettings}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
        >
          {savingSettings ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
              <Star size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Experience Points (XP)</h3>
              <p className="text-xs text-slate-500">Base point rules</p>
            </div>
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Completing Lesson</span>
              <div className="flex items-center gap-1">
                <input type="number" value={settings.lessonXp} onChange={e => setSettings({...settings, lessonXp: parseInt(e.target.value) || 0})} className="w-16 border border-slate-300 rounded p-1 text-center font-bold" />
                <span className="text-xs font-bold text-slate-500">XP</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Perfect Quiz Score</span>
              <div className="flex items-center gap-1">
                <input type="number" value={settings.quizPerfectXp} onChange={e => setSettings({...settings, quizPerfectXp: parseInt(e.target.value) || 0})} className="w-16 border border-slate-300 rounded p-1 text-center font-bold" />
                <span className="text-xs font-bold text-slate-500">XP</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Daily Login Streak</span>
              <div className="flex items-center gap-1">
                <input type="number" value={settings.dailyLoginXp} onChange={e => setSettings({...settings, dailyLoginXp: parseInt(e.target.value) || 0})} className="w-16 border border-slate-300 rounded p-1 text-center font-bold" />
                <span className="text-xs font-bold text-slate-500">XP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <Target size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Leveling System</h3>
              <p className="text-xs text-slate-500">Rank thresholds</p>
            </div>
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 font-medium">Level 1 - Novice</span>
              <span className="font-bold text-slate-900">0 XP</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 font-medium">Level 5 - Scholar</span>
              <span className="font-bold text-slate-900">5,000 XP</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 font-medium">Level 10 - Master</span>
              <span className="font-bold text-slate-900">15,000 XP</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 italic">*Levels are currently locked to global defaults.</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <Trophy size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Leaderboards</h3>
              <p className="text-xs text-slate-500">Global vs School</p>
            </div>
          </div>
          <div className="space-y-4 flex-1">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-slate-700">Enable Global Leaderboard</span>
              <input type="checkbox" checked={settings.enableGlobalLeaderboard} onChange={e => setSettings({...settings, enableGlobalLeaderboard: e.target.checked})} className="rounded text-blue-600 w-4 h-4 cursor-pointer" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-slate-700">Enable School Leaderboard</span>
              <input type="checkbox" checked={settings.enableSchoolLeaderboard} onChange={e => setSettings({...settings, enableSchoolLeaderboard: e.target.checked})} className="rounded text-blue-600 w-4 h-4 cursor-pointer" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-slate-700">Reset Boards Monthly</span>
              <input type="checkbox" checked={settings.resetMonthly} onChange={e => setSettings({...settings, resetMonthly: e.target.checked})} className="rounded text-blue-600 w-4 h-4 cursor-pointer" />
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-slate-900">Active Badges & Achievements</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {badges.map((badge) => (
            <div key={badge.id} className="border border-slate-200 rounded-xl p-4 text-center hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors mb-3">
                <Gift size={24} />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">{badge.name}</h4>
              <p className="text-xs text-slate-500">{badge.description}</p>
            </div>
          ))}
          
          <div 
            onClick={() => setShowBadgeModal(true)}
            className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px]"
          >
            <Plus size={24} className="text-slate-400 mb-2" />
            <h4 className="font-bold text-slate-500 text-sm">Add New</h4>
          </div>
        </div>
      </div>

      {showBadgeModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">Create Custom Badge</h3>
              <button onClick={() => setShowBadgeModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge Name</label>
                <input 
                  type="text" 
                  value={newBadge.name}
                  onChange={e => setNewBadge({...newBadge, name: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                  placeholder="e.g. Science Whiz" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea 
                  value={newBadge.description}
                  onChange={e => setNewBadge({...newBadge, description: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm resize-none" 
                  rows={2}
                  placeholder="e.g. Score 100% on 3 science quizzes" 
                ></textarea>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2 justify-end">
              <button 
                onClick={() => setShowBadgeModal(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateBadge}
                disabled={creatingBadge || !newBadge.name || !newBadge.description}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
              >
                {creatingBadge ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                Create Badge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
