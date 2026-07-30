import { toast } from "react-hot-toast";
"use client";

import { useEffect, useState } from "react";
import { CreditCard, Plus, Search, Edit2, Play, X } from "lucide-react";
import { auth } from "@/utils/firebase";

export default function AdminExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExam, setNewExam] = useState({ title: "", duration: "60 mins", totalQuestions: 10 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  async function fetchExams() {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/exams", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setExams(data);
      }
    } catch (error) {
      console.error("Failed to fetch exams", error);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/exams", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: newExam.title,
          duration: newExam.duration,
          totalQuestions: parseInt(newExam.totalQuestions.toString())
        })
      });
      
      if (res.ok) {
        setNewExam({ title: "", duration: "60 mins", totalQuestions: 10 });
        setIsModalOpen(false);
        fetchExams();
      } else {
        toast.error("Failed to create exam");
      }
    } catch (error) {
      console.error("Error creating exam:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Exams & Assessments</h2>
          <p className="text-sm text-slate-500 mt-1">Manage global tests, quizzes, and automated grading.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Create Exam
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Filters Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search exams..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                <th className="px-6 py-4">Exam Title</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Questions</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12"><LoadingSpinner /></td>
                </tr>
              ) : exams.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No exams found. Click "Create Exam" to add one!
                  </td>
                </tr>
              ) : (
                exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center font-bold shrink-0">
                          <CreditCard size={20} />
                        </div>
                        <div className="font-bold text-slate-900">{exam.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{exam.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{exam.totalQuestions} Qs</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                        exam.status === "Active" ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"
                      }`}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50"><Edit2 size={18} /></button>
                        <button className="p-1.5 text-slate-400 hover:text-green-600 rounded-md hover:bg-green-50"><Play size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Exam Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Create New Exam</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateExam} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Exam Title</label>
                <input 
                  type="text" 
                  required
                  value={newExam.title}
                  onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g. Final Certification Test"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Duration</label>
                  <input 
                    type="text" 
                    value={newExam.duration}
                    onChange={(e) => setNewExam({...newExam, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    placeholder="e.g. 60 mins"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Total Questions</label>
                  <input 
                    type="number" 
                    value={newExam.totalQuestions}
                    onChange={(e) => setNewExam({...newExam, totalQuestions: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-4 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg flex items-center gap-2"
                >
                  {submitting ? "Creating..." : "Create Exam"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
