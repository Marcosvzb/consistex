'use client';

import { cn } from '@/utilitarios/ui';

const DIAS = [
  { id: 0, label: 'D' },
  { id: 1, label: 'S' },
  { id: 2, label: 'T' },
  { id: 3, label: 'Q' },
  { id: 4, label: 'Q' },
  { id: 5, label: 'S' },
  { id: 6, label: 'S' },
];

interface SeletorFrequenciaProps {
  frequencia: number[];
  onChange: (frequencia: number[]) => void;
  corSelecionada: string;
}

export function SeletorFrequencia({ frequencia, onChange, corSelecionada }: SeletorFrequenciaProps) {
  const alternarDia = (id: number) => {
    if (frequencia.includes(id)) {
      onChange(frequencia.filter(d => d !== id));
    } else {
      onChange([...frequencia, id].sort());
    }
  };

  const selecionarRapido = (tipo: 'todos' | 'uteis' | 'fds') => {
    if (tipo === 'todos') onChange([0, 1, 2, 3, 4, 5, 6]);
    if (tipo === 'uteis') onChange([1, 2, 3, 4, 5]);
    if (tipo === 'fds') onChange([0, 6]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-1">
        {DIAS.map((dia) => {
          const selecionado = frequencia.includes(dia.id);
          return (
            <button
              key={dia.id}
              type="button"
              onClick={() => alternarDia(dia.id)}
              className={cn(
                "w-10 h-10 rounded-xl font-bold text-xs transition-all duration-300",
                selecionado 
                  ? `${corSelecionada} text-white shadow-md` 
                  : "bg-slate-50 text-slate-400"
              )}
            >
              {dia.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        {[
          { id: 'todos', label: 'Todos os dias' },
          { id: 'uteis', label: 'Dias úteis' },
          { id: 'fds', label: 'Fim de semana' },
        ].map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={() => selecionarRapido(btn.id as any)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors"
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
