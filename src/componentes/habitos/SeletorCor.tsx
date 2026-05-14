'use client';

import { cn } from '@/utilitarios/ui';

export const CORES_PALETA = [
  { id: 'emerald', bg: 'bg-emerald-500', light: 'bg-emerald-50' },
  { id: 'rose', bg: 'bg-rose-500', light: 'bg-rose-50' },
  { id: 'blue', bg: 'bg-blue-500', light: 'bg-blue-50' },
  { id: 'amber', bg: 'bg-amber-500', light: 'bg-amber-50' },
  { id: 'violet', bg: 'bg-violet-500', light: 'bg-violet-50' },
  { id: 'indigo', bg: 'bg-indigo-500', light: 'bg-indigo-50' },
  { id: 'cyan', bg: 'bg-cyan-500', light: 'bg-cyan-50' },
  { id: 'orange', bg: 'bg-orange-500', light: 'bg-orange-50' },
];

interface SeletorCorProps {
  corSelecionada: string;
  onChange: (cor: string) => void;
}

export function SeletorCor({ corSelecionada, onChange }: SeletorCorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {CORES_PALETA.map((cor) => (
        <button
          key={cor.id}
          type="button"
          onClick={() => onChange(cor.bg)}
          className={cn(
            "w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center border-2",
            cor.bg,
            corSelecionada === cor.bg ? "border-slate-900 scale-110 shadow-lg" : "border-transparent"
          )}
        >
          {corSelecionada === cor.bg && (
            <div className="w-2 h-2 bg-white rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
