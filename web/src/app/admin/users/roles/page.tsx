"use client";

import { useState } from "react";
import { Shield, ShieldAlert, ShieldCheck, UserCheck, Users, Plus, Check } from "lucide-react";

export default function AdminUsersRolesPage() {
  const [roles] = useState([
    {
      id: "super_admin",
      name: "Super Admin",
      description: "Full access to all platform settings, schools, and global data.",
      usersCount: 2,
      type: "System",
      icon: <ShieldAlert size={20} className="text-red-600" />,
      permissions: ["Manage All Schools", "Manage Billing", "Global Analytics", "Manage Global Curriculum", "Platform Settings"]
    },
    {
      id: "school_admin",
      name: "School Admin",
      description: "Can manage everything within their specific school organization.",
      usersCount: 15,
      type: "System",
      icon: <ShieldCheck size={20} className="text-blue-600" />,
      permissions: ["Manage School Users", "View School Analytics", "Manage School Content", "School Settings"]
    },
    {
      id: "teacher",
      name: "Teacher",
      description: "Can manage their assigned classes, grade students, and view student progress.",
      usersCount: 120,
      type: "System",
      icon: <UserCheck size={20} className="text-green-600" />,
      permissions: ["Manage Assigned Classes", "Grade Assignments", "View Student Data"]
    },
    {
      id: "student",
      name: "Student",
      description: "Standard learning access. Can view enrolled courses and submit assignments.",
      usersCount: 3500,
      type: "System",
      icon: <Users size={20} className="text-orange-600" />,
      permissions: ["View Enrolled Courses", "Submit Quizzes", "View Own Grades"]
    },
    {
      id: "parent",
      name: "Parent",
      description: "Can view the progress and grades of their linked children.",
      usersCount: 2800,
      type: "System",
      icon: <Shield size={20} className="text-purple-600" />,
      permissions: ["View Child Progress", "View Child Grades", "Communicate with Teachers"]
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Roles & Permissions</h2>
          <p className="text-sm text-slate-500 mt-1">Manage access control and view permissions across the platform.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus size={18} /> Create Custom Role
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          {roles.map(role => (
            <div key={role.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                    {role.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      {role.name}
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">{role.type}</span>
                    </h3>
                    <p className="text-sm text-slate-500">{role.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900">{role.usersCount.toLocaleString()}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Users</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Permissions Included</div>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((perm, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium">
                      <Check size={12} /> {perm}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Shield size={20} className="text-blue-400" /> Security Notice</h3>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              System roles (Super Admin, School Admin, Teacher, Student, Parent) cannot be modified or deleted as they form the core authorization architecture of KidLearners.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              When creating custom roles, ensure you follow the principle of least privilege.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors">
                Export Permissions Matrix
              </button>
              <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors">
                Audit Role Assignments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
