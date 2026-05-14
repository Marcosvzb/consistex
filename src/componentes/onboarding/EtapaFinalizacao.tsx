'use client';

import { motion } from 'framer-motion';
import { Rocket, CheckCircle2, Calendar, Bell } from 'lucide-react';
import { Botao } from '@/componentes/ui/Botao';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useOnboarding } from '@/ganchos/useOnboarding';
import Image from 'next/image';

export function EtapaFinalizacao() {
  const { habitosTemporarios, configuracoes } = useOnboardingStore();
  const { usuario } = useAuthStore();
  const { mutate: finalizar, isPending } = useOnboarding();

  const handleFinalizar = () => {
    if (usuario) {
      finalizar({
        uid: usuario.uid,
        habitos: habitosTemporarios,
        configuracoes
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col h-full text-center"
    >
      <div className="w-24 h-24 flex items-center justify-center mx-auto mb-8 relative">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-emerald-400/20 rounded-full blur-[30px]"
        />
        <div className="relative z-10 p-3 bg-white rounded-3xl shadow-xl border border-slate-50">
          <Image 
            src="/logo-icon.png" 
            alt="Sucesso" 
            width={70} 
            height={70}
          />
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-4">Quase lá!</h2>
      <p className="text-slate-500 mb-10 max-w-xs mx-auto">
        Sua base para uma vida de consistência foi criada com sucesso.
      </p>

      <div className="bg-white border border-slate-100 rounded-[2rem] p-6 text-left space-y-4 mb-12 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Resumo da Jornada</h3>
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{habitosTemporarios.length} Hábitos ativos</p>
            <p className="text-[10px] text-slate-400 font-medium italic">Frequência diária</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Check-in disponível</p>
            <p className="text-[10px] text-slate-400 font-medium italic">A partir de agora</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              {configuracoes.notificacoesAtivas ? `Lembrete às ${configuracoes.horarioLembrete}` : 'Lembretes desativados'}
            </p>
            <p className="text-[10px] text-slate-400 font-medium italic">Pode ser alterado nos ajustes</p>
          </div>
        </div>
      </div>

      <p className="text-emerald-600 font-bold mb-8 animate-pulse italic">
        "O sucesso é o somatório de pequenos esforços repetidos dia após dia."
      </p>

      <div className="mt-auto">
        <Botao 
          tamanho="full" 
          estaCarregando={isPending}
          onClick={handleFinalizar}
          className="bg-emerald-500 text-white py-6 text-lg rounded-2xl shadow-xl shadow-emerald-100 border-none"
        >
          {isPending ? 'Preparando tudo...' : 'Começar Agora'}
        </Botao>
      </div>
    </motion.div>
  );
}
