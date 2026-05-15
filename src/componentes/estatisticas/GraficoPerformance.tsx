'use client';

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useEstatisticas } from '@/ganchos/useEstatisticas';
import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

export function GraficoPerformance() {
  const { performanceDia } = useEstatisticas();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('[Chart] GraficoPerformance montado');
  }, []);
  
  // O hook retorna ordenado por performance, precisamos voltar para ordem cronológica (D a S) para o gráfico
  const data = useMemo(() => {
    console.log('[Chart] Recalculando dados GraficoPerformance');
    return [...performanceDia].sort((a, b) => a.diaSemana - b.diaSemana);
  }, [performanceDia]);
  
  // Encontrar o valor máximo para dar destaque
  const maxMedia = useMemo(() => Math.max(...data.map(d => d.media)), [data]);

  if (!mounted) {
    return (
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm h-[280px] animate-pulse" />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Eficiência Média</h3>
        <p className="text-xl font-black text-slate-800">Performance por Dia</p>
      </div>

      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="nome" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
              tickFormatter={(val) => val.charAt(0).toUpperCase()} // Mostra só a primeira letra
              dy={10}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc', radius: 8 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {payload[0].payload.nome}
                      </p>
                      <p className="text-lg font-black text-blue-400">
                        {payload[0].value}% <span className="text-xs font-normal text-slate-500">médio</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="media" radius={[8, 8, 8, 8]} animationDuration={1500}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.media === maxMedia && maxMedia > 0 ? '#3b82f6' : '#e2e8f0'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
