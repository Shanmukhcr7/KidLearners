"use client";

import { Sparkles, Bot, Zap, Settings2 } from "lucide-react";

export default function AdminAiPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            AI Configurations <Sparkles size={24} className="text-amber-500" />
          </h2>
          <p className="text-sm text-slate-500 mt-1">Manage global AI features, auto-grading, and chat assistants.</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0">
          <Bot size={32} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-xl mb-1">KidLearners Intelligence Engine</h3>
          <p className="text-blue-100 text-sm">Powered by Gemini. The intelligence engine provides auto-grading, content generation for teachers, and personalized tutoring for students.</p>
        </div>
        <div className="shrink-0">
          <button className="px-6 py-2 bg-white text-indigo-700 font-bold rounded-lg shadow-sm hover:bg-blue-50 transition-colors">
            View Analytics
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { title: "AI Auto-Grading", desc: "Automatically grade short-answer and coding questions.", enabled: true },
          { title: "Tutor Chatbot", desc: "Enable the 24/7 AI tutor for students in their dashboards.", enabled: true },
          { title: "Lesson Generator", desc: "Allow teachers to generate lesson outlines and quizzes via AI.", enabled: true },
          { title: "Sentiment Analysis", desc: "Flag frustrated students based on quiz patterns and chat.", enabled: false },
        ].map((feature, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div className="flex gap-4">
              <div className="mt-1"><Zap size={20} className={feature.enabled ? "text-amber-500" : "text-slate-300"} /></div>
              <div>
                <h4 className="font-bold text-slate-900">{feature.title}</h4>
                <p className="text-sm text-slate-500">{feature.desc}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" className="sr-only peer" defaultChecked={feature.enabled} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2"><Settings2 size={20} className="text-slate-400" /> API Keys & Quotas</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Gemini API Key</label>
            <div className="flex gap-2">
              <input type="password" value="************************" readOnly className="flex-1 border border-slate-300 rounded-lg p-2 text-sm bg-slate-50 font-mono" />
              <button className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-200 border border-slate-200">Update</button>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-bold text-slate-700">Monthly Usage Quota</span>
              <span className="text-slate-500 font-medium">14.2M / 50M Tokens</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '28%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
