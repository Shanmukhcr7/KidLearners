"use client";

import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ message = "Loading...", fullScreen = false }: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, -5, 5, 0]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30"
      >
        <Rocket className="text-white w-8 h-8" />
      </motion.div>
      <motion.p 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-slate-500 font-bold tracking-wide text-sm uppercase"
      >
        {message}
      </motion.p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full py-12 flex items-center justify-center">
      {content}
    </div>
  );
}
