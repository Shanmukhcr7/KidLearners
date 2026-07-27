"use client";

import { useEffect, useState } from "react";
import { auth } from "@/utils/firebase";
import { Settings, Save, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("global");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const defaultFeatures = {
    courses: true,
    exams: true,
    tasks: true,
    certificates: true,
    leaderboards: true,
    aiTutor: false,
    robotics: false,
    events: false
  };

  const [features, setFeatures] = useState<any>(defaultFeatures);

  useEffect(() => {
    async function fetchSchools() {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/schools", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSchools(data);
        }
      } catch (error) {
        console.error("Failed to fetch schools", error);
      } finally {
        setLoading(false);
      }
    }
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchSchools();
    });

    return () => unsubscribe();
  }, []);

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const schoolId = e.target.value;
    setSelectedSchoolId(schoolId);
    setMessage({ text: "", type: "" });

    if (schoolId === "global") {
      setFeatures(defaultFeatures);
    } else {
      const school = schools.find(s => s.id === schoolId);
      if (school && school.features) {
        setFeatures(school.features);
      } else {
        setFeatures(defaultFeatures);
      }
    }
  };

  const handleToggle = (key: string) => {
    setFeatures({ ...features, [key]: !features[key] });
    setMessage({ text: "Unsaved changes", type: "warning" });
  };

  const handleSave = async () => {
    if (selectedSchoolId === "global") {
      setMessage({ text: "Global defaults cannot be changed yet. Please select a specific school.", type: "error" });
      return;
    }

    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + `/schools/${selectedSchoolId}/features`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(features)
      });
      
      if (res.ok) {
        setMessage({ text: "Features updated successfully!", type: "success" });
        // Update local state so it doesn't revert if they switch away and back
        setSchools(schools.map(s => s.id === selectedSchoolId ? { ...s, features } : s));
      } else {
        setMessage({ text: "Failed to update features.", type: "error" });
      }
    } catch (error) {
      console.error("Error saving features:", error);
      setMessage({ text: "An error occurred while saving.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const featureConfig = [
    { key: "courses", label: "Courses", desc: "Enable the core curriculum and course modules." },
    { key: "exams", label: "Exams", desc: "Allow schools to conduct online assessments." },
    { key: "tasks", label: "Tasks", desc: "Enable assignment tracking and grading." },
    { key: "certificates", label: "Certificates", desc: "Auto-generate certificates upon course completion." },
    { key: "leaderboards", label: "Leaderboards", desc: "Gamify learning with points and global rankings." },
    { key: "aiTutor", label: "AI Tutor", desc: "Unlock the advanced AI learning assistant for students." },
    { key: "robotics", label: "Robotics", desc: "Enable hardware integration and robotics blueprints." },
    { key: "events", label: "Events", desc: "Allow schools to schedule live virtual events." },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Configuration</h2>
          <p className="text-sm text-slate-500 mt-1">Globally toggle modules and feature flags for specific schools.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving || selectedSchoolId === "global"}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Save size={18} /> {saving ? "Saving..." : "Save Configuration"}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-700 mb-2">Target Scope</label>
            <select 
              value={selectedSchoolId}
              onChange={handleSchoolChange}
              className="w-full md:w-1/2 p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 font-medium"
            >
              <option value="global">Global Defaults (New Schools)</option>
              {schools.map(school => (
                <option key={school.id} value={school.id}>{school.name} ({school.domain})</option>
              ))}
            </select>
          </div>
        </div>

        {message.text && (
          <div className={`px-6 py-3 border-b flex items-center gap-2 text-sm font-bold ${
            message.type === "success" ? "bg-green-50 border-green-200 text-green-700" :
            message.type === "error" ? "bg-red-50 border-red-200 text-red-700" :
            "bg-yellow-50 border-yellow-200 text-yellow-700"
          }`}>
            {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        <div className="p-0">
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-100">
              {featureConfig.map((f) => (
                <tr key={f.key} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{f.label}</div>
                    <div className="text-sm text-slate-500 mt-0.5">{f.desc}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleToggle(f.key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                        features[f.key] ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        features[f.key] ? "translate-x-6" : "translate-x-1"
                      }`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
