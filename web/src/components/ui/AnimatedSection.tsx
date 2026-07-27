"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function AnimatedSection({ 
  children, 
  className, 
  delay = 0 
}: { 
  children: ReactNode; 
  className?: string; 
  delay?: number 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCard({
  children,
  className,
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: "backOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
