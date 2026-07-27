"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/utils/firebase";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { onAuthStateChanged } from "firebase/auth";

export default function JoinSchoolPage() {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();
  
  const [status, setStatus] = useState<"checking" | "login_required" | "joining" | "success" | "error">("checking");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setStatus("joining");
        try {
          const userToken = await user.getIdToken(true); // force refresh to get new claims after joining
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/schools/invites/join/${token}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${userToken}` }
          });
          
          if (res.ok) {
            // Force token refresh one more time so the frontend knows the new claims
            await user.getIdToken(true);
            setStatus("success");
            setTimeout(() => {
              router.push("/student");
            }, 2000);
          } else {
            const data = await res.json();
            setErrorMsg(data.message || "Failed to join school. Link may be invalid or expired.");
            setStatus("error");
          }
        } catch (e) {
          setErrorMsg("An unexpected error occurred.");
          setStatus("error");
        }
      } else {
        setStatus("login_required");
      }
    });

    return () => unsubscribe();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center">
        
        {status === "checking" && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Checking Invitation...</h2>
          </div>
        )}

        {status === "login_required" && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">🎓</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">You've Been Invited!</h2>
              <p className="text-slate-500 mt-2">Sign in to accept the invitation and join your school's portal.</p>
            </div>
            <div className="pt-4 flex justify-center">
              <GoogleSignInButton />
            </div>
          </div>
        )}

        {status === "joining" && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Assigning to School...</h2>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-900">Successfully Joined!</h2>
            <p className="text-slate-500">Redirecting you to your dashboard...</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-900">Invitation Failed</h2>
            <p className="text-slate-500">{errorMsg}</p>
            <button 
              onClick={() => router.push("/")}
              className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors"
            >
              Go to Home
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
