"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";

export default function RoleGuard({ allowedRoles, children }: { allowedRoles: string[], children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Not logged in
        router.replace("/");
        return;
      }

      try {
        const tokenResult = await user.getIdTokenResult();
        const userRole = tokenResult.claims.role as string || "user";

        if (allowedRoles.includes(userRole)) {
          setAuthorized(true);
        } else {
          // Redirect to appropriate portal based on role
          if (userRole === "super_admin") router.replace("/admin");
          else if (userRole === "school_admin") router.replace("/school");
          else router.replace("/student");
        }
      } catch (error) {
        console.error("Error verifying role:", error);
        router.replace("/");
      }
    });

    return () => unsubscribe();
  }, [allowedRoles, router]);

  if (!authorized) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-pulse font-bold text-slate-400">Verifying access...</div></div>;
  }

  return <>{children}</>;
}
