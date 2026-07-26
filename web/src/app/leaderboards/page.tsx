import Link from "next/link";
import { ArrowLeft, Trophy, Medal } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";

export default function PublicLeaderboardsPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pt-24 pb-12 px-6">
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-slate-500 hover:text-blue-600 flex items-center gap-2 font-medium mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 flex items-center gap-3">
          <Trophy className="text-yellow-500" size={40} /> Global Leaderboards
        </h1>
        <p className="text-lg text-slate-600 mb-12">
          Discover the top performing schools and students across the KidLearners network.
        </p>

        <div className="space-y-12">
          
          <section>
            <h2 className="text-2xl font-bold mb-6">Top Schools</h2>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <ul className="divide-y divide-slate-100">
                <li className="flex items-center justify-between p-5 text-slate-500 font-semibold justify-center">
                  No schools ranked yet.
                </li>
              </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
