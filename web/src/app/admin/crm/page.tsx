"use client";

import { Users, Search, Mail, Phone, Activity } from "lucide-react";

export default function AdminCrmPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">CRM & Leads</h2>
          <p className="text-sm text-slate-500 mt-1">Manage relationships with schools and track their onboarding pipeline.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["New Leads", "Contacted", "In Trial", "Converted"].map((stage, idx) => (
          <div key={idx} className="bg-slate-100 rounded-xl p-4 flex flex-col h-[600px] border border-slate-200 shadow-inner">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              {stage}
              <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{Math.floor(Math.random() * 10) + 1}</span>
            </h3>
            
            <div className="space-y-3 overflow-y-auto">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-blue-400 cursor-pointer transition-colors group">
                <h4 className="font-bold text-sm text-slate-900 mb-1">Springfield Elementary</h4>
                <p className="text-xs text-slate-500 mb-3">Contact: Seymour Skinner</p>
                <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                  <button className="text-slate-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50"><Mail size={16} /></button>
                  <button className="text-slate-400 hover:text-green-600 p-1 rounded-md hover:bg-green-50"><Phone size={16} /></button>
                  <div className="ml-auto text-[10px] font-bold text-slate-400 uppercase">2 days ago</div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-blue-400 cursor-pointer transition-colors group">
                <h4 className="font-bold text-sm text-slate-900 mb-1">Oakridge High</h4>
                <p className="text-xs text-slate-500 mb-3">Contact: Principal Joe</p>
                <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                  <button className="text-slate-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50"><Mail size={16} /></button>
                  <button className="text-slate-400 hover:text-green-600 p-1 rounded-md hover:bg-green-50"><Phone size={16} /></button>
                  <div className="ml-auto text-[10px] font-bold text-slate-400 uppercase">1 week ago</div>
                </div>
              </div>
            </div>
            
            <button className="mt-auto pt-4 text-sm font-bold text-slate-500 hover:text-slate-800 text-center">+ Add Lead</button>
          </div>
        ))}
      </div>
    </div>
  );
}
