'use client';

import { ShellMobile } from '@/componentes/layout/ShellMobile';
import { useNotificacoes } from '@/ganchos/useNotificacoes';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Flame, Info, RotateCcw, Target } from 'lucide-react';
import { cn } from '@/utilitarios/ui';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ICONES_MAP: Record<string, any> = {
  lembrete: Bell,
  insight: Target,
  streak: Flame,
  sistema: Info,
  recuperacao: RotateCcw
};

export default function NotificacoesPage() {
  const { notificacoes, estaCarregando, marcarComoLida, marcarTodasComoLidas, naoLidasCount } = useNotificacoes();

  return (
    <ShellMobile>
      <header className="mb-6 px-2 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800 mb-1 tracking-tight">Notificações</h1>
          <p className="text-slate-400 font-medium">Suas mensagens e insights.</p>
        </div>
        {naoLidasCount > 0 && (
          <button 
            onClick={marcarTodasComoLidas}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Lidas
          </button>
        )}
      </header>

      {estaCarregando ? (
        <div className="space-y-3 px-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : notificacoes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-lg font-bold text-slate-800">Tudo limpo por aqui!</p>
          <p className="text-slate-400 font-medium text-sm mt-2">Nenhuma notificação nova no momento.</p>
        </div>
      ) : (
        <div className="space-y-3 px-2 pb-12">
          <AnimatePresence>
            {notificacoes.map((notif) => {
              const Icone = ICONES_MAP[notif.tipo] || Bell;
              // Tratamento seguro para data que pode vir do Firestore (Timestamp)
              const dataObj = notif.criadaEm && typeof (notif.criadaEm as any).toDate === 'function' 
                ? (notif.criadaEm as any).toDate() 
                : new Date(notif.criadaEm as any);

              return (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => !notif.lida && marcarComoLida(notif.id)}
                  className={cn(
                    "p-4 rounded-3xl border transition-all relative overflow-hidden cursor-pointer",
                    notif.lida 
                      ? "bg-white border-slate-100 opacity-70" 
                      : "bg-slate-50 border-slate-200 shadow-sm"
                  )}
                >
                  {!notif.lida && (
                    <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full" />
                  )}
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                      notif.lida ? "bg-slate-100 text-slate-400" : "bg-white text-slate-600 shadow-sm"
                    )}>
                      <Icone className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pr-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {format(dataObj, "dd MMM • HH:mm", { locale: ptBR })}
                      </p>
                      <h4 className={cn("font-bold mb-1", notif.lida ? "text-slate-600" : "text-slate-800")}>
                        {notif.titulo}
                      </h4>
                      <p className={cn("text-sm font-medium leading-relaxed", notif.lida ? "text-slate-400" : "text-slate-600")}>
                        {notif.mensagem}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </ShellMobile>
  );
}
