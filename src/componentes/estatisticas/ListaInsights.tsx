'use client';

import { useInsights } from '@/ganchos/useInsights';
import { motion } from 'framer-motion';
import { Flame, Target, Trophy, Calendar } from 'lucide-react';
import { cn } from '@/utilitarios/ui';

const ICONES_MAP: Record<string, any> = {
  Flame,
  Target,
  Trophy,
  Calendar
};

export function ListaInsights() {
  const { insights } = useInsights();

  if (insights.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="px-2 mb-2">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Análise Automática</h3>
        <p className="text-xl font-black text-slate-800">Insights Gerados</p>
      </div>

      <div className="flex flex-col gap-3">
        {insights.map((insight, index) => {
          const Icone = ICONES_MAP[insight.icone] || Target;
          
          let colorClass = "text-slate-400 bg-slate-100";
          if (insight.tipo === 'sucesso') colorClass = "text-emerald-500 bg-emerald-100";
          if (insight.tipo === 'info') colorClass = "text-blue-500 bg-blue-100";
          if (insight.tipo === 'destaque') colorClass = "text-amber-500 bg-amber-100";
          if (insight.tipo === 'calendario') colorClass = "text-indigo-500 bg-indigo-100";

          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
              className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex gap-4 items-start"
            >
              <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0", colorClass)}>
                <Icone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">{insight.titulo}</h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  {insight.texto}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
