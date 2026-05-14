'use client';

import { useRotinaInteligente } from '@/ganchos/useRotinaInteligente';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Target, Trophy, Coffee } from 'lucide-react';
import { cn } from '@/utilitarios/ui';

const ICONES_MAP: Record<string, any> = {
  Flame,
  Target,
  Trophy,
  Coffee
};

export function NudgeDiario() {
  const { nudgeDiario } = useRotinaInteligente();

  if (!nudgeDiario) return null;

  const Icone = ICONES_MAP[nudgeDiario.icone] || Coffee;

  let bgClass = "bg-slate-50 border-slate-100";
  let textClass = "text-slate-600";
  let iconClass = "text-slate-400 bg-white";

  if (nudgeDiario.tipo === 'sucesso') {
    bgClass = "bg-emerald-50 border-emerald-100";
    textClass = "text-emerald-800";
    iconClass = "text-emerald-500 bg-white";
  } else if (nudgeDiario.tipo === 'motivacional') {
    bgClass = "bg-amber-50 border-amber-100";
    textClass = "text-amber-800";
    iconClass = "text-amber-500 bg-white";
  } else if (nudgeDiario.tipo === 'informativo') {
    bgClass = "bg-blue-50 border-blue-100";
    textClass = "text-blue-800";
    iconClass = "text-blue-500 bg-white";
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={nudgeDiario.mensagem}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "px-4 py-3 rounded-2xl border shadow-sm flex items-center gap-3 mb-6",
          bgClass
        )}
      >
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm", iconClass)}>
          <Icone className="w-4 h-4" />
        </div>
        <p className={cn("text-sm font-medium leading-tight", textClass)}>
          {nudgeDiario.mensagem}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
