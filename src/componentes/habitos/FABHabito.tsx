'use client';

import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface FABHabitoProps {
  onClick: () => void;
}

export function FABHabito({ onClick }: FABHabitoProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center z-40 backdrop-blur-lg border border-white/20"
    >
      <Plus className="w-8 h-8" />
    </motion.button>
  );
}
