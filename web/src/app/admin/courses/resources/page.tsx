"use client";

import { useState, useEffect } from "react";
import { auth } from "@/utils/firebase";
import { FileText, Download, Trash2, Plus, UploadCloud } from "lucide-react";

export default function AdminCoursesResourcesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/courses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
        if (data.length > 0) setSelectedCourseId(data[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // In a real implementation, this would fetch resources from the Files API filtered by courseId
  // For now, we show a beautiful empty state as the generic Files module handles actual uploads
  
  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Course Resources</h2>
          <p className="text-sm text-slate-500 mt-1">Manage downloadable files, worksheets, and PDFs for your courses.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <UploadCloud size={18} /> Upload Resource
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <label className="block text-sm font-bold text-slate-700 mb-2">Select Course</label>
        <select 
          className="w-full md:w-1/2 p-2 border border-slate-300 rounded-lg bg-slate-50"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
        >
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[300px] flex items-center justify-center">
        <div className="text-center p-8 max-w-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No resources uploaded</h3>
          <p className="text-slate-500 text-sm mb-6">
            Upload PDFs, worksheets, and other supplementary materials for students in this course to download.
          </p>
          <button className="bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600 px-4 py-2 rounded-lg font-bold text-sm w-full transition-colors">
            Browse Files
          </button>
        </div>
      </div>
    </div>
  );
}
