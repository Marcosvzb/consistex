'use client';

import * as React from 'react';
import { OBTER_ICONE } from '@/constantes/icones';
import { cn } from '@/utilitarios/ui';
import { motion } from 'framer-motion';

interface IconeHabitoProps {
  icone: string;
  cor: string;
  concluido?: boolean;
  tamanho?: 'sm' | 'md' | 'lg';
  className?: string;
  animar?: boolean;
}

export function IconeHabito({ 
  icone, 
  cor, 
  concluido = false, 
  tamanho = 'md', 
  className,
  animar = true
}: IconeHabitoProps) {
  const Icone = OBTER_ICONE(icone);
  
  // Deriva classes de cores baseadas no padrão 'bg-cor-500'
  const corBase = cor.replace('bg-', ''); // ex: 'emerald-500'
  const corNome = corBase.split('-')[0]; // ex: 'emerald'
  
  const tamanhos = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-12 h-12 rounded-2xl',
    lg: 'w-14 h-14 rounded-[1.25rem]'
  };

  const iconTamanhos = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  };

  // Cores dinâmicas usando classes de utilidade do Tailwind
  // Como as classes são dinâmicas, o Tailwind precisa tê-las no safelist ou serem literais
  // No Consistex, assumimos que as cores da CORES_PALETA estão mapeadas
  const bgClass = concluido 
    ? `bg-${corNome}-500/20` 
    : `bg-${corNome}-500/10`;
  
  const textClass = `text-${corNome}-500`;

  const content = (
    <div 
      className={cn(
        "flex items-center justify-center transition-all duration-300",
        tamanhos[tamanho],
        bgClass,
        textClass,
        className
      )}
    >
      <Icone className={cn(iconTamanhos[tamanho], "transition-transform duration-300")} />
    </div>
  );

  if (!animar) return content;

  return (
    <motion.div
      animate={{ 
        scale: concluido ? 1.05 : 1,
        filter: concluido ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.2))' : 'none'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {content}
    </motion.div>
  );
}
