"use client";

import { useState } from "react";
import { Trophy, Star, Target, Settings, Gift, Plus } from "lucide-react";

export default function AdminGamificationPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Gamification Settings</h2>
          <p className="text-sm text-slate-500 mt-1">Configure XP rules, badges, and platform-wide achievements.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus size={18} /> Create Badge
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
              <Star size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Experience Points (XP)</h3>
              <p className="text-xs text-slate-500">Base point rules</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Completing Lesson</span>
              <span className="font-bold text-slate-900">+50 XP</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Perfect Quiz Score</span>
              <span className="font-bold text-slate-900">+150 XP</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Daily Login Streak</span>
              <span className="font-bold text-slate-900">+10 XP</span>
            </div>
            <button className="w-full mt-2 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              Edit Rules
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <Target size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Leveling System</h3>
              <p className="text-xs text-slate-500">Rank thresholds</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Level 1 - Novice</span>
              <span className="font-bold text-slate-900">0 XP</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Level 5 - Scholar</span>
              <span className="font-bold text-slate-900">5,000 XP</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Level 10 - Master</span>
              <span className="font-bold text-slate-900">15,000 XP</span>
            </div>
            <button className="w-full mt-2 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              Configure Levels
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <Trophy size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Leaderboards</h3>
              <p className="text-xs text-slate-500">Global vs School</p>
            </div>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Enable Global Leaderboard</span>
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Enable School Leaderboard</span>
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Reset Boards Monthly</span>
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-lg text-slate-900 mb-6">Active Badges & Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: "First Steps", desc: "Complete 1st lesson", icon: <Star size={24} /> },
            { name: "Bookworm", desc: "Read 10 articles", icon: <Trophy size={24} /> },
            { name: "Code Ninja", desc: "Pass 5 coding quizzes", icon: <Target size={24} /> },
            { name: "7 Day Streak", desc: "Login 7 days in a row", icon: <Gift size={24} /> },
          ].map((badge, idx) => (
            <div key={idx} className="border border-slate-200 rounded-xl p-4 text-center hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group">
              <div className="w-12 h-12 mx-auto bg-slate-100 text-slate-600 rounded-full flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors mb-3">
                {badge.icon}
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">{badge.name}</h4>
              <p className="text-xs text-slate-500">{badge.desc}</p>
            </div>
          ))}
          
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px]">
            <Plus size={24} className="text-slate-400 mb-2" />
            <h4 className="font-bold text-slate-500 text-sm">Add New</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
