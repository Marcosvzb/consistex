'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utilitarios/ui';
import { forwardRef } from 'react';

interface BotaoProps extends HTMLMotionProps<'button'> {
  variante?: 'primario' | 'secundario' | 'fantasma' | 'perigo';
  tamanho?: 'sm' | 'md' | 'lg' | 'full';
  estaCarregando?: boolean;
}

const Botao = forwardRef<HTMLButtonElement, BotaoProps>(
  ({ className, variante = 'primario', tamanho = 'md', estaCarregando, children, ...props }, ref) => {
    const variantes = {
      primario: 'bg-accent text-white shadow-premium hover:opacity-90 active:scale-95',
      secundario: 'bg-white text-slate-800 border border-slate-100 shadow-sm hover:bg-slate-50 active:scale-95',
      fantasma: 'bg-transparent text-slate-600 hover:bg-slate-100 active:scale-95',
      perigo: 'bg-red-500 text-white shadow-premium hover:bg-red-600 active:scale-95',
    };

    const tamanhos = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg font-semibold',
      full: 'w-full py-3.5 text-base font-semibold',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative flex items-center justify-center rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none outline-none focus:ring-2 focus:ring-accent/20',
          variantes[variante],
          tamanhos[tamanho],
          className
        )}
        {...props}
      >
        {estaCarregando ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Carregando...</span>
          </div>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Botao.displayName = 'Botao';

export { Botao };
