"use client";
import { toast } from "react-hot-toast";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Filter, Layers, Brain, Code } from "lucide-react";
import { auth } from "@/utils/firebase";

type QuestionType = "multiple_choice" | "true_false" | "short_answer" | "coding";
type Difficulty = "Easy" | "Medium" | "Hard";

interface Question {
  id: string;
  title: string;
  content: string;
  type: QuestionType;
  difficulty: Difficulty;
  subject: string;
  options?: any[];
  correctAnswer?: any;
  schoolId: string;
  createdAt: string;
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    type: QuestionType;
    difficulty: Difficulty;
    subject: string;
    options: string[];
    correctAnswer: string;
  }>({
    title: "", content: "", type: "multiple_choice", difficulty: "Medium", subject: "", options: ["", "", "", ""], correctAnswer: ""
  });

  const fetchQuestions = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/questions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchQuestions();
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/questions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setShowModal(false);
        fetchQuestions();
        setFormData({ title: "", content: "", type: "multiple_choice", difficulty: "Medium", subject: "", options: ["", "", "", ""], correctAnswer: "" });
      } else {
        toast.error("Failed to save question");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error saving question");
    }
  };

  const executeDelete = async (id: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + `/questions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Question deleted successfully");
        fetchQuestions();
      } else {
        toast.error("Cannot delete global question");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error deleting question");
    }
  };

  const handleDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-bold text-slate-900">Are you sure you want to delete this question?</p>
        <div className="flex justify-end gap-2 mt-2">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors" onClick={() => toast.dismiss(t.id)}>Cancel</button>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors" onClick={() => { toast.dismiss(t.id); executeDelete(id); }}>Delete</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "coding": return <Code size={18} className="text-purple-600" />;
      case "multiple_choice": return <Layers size={18} className="text-blue-600" />;
      default: return <Brain size={18} className="text-green-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Question Bank</h2>
          <p className="text-sm text-slate-500 mt-1">Manage reusable questions for exams and quizzes.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus size={18} /> Add Question
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search questions..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100">
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                <th className="px-6 py-4">Title & Content</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12"><LoadingSpinner /></td></tr>
              ) : questions.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-500">No questions found. Create one!</td></tr>
              ) : questions.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{q.title}</div>
                    <div className="text-sm text-slate-500 truncate max-w-xs">{q.content}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                        {getIcon(q.type)}
                      </div>
                      <span className="text-sm font-medium text-slate-700 capitalize">{q.type.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                      q.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 
                      q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{q.subject || 'General'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(q.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold">Add Question</h3>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                  <input type="text" className="w-full border rounded-lg p-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g., Intro to Arrays" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Subject</label>
                  <input type="text" className="w-full border rounded-lg p-2" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="e.g., Computer Science" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Question Content</label>
                <textarea className="w-full border rounded-lg p-2 h-24" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="What is the output of..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                  <select className="w-full border rounded-lg p-2" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as QuestionType})}>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="true_false">True / False</option>
                    <option value="short_answer">Short Answer</option>
                    <option value="coding">Coding Challenge</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Difficulty</label>
                  <select className="w-full border rounded-lg p-2" value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value as Difficulty})}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              {formData.type === "multiple_choice" && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <label className="block text-sm font-bold text-slate-700">Options</label>
                  {formData.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="correct" 
                        checked={formData.correctAnswer === opt && opt !== ""}
                        onChange={() => setFormData({...formData, correctAnswer: opt})}
                      />
                      <input 
                        type="text" 
                        className="flex-1 border rounded-lg p-2 text-sm" 
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={e => {
                          const newOpts = [...formData.options];
                          newOpts[idx] = e.target.value;
                          setFormData({...formData, options: newOpts});
                        }}
                      />
                    </div>
                  ))}
                  <p className="text-xs text-slate-500">Select the radio button next to the correct answer.</p>
                </div>
              )}
              
              {formData.type === "true_false" && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <label className="block text-sm font-bold text-slate-700">Correct Answer</label>
                  <select className="w-full border rounded-lg p-2" value={formData.correctAnswer} onChange={e => setFormData({...formData, correctAnswer: e.target.value})}>
                    <option value="">Select...</option>
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </select>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-200 rounded-lg">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Save Question</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
