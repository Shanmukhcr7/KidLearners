"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Check } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ isOpen, message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4 text-amber-600">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Are you sure?</h3>
              <p className="text-slate-600 mb-6">{message}</p>
              <div className="flex gap-3">
                <button 
                  onClick={onCancel}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={onConfirm}
                  className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
