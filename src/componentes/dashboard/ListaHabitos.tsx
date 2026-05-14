'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { OBTER_ICONE } from '@/constantes/icones';
import { cn } from '@/utilitarios/ui';
import { useDashboard } from '@/ganchos/useDashboard';
import { useHabitosDia } from '@/ganchos/useHabitosDia';
import * as React from 'react';
import { useState } from 'react';
import { ConfirmacaoDesmarcar } from '../habitos/ConfirmacaoDesmarcar';

import { IconeHabito } from '../ui/IconeHabito';

// Memorizado para evitar rerenders desnecessários do componente
const HabitoItem = React.memo(({ habito, concluido, aoClicar }: { habito: any, concluido: boolean, aoClicar: () => void }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.98 }}
      onClick={aoClicar}
      className={cn(
        "p-4 rounded-[1.25rem] border transition-all flex items-center justify-between cursor-pointer select-none",
        concluido 
          ? "bg-emerald-50/50 border-emerald-200 shadow-sm shadow-emerald-100/50" 
          : "bg-white border-slate-100 shadow-sm hover:border-slate-200"
      )}
    >
      <div className="flex items-center gap-4">
        <IconeHabito 
          icone={habito.icone} 
          cor={habito.cor} 
          concluido={concluido} 
        />
        <div>
          <h3 className={cn(
            "font-bold transition-all text-base", 
            concluido ? "text-slate-400 line-through decoration-slate-300" : "text-slate-800"
          )}>
            {habito.titulo}
          </h3>
          {habito.descricao && (
            <p className="text-xs text-slate-400 font-medium truncate max-w-[150px]">{habito.descricao}</p>
          )}
        </div>
      </div>

      <div className={cn("transition-colors relative", concluido ? "text-emerald-500" : "text-slate-200")}>
        {concluido ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <CheckCircle2 className="w-7 h-7 fill-emerald-100" />
          </motion.div>
        ) : (
          <Circle className="w-7 h-7" />
        )}
      </div>
    </motion.div>
  );
});
HabitoItem.displayName = 'HabitoItem';

export function ListaHabitos() {
  const { habitos, registroDia, dataSelecionada } = useHabitosDia();
  const { marcarHabito } = useDashboard();
  
  const [confirmarAberto, setConfirmarAberto] = useState(false);
  const [habitoParaDesmarcar, setHabitoParaDesmarcar] = useState<any>(null);

  const handleToggleHabito = (habito: any) => {
    const isConcluido = !!registroDia?.habitos[habito.id];

    if (isConcluido) {
      // Se já está concluído e o usuário clicou, abre confirmação
      setHabitoParaDesmarcar(habito);
      setConfirmarAberto(true);
    } else {
      // Se não está concluído, marca instantaneamente
      marcarHabito({ 
        habitoId: habito.id, 
        concluido: true, 
        data: dataSelecionada 
      });
    }
  };

  const confirmarDesmarcar = () => {
    if (!habitoParaDesmarcar) return;
    
    marcarHabito({ 
      habitoId: habitoParaDesmarcar.id, 
      concluido: false, 
      data: dataSelecionada 
    });
    
    setConfirmarAberto(false);
    setHabitoParaDesmarcar(null);
  };

  if (habitos.length === 0) {
    return (
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 text-center shadow-sm">
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-2">Pausa Planejada</p>
        <p className="text-slate-500 font-medium">Nenhum hábito agendado para hoje.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 mb-10">
        {habitos.map((habito) => (
          <HabitoItem 
            key={habito.id} 
            habito={habito} 
            concluido={!!registroDia?.habitos[habito.id]} 
            aoClicar={() => handleToggleHabito(habito)} 
          />
        ))}
      </div>

      <ConfirmacaoDesmarcar 
        open={confirmarAberto}
        onOpenChange={setConfirmarAberto}
        onConfirm={confirmarDesmarcar}
        habitoTitulo={habitoParaDesmarcar?.titulo || ''}
      />
    </>
  );
}
