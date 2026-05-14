'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Botao } from '@/componentes/ui/Botao';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import Image from 'next/image';

export function EtapaBoasVindas() {
  const { setEtapaAtual } = useOnboardingStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center text-center h-full"
    >
      <div className="w-32 h-32 flex items-center justify-center mb-10 relative">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-emerald-400 rounded-full blur-[40px]"
        />
        <div className="relative z-10 p-4 bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-200/50 border border-emerald-50">
          <Image 
            src="/logo-icon.png" 
            alt="Consistex" 
            width={80} 
            height={80} 
            priority
            className="drop-shadow-lg"
          />
        </div>
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-4 text-slate-900">
        Bem-vindo ao <span className="text-emerald-500">Consistex</span>
      </h1>
      
      <p className="text-slate-500 text-lg mb-12 max-w-xs mx-auto leading-relaxed">
        Sua jornada para uma vida mais consistente e saudável começa aqui.
      </p>

      <div className="w-full mt-auto">
        <Botao 
          tamanho="full" 
          onClick={() => setEtapaAtual(2)}
          className="bg-slate-900 text-white py-6 text-lg rounded-2xl shadow-xl shadow-slate-200"
        >
          Começar Jornada
        </Botao>
      </div>
    </motion.div>
  );
}
