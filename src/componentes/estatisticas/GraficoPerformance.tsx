'use client';

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useEstatisticas } from '@/ganchos/useEstatisticas';
import { motion } from 'framer-motion';
import { useEffect, useState, useMemo, memo, useCallback } from 'react';

const X_AXIS_TICK = { fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' };
const TOOLTIP_CURSOR = { fill: '#f8fafc', radius: 8 };
const BAR_RADIUS: [number, number, number, number] = [8, 8, 8, 8];
const CHART_MARGIN = { top: 0, right: 0, left: 0, bottom: 0 };

interface GraficoPerformanceProps {
  dados: ReturnType<typeof useEstatisticas>;
}

export const GraficoPerformance = memo(({ dados }: GraficoPerformanceProps) => {
  const { performanceDia } = dados;
  const [mounted, setMounted] = useState(false);

  console.log('[Chart] GraficoPerformance render');

  useEffect(() => {
    setMounted(true);
    console.log('[Chart] GraficoPerformance montado');
    return () => console.log('[Chart] GraficoPerformance desmontado');
  }, []);
  
  const data = useMemo(() => {
    console.log('[Chart] Recalculando dados GraficoPerformance');
    return [...performanceDia].sort((a, b) => a.diaSemana - b.diaSemana);
  }, [performanceDia]);
  
  const maxMedia = useMemo(() => Math.max(...data.map(d => d.media)), [data]);

  const tickFormatter = useCallback((val: string) => val.charAt(0).toUpperCase(), []);

  if (!mounted) {
    return (
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm h-[280px] min-h-[280px] animate-pulse" />
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

      <div className="w-full h-40 min-h-[160px]">
        <ResponsiveContainer width="100%" height={160} minWidth={300} minHeight={160}>
          <BarChart data={data} margin={CHART_MARGIN}>
            <XAxis 
              dataKey="nome" 
              axisLine={false} 
              tickLine={false} 
              tick={X_AXIS_TICK}
              tickFormatter={tickFormatter}
              dy={10}
            />
            <Tooltip 
              cursor={TOOLTIP_CURSOR}
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
            <Bar dataKey="media" radius={BAR_RADIUS} animationDuration={1500}>
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
});

GraficoPerformance.displayName = 'GraficoPerformance';
