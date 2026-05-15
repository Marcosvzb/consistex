'use client';

import { useEstatisticas } from '@/ganchos/useEstatisticas';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { memo, useEffect, useState } from 'react';

interface ResumoCardsProps {
  dados: ReturnType<typeof useEstatisticas>;
}

export const ResumoCards = memo(({ dados }: ResumoCardsProps) => {
  const { consistenciaMensal, totalHabitosAtivos, streakAtual } = dados;
  const estaCarregando = useAuthStore(s => s.estaCarregando);
  const [mounted, setMounted] = useState(false);

  console.log('[Chart] ResumoCards render');

  useEffect(() => {
    setMounted(true);
    console.log('[Chart] ResumoCards montado');
    return () => console.log('[Chart] ResumoCards desmontado');
  }, []);

  if (!mounted) {
    return (
      <section className="grid grid-cols-2 gap-4 h-[160px] animate-pulse">
        <div className="bg-slate-900/10 rounded-[2.5rem]" />
        <div className="flex flex-col gap-4">
          <div className="bg-slate-100 rounded-[2rem] flex-1" />
          <div className="bg-slate-100 rounded-[2rem] flex-1" />
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-2 gap-4">
      {/* Card Consistência */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-xl shadow-slate-900/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 blur-[40px] rounded-full -mr-10 -mt-10" />
        
        <AnimatePresence mode="wait">
          {estaCarregando ? (
            <motion.div 
              key="loading-cons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-8 w-16 bg-slate-800 animate-pulse rounded-lg mb-2"
            />
          ) : (
            <motion.p 
              key="val-cons"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl font-black text-white flex items-baseline gap-1 mb-1"
            >
              {consistenciaMensal}<span className="text-xl text-emerald-400">%</span>
            </motion.p>
          )}
        </AnimatePresence>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] relative z-10">Consistência Mês</p>
      </motion.div>

      {/* Card Hábitos Ativos e Streak */}
      <div className="flex flex-col gap-4">
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex-1 flex flex-col justify-center"
        >
          <p className="text-2xl font-black text-slate-800 mb-1">{streakAtual}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Streak Atual</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex-1 flex flex-col justify-center"
        >
          <p className="text-2xl font-black text-slate-800 mb-1">{totalHabitosAtivos}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Hábitos Ativos</p>
        </motion.div>
      </div>
    </section>
  );
});

ResumoCards.displayName = 'ResumoCards';
