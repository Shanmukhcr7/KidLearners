"use client";

import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { useState, useEffect } from "react";
import { auth } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default function DemoPage() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    schoolName: "",
    email: "",
    enrollment: "100 - 500"
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setToken(await currentUser.getIdToken());
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:3001/demo-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSuccess(true);
      } else {
        alert("Failed to submit request.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 pt-24"><Navbar /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 pt-24 font-sans">
      <Navbar />
      
      <div className="w-full max-w-2xl bg-white rounded-2xl p-8 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/40 mt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">See KidLearners in Action</h1>
          <p className="text-slate-500 text-lg">Schedule a 30-minute live demonstration for your school district.</p>
        </div>

        {success ? (
          <div className="text-center py-12 bg-emerald-50 rounded-xl border border-emerald-100">
            <h2 className="text-2xl font-bold text-emerald-600 mb-2">Request Received!</h2>
            <p className="text-emerald-700">Our sales team will reach out to you shortly to schedule your live demo.</p>
          </div>
        ) : !user ? (
          <div className="text-center py-12 bg-blue-50 rounded-xl border border-blue-100 flex flex-col items-center">
            <h2 className="text-xl font-bold text-blue-900 mb-2">Sign in to request a demo</h2>
            <p className="text-blue-700 mb-6">To prevent spam, we require all demo requests to be submitted by signed-in users.</p>
            <GoogleSignInButton />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
                <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" placeholder="Jane" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Last Name</label>
                <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" placeholder="Doe" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">School / District Name</label>
              <input required type="text" value={formData.schoolName} onChange={e => setFormData({...formData, schoolName: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" placeholder="e.g. Lincoln High School" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Work Email</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" placeholder="jane@school.edu" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Student Enrollment</label>
              <select value={formData.enrollment} onChange={e => setFormData({...formData, enrollment: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-white">
                <option>Less than 100</option>
                <option>100 - 500</option>
                <option>500 - 1000</option>
                <option>1000+</option>
              </select>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-lg py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md">
                <Send size={18} /> {submitting ? "Submitting..." : "Request Live Demo"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
