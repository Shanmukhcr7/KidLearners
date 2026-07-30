import { ReactNode } from "react";
import { Navbar } from "@/components/ui/Navbar";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main className="pt-24 px-4 sm:px-6 max-w-5xl mx-auto pb-20">
        {children}
      </main>
    </div>
  );
}
