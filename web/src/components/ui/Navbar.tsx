"use client";

import Link from "next/link";
import { BookOpen, Trophy, Image as ImageIcon, LogOut } from "lucide-react";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("user");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const tokenResult = await currentUser.getIdTokenResult();
          setRole((tokenResult.claims.role as string) || "user");
        } catch (e) {
          console.error("Failed to fetch claims", e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setRole("user");
    router.push("/");
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg">
            K
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">KidLearners</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/courses" className="hover:text-blue-600 flex items-center gap-2"><BookOpen size={16} /> Open Courses</Link>
          <Link href="/gallery" className="hover:text-blue-600 flex items-center gap-2"><ImageIcon size={16} /> Gallery</Link>
          <Link href="/leaderboards" className="hover:text-blue-600 flex items-center gap-2"><Trophy size={16} /> Leaderboards</Link>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600 hidden sm:block">Hello, {user.displayName}</span>
              
              {role === "student" && (
                <Link href="/dashboard" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors">
                  Go to Dashboard
                </Link>
              )}
              {role === "school_admin" && (
                <Link href="/school" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">
                  School Portal
                </Link>
              )}
              {role === "super_admin" && (
                <Link href="/admin" className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-sm transition-colors">
                  HQ Admin
                </Link>
              )}

              <button 
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          ) : (
            <GoogleSignInButton />
          )}
        </div>
      </div>
    </nav>
  );
}
