'use client';

import { motion } from 'framer-motion';
import { useHabitosDia } from '@/ganchos/useHabitosDia';

export function ProgressoDiario() {
  const { porcentagem, concluidos, totalHabitos } = useHabitosDia();

  let mensagem = "Comece seu dia!";
  if (porcentagem > 0 && porcentagem < 50) mensagem = "Bom começo!";
  if (porcentagem >= 50 && porcentagem < 100) mensagem = "Quase lá!";
  if (porcentagem === 100) mensagem = "Dia perfeito! 🎉";

  if (totalHabitos === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6"
    >
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="font-bold text-slate-800">{mensagem}</h3>
          <p className="text-xs text-slate-400 font-medium">
            {concluidos} de {totalHabitos} hábitos
          </p>
        </div>
        <div className="text-2xl font-bold text-emerald-500 tracking-tighter">
          {porcentagem}%
        </div>
      </div>

      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${porcentagem}%` }}
          transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
        />
      </div>
    </motion.div>
  );
}
