"use client";

import Link from "next/link";
import { BookOpen, Trophy, Image as ImageIcon, LogOut, Home } from "lucide-react";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("user");
  const router = useRouter();
  const pathname = usePathname();

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
    <>
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/loki.jpg" alt="KidLearners Logo" className="w-8 h-8 rounded-md object-cover" />
            <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">KidLearners</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/courses" className="hover:text-blue-600 flex items-center gap-2"><BookOpen size={16} /> Open Courses</Link>
            <Link href="/gallery" className="hover:text-blue-600 flex items-center gap-2"><ImageIcon size={16} /> Gallery</Link>
            <Link href="/leaderboards" className="hover:text-blue-600 flex items-center gap-2"><Trophy size={16} /> Leaderboards</Link>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-sm font-medium text-slate-600 hidden md:block">Hello, {user.displayName}</span>
                
                {role === "student" && (
                  <Link href="/student" className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors whitespace-nowrap">
                    Dashboard
                  </Link>
                )}
                {role === "school_admin" && (
                  <Link href="/school-admin" className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors whitespace-nowrap">
                    Portal
                  </Link>
                )}
                {role === "super_admin" && (
                  <Link href="/admin" className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-sm transition-colors whitespace-nowrap">
                    Admin
                  </Link>
                )}

                <button 
                  onClick={handleSignOut}
                  className="p-1.5 sm:px-4 sm:py-2 sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={16} /> <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="scale-90 sm:scale-100 origin-right">
                <GoogleSignInButton />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white border-t border-slate-200 z-50 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          <MobileNavItem href="/" icon={<Home size={20} />} label="Home" active={pathname === "/"} />
          <MobileNavItem href="/courses" icon={<BookOpen size={20} />} label="Courses" active={pathname === "/courses"} />
          <MobileNavItem href="/gallery" icon={<ImageIcon size={20} />} label="Gallery" active={pathname === "/gallery"} />
          <MobileNavItem href="/leaderboards" icon={<Trophy size={20} />} label="Rankings" active={pathname === "/leaderboards"} />
        </div>
      </div>
    </>
  );
}

function MobileNavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link href={href} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${active ? "text-blue-600" : "text-slate-500 hover:text-slate-800"}`}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
