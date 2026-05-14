'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useHabitoStore } from '@/store/useHabitoStore';
import { formatarData } from '@/utilitarios/data';
import { calcularStreak } from '@/utilitarios/data';
import { Flame, User, Bell } from 'lucide-react';
import { useInterfaceStore } from '@/store/useInterfaceStore';
import { motion, AnimatePresence } from 'framer-motion';
import { obterPrimeiroNome } from '@/utilitarios/perfil';
import Link from 'next/link';
import { useNotificacoes } from '@/ganchos/useNotificacoes';
import Image from 'next/image';

export function Header() {
  const { perfil, estaCarregando } = useAuthStore();
  const { registros } = useHabitoStore();
  const { dataAtual } = useInterfaceStore();
  const { naoLidasCount } = useNotificacoes();
  
  const streakAtual = calcularStreak(registros);
  
  const primeiroNome = obterPrimeiroNome(perfil?.nome);

  return (
    <header className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md pt-6 pb-4 mb-4 safe-top transition-colors">
      <div className="flex justify-between items-center mb-6 px-1">
        <Image 
          src="/logo-icon.png" 
          alt="Consistex" 
          width={28} 
          height={28} 
          className="drop-shadow-sm"
        />
        <div className="flex items-center gap-3">
          {/* Bell de Notificações */}
          <Link href="/notificacoes" className="relative p-2 bg-white rounded-full shadow-sm border border-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <Bell className="w-5 h-5" />
            {naoLidasCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full" />
            )}
          </Link>
          
          <AnimatePresence mode="wait">
            {estaCarregando && !perfil ? (
              <motion.div 
                key="skeleton-avatar"
                className="w-10 h-10 rounded-full bg-slate-200 animate-pulse border-2 border-white shadow-sm"
              />
            ) : (
              <motion.div
                key="real-avatar"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {perfil?.fotoUrl ? (
                  <img src={perfil.fotoUrl} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-500 font-bold">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-between items-start">
        <div className="flex-1">
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70"
          >
            {formatarData(dataAtual, "EEEE, dd 'de' MMM")}
          </motion.p>
          
          <AnimatePresence mode="wait">
            {estaCarregando && !perfil ? (
              <motion.div 
                key="skeleton-name"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg mt-1"
              />
            ) : (
              <motion.h1 
                key="real-name"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-slate-900 tracking-tight"
              >
                Olá, {primeiroNome}! 👋
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
        
        {streakAtual > 0 && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1.5 bg-orange-100/50 px-3 py-1.5 rounded-full border border-orange-200/50"
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="text-xs font-black text-orange-700">{streakAtual}</span>
          </motion.div>
        )}
      </div>
    </header>
  );
}
