'use client';

import { ShellMobile } from '@/componentes/layout/ShellMobile';
import { useHabitoStore } from '@/store/useHabitoStore';
import { HeatmapMensal } from '@/componentes/dashboard/HeatmapMensal';
import { Trophy, Target, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function HistoricoPage() {
  const { registros } = useHabitoStore();
  const { perfil, estaCarregando } = useAuthStore();

  const totalConcluidos = Object.values(registros).reduce((acc, reg) => {
    if (!reg?.habitos) return acc;
    return acc + Object.values(reg.habitos).filter(v => v === true).length;
  }, 0);

  const diasConsistentes = Object.values(registros).filter(reg => (reg?.porcentagemConclusao ?? 0) === 100).length;

  return (
    <ShellMobile>
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 mb-2">Seu Progresso</h1>
        <p className="text-slate-400 font-medium">Visualize sua jornada e conquistas.</p>
      </header>

      <section className="grid grid-cols-2 gap-4 mb-8">
        {/* Card Melhor Streak */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center mb-4 text-amber-600">
            <Trophy className="w-6 h-6" />
          </div>
          
          <AnimatePresence mode="wait">
            {estaCarregando && !perfil ? (
              <motion.div 
                key="loading-streak"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-8 w-12 bg-slate-100 animate-pulse rounded-lg"
              />
            ) : (
              <motion.p 
                key="val-streak"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-3xl font-black text-slate-800"
              >
                {perfil?.estatisticas?.melhorStreak ?? 0}
              </motion.p>
            )}
          </AnimatePresence>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Melhor Streak</p>
        </div>

        {/* Card Dias 100% */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 text-emerald-600">
            <Zap className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-slate-800">{diasConsistentes}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Dias 100%</p>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Visualização</span>
            <h2 className="font-black text-xl text-slate-800">Consistência</h2>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl">
            <Target className="w-5 h-5 text-slate-400" />
          </div>
        </div>
        <HeatmapMensal />
      </section>

      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full -mr-16 -mt-16" />
        
        <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em] mb-4">Total de Conclusões</h3>
        <p className="text-5xl font-black text-white flex items-baseline gap-2">
          {totalConcluidos}
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Hábitos</span>
        </p>
        <p className="text-slate-400 text-sm mt-6 leading-relaxed font-medium">
          Continue assim! Cada pequeno passo conta na sua jornada de consistência e evolução pessoal.
        </p>
      </motion.div>
    </ShellMobile>
  );
}
