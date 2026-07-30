"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Successfully signed in
      const user = result.user;
      console.log("Signed in as:", user.displayName);
      
      // Get Firebase ID Token
      const token = await user.getIdToken();

      // Call NestJS API to register/login user and get role
      try {
        const response = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/users/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          // CRITICAL: Force refresh the token so the frontend sees the custom claims (role) set by the backend!
          await user.getIdToken(true);

          // Route based on role
          if (data.role === "school_admin") {
            router.push("/school-admin");
          } else if (data.role === "super_admin") {
            router.push("/admin");
          } else if (data.role === "student") {
            router.push("/student");
          } else {
            // Normal 'user' goes to their invite dashboard
            router.push("/user");
          }
        } else {
          // Fallback if backend is down
          console.error("Backend error");
        }
      } catch (apiError) {
        console.error("Backend unreachable, keeping user on public page:", apiError);
        // We do not push to dashboard anymore if backend is down
      }
    } catch (error: any) {
      console.error("Error signing in with Google:", error.message);
      alert("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSignIn}
      disabled={loading}
      className="px-3 sm:px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
    >
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4 shrink-0" />
      {loading ? (
        <span>Signing in...</span>
      ) : (
        <>
          <span className="hidden sm:inline">Sign In with Google</span>
          <span className="sm:hidden">Sign In</span>
        </>
      )}
    </button>
  );
}
