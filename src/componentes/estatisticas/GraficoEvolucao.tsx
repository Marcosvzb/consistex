'use client';

import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, YAxis } from 'recharts';
import { useEstatisticas } from '@/ganchos/useEstatisticas';
import { motion } from 'framer-motion';
import { useEffect, useState, useMemo, memo } from 'react';

const X_AXIS_TICK = { fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' };
const Y_AXIS_TICK = { fill: '#cbd5e1', fontSize: 10 };
const TOOLTIP_CURSOR = { stroke: '#f1f5f9', strokeWidth: 2, strokeDasharray: '4 4' };
const CHART_MARGIN = { top: 10, right: 0, left: -20, bottom: 0 };
const AREA_GRADIENT_STOP_1 = { stopColor: "#10b981", stopOpacity: 0.3 };
const AREA_GRADIENT_STOP_2 = { stopColor: "#10b981", stopOpacity: 0 };

interface GraficoEvolucaoProps {
  dados: ReturnType<typeof useEstatisticas>;
}

export const GraficoEvolucao = memo(({ dados }: GraficoEvolucaoProps) => {
  const { evolucaoSemanal } = dados;
  const [mounted, setMounted] = useState(false);

  console.log('[Chart] GraficoEvolucao render');

  useEffect(() => {
    setMounted(true);
    console.log('[Chart] GraficoEvolucao montado');
    return () => console.log('[Chart] GraficoEvolucao desmontado');
  }, []);

  const data = useMemo(() => {
    console.log('[Chart] Recalculando dados GraficoEvolucao');
    return [...evolucaoSemanal].reverse();
  }, [evolucaoSemanal]);

  const tickFormatter = useMemo(() => (val: number) => `${val}%`, []);

  if (!mounted) {
    return (
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm h-[320px] min-h-[320px] animate-pulse" />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Últimos 7 dias</h3>
        <p className="text-xl font-black text-slate-800">Evolução Semanal</p>
      </div>

      <div className="w-full h-[200px] min-h-[200px]">
        <ResponsiveContainer width="100%" height={200} minWidth={300} minHeight={200}>
          <AreaChart data={data} margin={CHART_MARGIN}>
            <defs>
              <linearGradient id="colorPorcentagem" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" {...AREA_GRADIENT_STOP_1} />
                <stop offset="95%" {...AREA_GRADIENT_STOP_2} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="dia" 
              axisLine={false} 
              tickLine={false} 
              tick={X_AXIS_TICK}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={Y_AXIS_TICK}
              domain={[0, 100]}
              tickFormatter={tickFormatter}
            />
            <Tooltip 
              cursor={TOOLTIP_CURSOR}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {payload[0].payload.dia}
                      </p>
                      <p className="text-lg font-black text-emerald-400">
                        {payload[0].value}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="porcentagem" 
              stroke="#10b981" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorPorcentagem)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});

GraficoEvolucao.displayName = 'GraficoEvolucao';
