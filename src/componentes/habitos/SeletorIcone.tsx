'use client';

import { CATEGORIAS_ICONES, OBTER_ICONE } from '@/constantes/icones';
import { cn } from '@/utilitarios/ui';

interface SeletorIconeProps {
  iconeSelecionado: string;
  onChange: (icone: string) => void;
  corSelecionada: string;
}

export function SeletorIcone({ iconeSelecionado, onChange, corSelecionada }: SeletorIconeProps) {
  return (
    <div className="space-y-6">
      {CATEGORIAS_ICONES.map((categoria) => (
        <div key={categoria.id} className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
            {categoria.label}
          </h4>
          <div className="grid grid-cols-6 gap-2">
            {categoria.icones.map((nome) => {
              const Icone = OBTER_ICONE(nome);
              const selecionado = iconeSelecionado === nome;
              
              return (
                <button
                  key={nome}
                  type="button"
                  onClick={() => onChange(nome)}
                  className={cn(
                    "aspect-square rounded-xl flex items-center justify-center transition-all duration-300",
                    selecionado 
                      ? `${corSelecionada} text-white shadow-lg` 
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                  )}
                >
                  <Icone className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
