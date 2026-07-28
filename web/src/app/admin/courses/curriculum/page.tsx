"use client";

import { useState, useEffect } from "react";
import { auth } from "@/utils/firebase";
import { BookOpen, ChevronDown, ChevronRight, Plus, FileText, Video, HelpCircle, Save } from "lucide-react";

export default function AdminCoursesCurriculumPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Modals
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState("");

  const [newModule, setNewModule] = useState({ title: "", description: "" });
  const [newLesson, setNewLesson] = useState({ title: "", type: "video", content: "" });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchModules(selectedCourseId);
    } else {
      setModules([]);
    }
  }, [selectedCourseId]);

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

  async function fetchModules(courseId: string) {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + `/courses/${courseId}/modules`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        
        // Fetch lessons for each module
        const modulesWithLessons = await Promise.all(data.map(async (mod: any) => {
          const lesRes = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + `/courses/${courseId}/modules/${mod.id}/lessons`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const lessons = lesRes.ok ? await lesRes.json() : [];
          return { ...mod, lessons };
        }));
        
        setModules(modulesWithLessons);
        
        // Auto-expand all modules
        const expanded: Record<string, boolean> = {};
        modulesWithLessons.forEach(m => expanded[m.id] = true);
        setExpandedModules(expanded);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleAddModule = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + `/courses/${selectedCourseId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newModule)
      });
      if (res.ok) {
        setShowModuleModal(false);
        setNewModule({ title: "", description: "" });
        fetchModules(selectedCourseId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddLesson = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + `/courses/${selectedCourseId}/modules/${activeModuleId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newLesson)
      });
      if (res.ok) {
        setShowLessonModal(false);
        setNewLesson({ title: "", type: "video", content: "" });
        fetchModules(selectedCourseId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={16} className="text-blue-500" />;
      case 'quiz': return <HelpCircle size={16} className="text-purple-500" />;
      default: return <FileText size={16} className="text-orange-500" />;
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Curriculum Builder</h2>
          <p className="text-sm text-slate-500 mt-1">Structure your courses with modules and lessons.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <label className="block text-sm font-bold text-slate-700 mb-2">Select Course to Edit</label>
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

      {selectedCourseId ? (
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Modules & Lessons</h3>
            <button 
              onClick={() => setShowModuleModal(true)}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800"
            >
              <Plus size={16} /> Add Module
            </button>
          </div>

          <div className="space-y-4">
            {modules.length === 0 ? (
              <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-300 rounded-xl">
                No modules found. Create your first module to get started.
              </div>
            ) : modules.map((mod, i) => (
              <div key={mod.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div 
                  className="px-4 py-3 bg-slate-100/50 border-b border-slate-200 flex justify-between items-center cursor-pointer hover:bg-slate-100"
                  onClick={() => toggleModule(mod.id)}
                >
                  <div className="flex items-center gap-2">
                    {expandedModules[mod.id] ? <ChevronDown size={20} className="text-slate-500" /> : <ChevronRight size={20} className="text-slate-500" />}
                    <span className="font-bold text-slate-800">Module {i + 1}: {mod.title}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveModuleId(mod.id); setShowLessonModal(true); }}
                    className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Lesson
                  </button>
                </div>
                
                {expandedModules[mod.id] && (
                  <div className="p-4 bg-white">
                    {mod.lessons?.length === 0 ? (
                      <p className="text-sm text-slate-400 italic pl-8">No lessons in this module yet.</p>
                    ) : (
                      <div className="space-y-2 pl-4">
                        {mod.lessons?.map((lesson: any, j: number) => (
                          <div key={lesson.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-slate-300 group">
                            <div className="flex items-center gap-3">
                              <div className="bg-slate-100 p-2 rounded-md">
                                {getLessonIcon(lesson.type)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-slate-800">{j + 1}. {lesson.title}</div>
                                <div className="text-xs text-slate-500 capitalize">{lesson.type}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">Please select a course or create one first.</div>
      )}

      {/* Add Module Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Add Module</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Module Title</label>
                <input type="text" className="w-full border rounded-lg p-2" value={newModule.title} onChange={e => setNewModule({...newModule, title: e.target.value})} placeholder="e.g., Introduction" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea className="w-full border rounded-lg p-2" value={newModule.description} onChange={e => setNewModule({...newModule, description: e.target.value})} rows={3} />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModuleModal(false)} className="px-4 py-2 font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
              <button onClick={handleAddModule} className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Save Module</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold mb-4">Add Lesson</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Lesson Title</label>
                <input type="text" className="w-full border rounded-lg p-2" value={newLesson.title} onChange={e => setNewLesson({...newLesson, title: e.target.value})} placeholder="e.g., What is Python?" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Lesson Type</label>
                <select className="w-full border rounded-lg p-2" value={newLesson.type} onChange={e => setNewLesson({...newLesson, type: e.target.value})}>
                  <option value="video">Video URL</option>
                  <option value="text">Rich Text / Article</option>
                  <option value="quiz">Quiz Assessment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Content / URL</label>
                <textarea className="w-full border rounded-lg p-2 font-mono text-sm" value={newLesson.content} onChange={e => setNewLesson({...newLesson, content: e.target.value})} rows={4} placeholder="Enter URL or content..." />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowLessonModal(false)} className="px-4 py-2 font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
              <button onClick={handleAddLesson} className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Save Lesson</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
