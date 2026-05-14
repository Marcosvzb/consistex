'use client';

import { motion } from 'framer-motion';
import { Bell, Clock } from 'lucide-react';
import { Botao } from '@/componentes/ui/Botao';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { cn } from '@/utilitarios/ui';

export function EtapaLembretes() {
  const { setEtapaAtual, configuracoes, setNotificacoes, setHorarioLembrete } = useOnboardingStore();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full"
    >
      <header className="mb-10">
        <h2 className="text-2xl font-bold mb-2">Não perca o ritmo</h2>
        <p className="text-slate-500 text-sm">
          Lembretes ajudam a manter a consistência nos primeiros dias.
        </p>
      </header>

      <div className="space-y-6 flex-1">
        {/* Toggle Notificações */}
        <div 
          onClick={() => setNotificacoes(!configuracoes.notificacoesAtivas)}
          className={cn(
            "p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between",
            configuracoes.notificacoesAtivas ? "bg-emerald-50 border-emerald-100" : "bg-white border-slate-100"
          )}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
              configuracoes.notificacoesAtivas ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
            )}>
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Lembretes diários</h4>
              <p className="text-xs text-slate-500">Notificações no celular</p>
            </div>
          </div>
          
          <div className={cn(
            "w-12 h-6 rounded-full transition-colors relative",
            configuracoes.notificacoesAtivas ? "bg-emerald-500" : "bg-slate-200"
          )}>
            <motion.div 
              animate={{ x: configuracoes.notificacoesAtivas ? 24 : 4 }}
              className="w-4 h-4 bg-white rounded-full absolute top-1"
            />
          </div>
        </div>

        {/* Seletor de Horário */}
        {configuracoes.notificacoesAtivas && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl border border-slate-100 bg-white"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Melhor horário</h4>
                <p className="text-xs text-slate-500">Quando você quer ser lembrado?</p>
              </div>
            </div>

            <input 
              type="time" 
              value={configuracoes.horarioLembrete}
              onChange={(e) => setHorarioLembrete(e.target.value)}
              className="w-full p-4 bg-slate-50 rounded-2xl text-2xl font-bold text-center text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </motion.div>
        )}
      </div>

      <div className="mt-auto pt-8">
        <Botao 
          tamanho="full" 
          onClick={() => setEtapaAtual(4)}
          className="bg-slate-900 text-white py-6 text-lg rounded-2xl shadow-xl shadow-slate-200"
        >
          Tudo Pronto
        </Botao>
        <button 
          onClick={() => setEtapaAtual(2)}
          className="w-full text-slate-400 text-sm font-medium py-4"
        >
          Voltar para hábitos
        </button>
      </div>
    </motion.div>
  );
}
