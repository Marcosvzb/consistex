'use client';

import { format, addDays, startOfWeek, subWeeks, addWeeks, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/utilitarios/ui';
import { useInterfaceStore } from '@/store/useInterfaceStore';
import { obterHojeISO } from '@/utilitarios/data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';

export function SeletorData() {
  const { dataSelecionada, setDataSelecionada } = useInterfaceStore();
  const hoje = new Date();
  
  // Controle da semana exibida
  const [semanaAtual, setSemanaAtual] = useState(() => startOfWeek(hoje, { weekStartsOn: 0 }));
  const scrollRef = useRef<HTMLDivElement>(null);

  // Gera os 7 dias da semana exibida
  const dias = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(semanaAtual, i));
  }, [semanaAtual]);

  const handleSemanaAnterior = () => setSemanaAtual(prev => subWeeks(prev, 1));
  
  const handleProximaSemana = () => {
    const proxima = addWeeks(semanaAtual, 1);
    // Limite futuro: não avançar muito além de hoje (+7 dias)
    if (!isAfter(proxima, addDays(hoje, 7))) {
      setSemanaAtual(proxima);
    }
  };

  const limiteFuturoAtingido = isAfter(addWeeks(semanaAtual, 1), addDays(hoje, 7));

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="font-bold text-slate-800 capitalize">
          {format(semanaAtual, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={handleSemanaAnterior}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={handleProximaSemana}
            disabled={limiteFuturoAtingido}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
              limiteFuturoAtingido ? "bg-slate-50 text-slate-300" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex justify-between items-center overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar touch-pan-x snap-x snap-mandatory"
      >
        {dias.map((dia) => {
          const iso = format(dia, 'yyyy-MM-dd');
          const ativo = dataSelecionada === iso;
          const eHoje = iso === obterHojeISO();

          return (
            <button
              key={iso}
              onClick={() => setDataSelecionada(iso)}
              className={cn(
                "snap-center flex flex-col items-center justify-center min-w-[3.5rem] h-20 rounded-2xl transition-all select-none",
                ativo ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
              )}
            >
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider mb-1",
                ativo ? "text-slate-300" : "text-slate-400"
              )}>
                {format(dia, 'EEE', { locale: ptBR }).charAt(0)}
              </span>
              <span className="text-lg font-bold">
                {format(dia, 'dd')}
              </span>
              {eHoje && !ativo && (
                <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1" />
              )}
              {eHoje && ativo && (
                <div className="w-1 h-1 bg-white rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
