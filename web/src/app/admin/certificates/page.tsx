"use client";

import { useState, useEffect } from "react";
import { Award, Upload, Image as ImageIcon, Settings, Loader2 } from "lucide-react";
import { auth } from "@/utils/firebase";

interface CertificateTemplate {
  id: string;
  name: string;
  imageUrl: string;
  isDefault: boolean;
}

export default function AdminCertificatesPage() {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/certificates", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSetDefault(id: string) {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + `/certificates/${id}/default`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchTemplates();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleUploadClick() {
    // In a real scenario, this opens a file picker and uploads to R2.
    // We will simulate creating a new template for now.
    const name = prompt("Enter a name for the new template:");
    if (!name) return;

    setUploading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/certificates", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, isDefault: templates.length === 0 })
      });
      if (res.ok) {
        fetchTemplates();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Certificate Templates</h2>
          <p className="text-sm text-slate-500 mt-1">Design and manage completion certificates for courses.</p>
        </div>
        <button 
          onClick={handleUploadClick}
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          Upload Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500">
                <Loader2 size={32} className="animate-spin mb-4" />
                Loading templates...
              </div>
            ) : templates.length === 0 ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <Award size={48} className="mb-4 text-slate-300" />
                <p>No certificate templates uploaded yet.</p>
                <button onClick={handleUploadClick} className="mt-4 text-blue-600 font-bold hover:underline">Upload First Template</button>
              </div>
            ) : templates.map((template) => (
              <div key={template.id} className={`bg-white border ${template.isDefault ? 'border-blue-500 shadow-md ring-1 ring-blue-500' : 'border-slate-200 shadow-sm'} rounded-xl overflow-hidden hover:shadow-md transition-shadow group`}>
                <div className="aspect-[1.414] bg-slate-100 relative flex items-center justify-center p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
                  <div className="relative z-10 w-full h-full border-8 border-double border-slate-300 flex flex-col items-center justify-center text-center p-4 bg-white/80 backdrop-blur-sm">
                    <Award size={32} className="text-blue-600 mb-2" />
                    <h4 className="text-lg font-serif font-bold text-slate-800">Certificate of Completion</h4>
                    <p className="text-xs text-slate-500 mt-2">[Student Name]</p>
                  </div>
                  
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
                    <button className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50">Edit Layout</button>
                    <button className="bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50">Delete</button>
                  </div>
                </div>
                <div className="p-4 border-t border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      {template.name}
                      {template.isDefault && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded uppercase">Default</span>}
                    </h3>
                  </div>
                  <input 
                    type="radio" 
                    name="default_cert" 
                    checked={template.isDefault} 
                    onChange={() => handleSetDefault(template.id)}
                    className="text-blue-600 w-4 h-4 cursor-pointer" 
                  />
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
