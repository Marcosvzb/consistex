'use client';

import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, YAxis } from 'recharts';
import { useEstatisticas } from '@/ganchos/useEstatisticas';
import { motion } from 'framer-motion';

export function GraficoEvolucao() {
  const { evolucaoSemanal } = useEstatisticas();

  // Inverter para mostrar da esquerda (mais antigo) para direita (mais recente)
  const data = [...evolucaoSemanal].reverse();

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

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPorcentagem" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="dia" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#cbd5e1', fontSize: 10 }}
              domain={[0, 100]}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip 
              cursor={{ stroke: '#f1f5f9', strokeWidth: 2, strokeDasharray: '4 4' }}
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
}
