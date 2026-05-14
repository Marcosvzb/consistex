'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/utilitarios/ui';

interface LoadingBrandingProps {
  tamanho?: number;
  className?: string;
  mensagem?: string;
}

export function LoadingBranding({ tamanho = 80, className, mensagem }: LoadingBrandingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
      <div className="relative">
        {/* Glow animado */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl"
        />
        
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10"
        >
          <Image
            src="/logo-icon.png"
            alt="Carregando..."
            width={tamanho}
            height={tamanho}
            priority
            className="drop-shadow-xl"
          />
        </motion.div>
      </div>

      {mensagem && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-400 text-sm font-medium animate-pulse uppercase tracking-[0.2em]"
        >
          {mensagem}
        </motion.p>
      )}
    </div>
  );
}
