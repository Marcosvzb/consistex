'use client';

import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { format, addMonths, subMonths, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame, Target, CheckCircle2, Calendar } from 'lucide-react';
import { cn } from '@/utilitarios/ui';
import { useHabitoStore } from '@/store/useHabitoStore';
import { gerarGradeMensal, obterCorIntensidade, pertenceAoMes } from '@/utilitarios/heatmap';
import { calcularStreakAteData } from '@/utilitarios/data';

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Componente de Dia memorizado para evitar rerenders da grade inteira
const DiaHeatmap = React.memo(({ 
  dia, 
  isMesAtual, 
  porcentagem, 
  selecionado, 
  hoje, 
  onSelect 
}: { 
  dia: Date, 
  isMesAtual: boolean, 
  porcentagem: number, 
  selecionado: boolean, 
  hoje: boolean, 
  onSelect: (iso: string) => void 
}) => {
  const iso = useMemo(() => format(dia, 'yyyy-MM-dd'), [dia]);
  const corClass = useMemo(() => obterCorIntensidade(porcentagem, isMesAtual), [porcentagem, isMesAtual]);

  return (
    <div className="relative aspect-square">
      <motion.button
        whileHover={isMesAtual ? { scale: 1.05, zIndex: 20 } : {}}
        whileTap={isMesAtual ? { scale: 0.9 } : {}}
        onClick={() => isMesAtual && onSelect(iso)}
        className={cn(
          "w-full h-full rounded-xl flex items-center justify-center text-[11px] font-bold transition-all duration-300",
          corClass,
          selecionado && "ring-4 ring-slate-900 ring-offset-2 z-10 scale-105",
          !isMesAtual && "cursor-default"
        )}
      >
        {format(dia, 'd')}
        
        {hoje && isMesAtual && (
          <div className={cn(
            "absolute top-1 right-1 w-1.5 h-1.5 rounded-full",
            porcentagem > 50 ? "bg-white" : "bg-emerald-500"
          )} />
        )}
      </motion.button>
    </div>
  );
});

DiaHeatmap.displayName = 'DiaHeatmap';

export function HeatmapMensal() {
  const { registros, habitos } = useHabitoStore();
  const [mesReferencia, setMesReferencia] = useState(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const grade = useMemo(() => gerarGradeMensal(mesReferencia), [mesReferencia]);

  const navegarMes = useCallback((direcao: 'anterior' | 'proximo' | 'hoje') => {
    setIsNavigating(true);
    setDiaSelecionado(null);
    
    // Pequeno delay para animação de saída fluida
    setTimeout(() => {
      setMesReferencia(prev => {
        if (direcao === 'hoje') return new Date();
        return direcao === 'anterior' ? subMonths(prev, 1) : addMonths(prev, 1);
      });
      setIsNavigating(false);
    }, 200);
  }, []);

  const handleSelectDia = useCallback((iso: string) => {
    setDiaSelecionado(prev => prev === iso ? null : iso);
  }, []);

  const dadosDiaSelecionado = useMemo(() => {
    if (!diaSelecionado) return null;
    const registro = registros[diaSelecionado];
    const streak = calcularStreakAteData(registros, diaSelecionado);
    const totalHabitos = habitos.length;
    const concluidos = registro ? Object.values(registro.habitos).filter(Boolean).length : 0;
    
    return {
      data: parseISO(diaSelecionado),
      porcentagem: registro?.porcentagemConclusao || 0,
      concluidos,
      total: totalHabitos,
      streak
    };
  }, [diaSelecionado, registros, habitos.length]);

  return (
    <section className="px-4 mb-12">
      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Header Elegante */}
        <div className="p-6 pb-2">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
                Consistência
              </span>
              <h3 className="text-2xl font-black text-slate-800 capitalize flex items-center gap-2">
                {format(mesReferencia, 'MMMM', { locale: ptBR })}
                <span className="text-slate-300 font-light">{format(mesReferencia, 'yyyy')}</span>
              </h3>
            </div>
            
            <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              <button 
                onClick={() => navegarMes('anterior')}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white hover:shadow-sm transition-all active:scale-90"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {!isToday(mesReferencia) && (
                <button 
                  onClick={() => navegarMes('hoje')}
                  className="px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider"
                >
                  Hoje
                </button>
              )}

              <button 
                onClick={() => navegarMes('proximo')}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white hover:shadow-sm transition-all active:scale-90"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dias da Semana */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {DIAS_SEMANA.map((d, i) => (
              <div key={i} className="text-[9px] font-black text-slate-300 text-center uppercase tracking-widest">
                {d}
              </div>
            ))}
          </div>
        </div>

        {/* Grid do Calendário */}
        <div className="px-6 pb-8 relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={mesReferencia.toISOString()}
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: "circOut" }}
              className={cn(
                "grid grid-cols-7 gap-2 transition-opacity duration-300",
                isNavigating ? "opacity-50" : "opacity-100"
              )}
            >
              {grade.map((dia) => {
                const iso = format(dia, 'yyyy-MM-dd');
                const isMesAtual = pertenceAoMes(dia, mesReferencia);
                const registro = registros[iso];
                const porcentagem = registro?.porcentagemConclusao || 0;
                const selecionado = diaSelecionado === iso;
                const hoje = isToday(dia);

                return (
                  <DiaHeatmap
                    key={iso}
                    dia={dia}
                    isMesAtual={isMesAtual}
                    porcentagem={porcentagem}
                    selecionado={selecionado}
                    hoje={hoje}
                    onSelect={handleSelectDia}
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Tooltip de Detalhes Premium */}
          <AnimatePresence>
            {diaSelecionado && dadosDiaSelecionado && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="mt-8 relative z-20"
              >
                <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-2xl shadow-slate-900/30 overflow-hidden relative">
                  {/* Background Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[50px] rounded-full -mr-16 -mt-16" />
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-400 mb-1">
                        <Calendar className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                          {format(dadosDiaSelecionado.data, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                        </span>
                      </div>
                      <h4 className="text-xl font-black">Resumo do Dia</h4>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                      <span className="text-2xl font-black text-emerald-400">{dadosDiaSelecionado.porcentagem}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-xs font-bold text-slate-400">Progresso</span>
                      </div>
                      <p className="text-lg font-bold">
                        {dadosDiaSelecionado.concluidos} <span className="text-slate-500 text-sm font-medium">de {dadosDiaSelecionado.total}</span>
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center">
                          <Flame className="w-4 h-4 text-orange-400" />
                        </div>
                        <span className="text-xs font-bold text-slate-400">Streak</span>
                      </div>
                      <p className="text-lg font-bold">
                        {dadosDiaSelecionado.streak} <span className="text-slate-500 text-sm font-medium">dias</span>
                      </p>
                    </div>
                  </div>

                  {dadosDiaSelecionado.porcentagem === 100 && (
                    <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-3">
                      <Target className="w-4 h-4 text-emerald-400" />
                      <p className="text-xs text-emerald-200 font-medium">Dia perfeito! Você atingiu sua meta total.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legenda Minimalista */}
        <div className="px-6 py-6 border-t border-slate-50 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Intensidade</span>
            <div className="flex gap-1.5">
              {[0, 25, 50, 75, 100].map(p => (
                <div 
                  key={p} 
                  className={cn(
                    "w-3 h-3 rounded-[4px] shadow-sm", 
                    obterCorIntensidade(p, true)
                  )} 
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Hoje
          </div>
        </div>
      </div>
    </section>
  );
}
