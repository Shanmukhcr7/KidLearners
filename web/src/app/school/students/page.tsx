"use client";

import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Mail, X, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function ManageStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState("");

  useEffect(() => {
    // In a real app, this would fetch from GET /schools/:id/students
    setStudents([
      { name: "Alex Johnson", email: "alex@student.com", grade: "Class 9", status: "Active", date: "Sep 1, 2026" },
      { name: "Sam Williams", email: "sam@student.com", grade: "Class 10", status: "Active", date: "Sep 3, 2026" },
    ]);
  }, []);

  const handleInviteStudent = () => {
    // This would send POST /schools/:id/students
    setStudents([...students, { name: "Pending", email: newStudentEmail, grade: "-", status: "Pending Invite", date: "Just Now" }]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Students</h2>
          <p className="text-sm text-gray-500 mt-1">View, add, and manage students in your school.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus size={18} /> Add Student
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Filters Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-200">
                <th className="px-6 py-4">Student Info</th>
                <th className="px-6 py-4">Grade/Class</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {students.map((student, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.grade}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      student.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50"><Mail size={18} /></button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Add Student</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500"><X size={20} /></button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Send Email Invite</label>
                <div className="flex gap-2">
                  <input type="email" placeholder="student@school.edu" className="flex-1 border rounded-lg p-2" onChange={e => setNewStudentEmail(e.target.value)} />
                  <button onClick={handleInviteStudent} className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-indigo-700">Invite</button>
                </div>
              </div>
              <div className="relative flex py-5 items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Share Invite Link</label>
                <div className="flex gap-2">
                  <input type="text" readOnly value="https://kidlearners.io/join/lincolnhigh-xyz123" className="flex-1 border rounded-lg p-2 bg-gray-50 text-gray-500" />
                  <button className="border border-gray-300 text-gray-700 font-bold px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"><LinkIcon size={16} /> Copy</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
