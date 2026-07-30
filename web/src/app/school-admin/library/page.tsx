"use client";

import { Construction } from "lucide-react";

export default function PlaceholderPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
        <Construction size={40} />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">Module Under Construction</h1>
      <p className="text-lg text-slate-600 max-w-lg mb-8">
        The backend real-time integrations for this module are completed, but the UI is currently being designed and will be available in a future update.
      </p>
    </div>
  );
}
