"use client";

import { Award, Upload, Image as ImageIcon, Settings } from "lucide-react";

export default function AdminCertificatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Certificate Templates</h2>
          <p className="text-sm text-slate-500 mt-1">Design and manage completion certificates for courses.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <Upload size={18} /> Upload Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="aspect-[1.414] bg-slate-100 relative flex items-center justify-center p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
                  <div className="relative z-10 w-full h-full border-8 border-double border-slate-300 flex flex-col items-center justify-center text-center p-4 bg-white/80 backdrop-blur-sm">
                    <Award size={32} className="text-blue-600 mb-2" />
                    <h4 className="text-lg font-serif font-bold text-slate-800">Certificate of Completion</h4>
                    <p className="text-xs text-slate-500 mt-2">[Student Name]</p>
                  </div>
                  
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
                    <button className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50">Edit</button>
                    <button className="bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50">Delete</button>
                  </div>
                </div>
                <div className="p-4 border-t border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Standard Template {item}</h3>
                    <p className="text-xs text-slate-500">Used in {item * 3} courses</p>
                  </div>
                  <input type="radio" name="default" defaultChecked={item === 1} className="text-blue-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Settings size={20} className="text-slate-400" /> Variables</h3>
            <p className="text-sm text-slate-500 mb-4">Use these variables in your certificate text fields to automatically populate student data.</p>
            
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between p-2 bg-slate-50 rounded border border-slate-100">
                <span className="text-blue-600 font-bold">{`{{student_name}}`}</span>
                <span className="text-slate-500">Full Name</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded border border-slate-100">
                <span className="text-blue-600 font-bold">{`{{course_title}}`}</span>
                <span className="text-slate-500">Course Name</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded border border-slate-100">
                <span className="text-blue-600 font-bold">{`{{completion_date}}`}</span>
                <span className="text-slate-500">Date Completed</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded border border-slate-100">
                <span className="text-blue-600 font-bold">{`{{school_name}}`}</span>
                <span className="text-slate-500">Organization</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
