"use client";

import { useEffect, useState } from "react";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import { Building2, Check, X, Mail } from "lucide-react";

export default function UserDashboard() {
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/");
        return;
      }
      
      try {
        const token = await user.getIdToken();
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/users/my-invites", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setInvites(data);
        }
      } catch (err) {
        console.error("Error fetching invites", err);
      } finally {
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, [router]);

  const handleAccept = async (inviteId: string) => {
    setProcessing(inviteId);
    try {
      const user = auth.currentUser;
      if (!user) return;
      
      const token = await user.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/users/my-invites/${inviteId}/accept`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        // Force refresh token to get new 'student' role
        await user.getIdToken(true);
        // Redirect to student dashboard
        router.push("/student");
      } else {
        alert("Failed to accept invite");
        setProcessing(null);
      }
    } catch (e) {
      console.error(e);
      setProcessing(null);
    }
  }

  const handleReject = async (inviteId: string) => {
    setProcessing(inviteId);
    try {
      const user = auth.currentUser;
      if (!user) return;
      
      const token = await user.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/users/my-invites/${inviteId}/reject`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        setInvites(invites.filter(i => i.id !== inviteId));
      } else {
        alert("Failed to reject invite");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(null);
    }
  }

  if (loading) {
    return <div className="text-slate-500 text-center py-12">Loading your dashboard...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome, {auth.currentUser?.displayName}</h1>
        <p className="text-slate-500 mt-2">Manage your account and school invitations.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Mail className="text-indigo-600" size={20} />
            Pending School Invitations
          </h2>
        </div>
        
        <div className="p-6">
          {invites.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 size={24} />
              </div>
              <p className="text-slate-500 font-medium">You have no pending invitations from any school.</p>
              <p className="text-sm text-slate-400 mt-1">If you were expecting one, ask your teacher to resend it.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invites.map(invite => (
                <div key={invite.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-bold text-lg">
                      {invite.schoolName ? invite.schoolName.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{invite.schoolName}</h3>
                      <p className="text-sm text-slate-500">Invited you to join as a student</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => handleReject(invite.id)}
                      disabled={processing === invite.id}
                      className="flex-1 sm:flex-none px-4 py-2 bg-white text-slate-700 border border-slate-300 font-semibold rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                    >
                      <X size={16} /> Decline
                    </button>
                    <button 
                      onClick={() => handleAccept(invite.id)}
                      disabled={processing === invite.id}
                      className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                    >
                      <Check size={16} /> {processing === invite.id ? "Joining..." : "Accept & Join"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
