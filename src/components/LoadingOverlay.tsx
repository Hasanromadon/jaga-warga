"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import React from "react";

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show, message }) => {
  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center gap-3 text-center text-gray-800">
        <Loader2 className="h-15 w-15 animate-spin text-blue-500" />
        <p className="text-sm font-medium">{message || "Loading..."}</p>
      </div>
    </motion.div>
  );
};

export default LoadingOverlay;
