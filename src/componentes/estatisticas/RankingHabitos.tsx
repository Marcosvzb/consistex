'use client';

import { useEstatisticas } from '@/ganchos/useEstatisticas';
import { OBTER_ICONE } from '@/constantes/icones';
import { motion } from 'framer-motion';
import { cn } from '@/utilitarios/ui';
import { memo, useEffect, useState, useMemo } from 'react';

interface RankingHabitosProps {
  dados: ReturnType<typeof useEstatisticas>;
}

export const RankingHabitos = memo(({ dados }: RankingHabitosProps) => {
  const { rankingHabitos } = dados;
  const [mounted, setMounted] = useState(false);

  console.log('[Chart] RankingHabitos render');

  useEffect(() => {
    setMounted(true);
    console.log('[Chart] RankingHabitos montado');
    return () => console.log('[Chart] RankingHabitos desmontado');
  }, []);

  const topHabitos = useMemo(() => {
    if (rankingHabitos.length === 0) return [];
    return rankingHabitos.slice(0, 4);
  }, [rankingHabitos]);

  if (!mounted) {
    return (
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm h-[300px] animate-pulse" />
    );
  }

  if (topHabitos.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Líderes de Adesão</h3>
        <p className="text-xl font-black text-slate-800">Ranking de Hábitos</p>
      </div>

      <div className="space-y-5">
        {topHabitos.map((item, index) => {
          const Icone = OBTER_ICONE(item.habito.icone);
          
          return (
            <div key={item.habito.id} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-300 w-4">{index + 1}º</span>
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${item.habito.cor.replace('bg-', '')}15`, color: item.habito.cor.replace('bg-', '') }}
                  >
                    <Icone className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-700 text-sm truncate max-w-[120px]">
                    {item.habito.titulo}
                  </span>
                </div>
                <span className="font-black text-slate-800 text-sm">{item.taxa}%</span>
              </div>
              
              {/* Barra de Progresso */}
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden ml-7 max-w-[calc(100%-28px)]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.taxa}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={cn("h-full rounded-full", item.habito.cor)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
});

RankingHabitos.displayName = 'RankingHabitos';
