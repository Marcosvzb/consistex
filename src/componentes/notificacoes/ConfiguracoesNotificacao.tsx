'use client';

import { Drawer } from 'vaul';
import { X, BellRing, Brain, Zap, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useState, useEffect } from 'react';
import { useNotificacoes } from '@/ganchos/useNotificacoes';
import { auth, db } from '@/servicos/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { cn } from '@/utilitarios/ui';

interface ConfiguracoesNotificacaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConfiguracoesNotificacao({ open, onOpenChange }: ConfiguracoesNotificacaoProps) {
  const { perfil, setPerfil } = useAuthStore();
  const { solicitarPush } = useNotificacoes();
  const [salvando, setSalvando] = useState(false);

  // Estados locais para evitar sync excessivo antes de salvar
  const [ativas, setAtivas] = useState(false);
  const [inteligentes, setInteligentes] = useState(true);
  const [streak, setStreak] = useState(true);
  const [horario, setHorario] = useState('08:00');

  useEffect(() => {
    if (perfil?.configuracoes) {
      setAtivas(perfil.configuracoes.notificacoesAtivas);
      setInteligentes(perfil.configuracoes.notificacoesInteligentes ?? true);
      setStreak(perfil.configuracoes.lembretesStreak ?? true);
      setHorario(perfil.configuracoes.horarioLembrete ?? '08:00');
    }
  }, [perfil, open]);

  const handleToggleAtivas = async () => {
    if (!ativas) {
      const concedido = await solicitarPush();
      if (!concedido) {
        alert("Você precisa permitir notificações no seu navegador/sistema.");
        return;
      }
    }
    setAtivas(!ativas);
  };

  const handleSave = async () => {
    if (!perfil) return;
    setSalvando(true);
    try {
      const novasConfigs = {
        ...perfil.configuracoes,
        notificacoesAtivas: ativas,
        notificacoesInteligentes: inteligentes,
        lembretesStreak: streak,
        horarioLembrete: horario,
      };

      const docRef = doc(db, 'usuarios', perfil.id);
      await updateDoc(docRef, { configuracoes: novasConfigs });
      
      // Update local store
      setPerfil({ ...perfil, configuracoes: novasConfigs });
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar configurações", error);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
        <Drawer.Content className="bg-slate-50 flex flex-col rounded-t-[2.5rem] h-[85%] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-300 mt-4 mb-2" />
          
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <Drawer.Title className="text-2xl font-black text-slate-800">
                  Notificações
                </Drawer.Title>
                <Drawer.Description className="text-xs text-slate-500 font-medium">
                  Configure como o Consistex deve se comunicar com você.
                </Drawer.Description>
              </div>
              <button 
                onClick={() => onOpenChange(false)}
                className="p-2 bg-white rounded-full text-slate-400 shadow-sm active:scale-90 transition-transform"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 pb-24">
              {/* Push Global */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", ativas ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                    <BellRing className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Push Notifications</p>
                    <p className="text-xs font-medium text-slate-500">Lembretes e avisos no dispositivo</p>
                  </div>
                </div>
                <Toggle ativo={ativas} onClick={handleToggleAtivas} />
              </div>

              {/* Opções (Só mostra se ativas for true) */}
              <div className={cn("space-y-4 transition-all duration-300", ativas ? "opacity-100" : "opacity-50 pointer-events-none")}>
                
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Rotina Inteligente</p>
                      <p className="text-xs font-medium text-slate-500">Avisos baseados no seu padrão</p>
                    </div>
                  </div>
                  <Toggle ativo={inteligentes} onClick={() => setInteligentes(!inteligentes)} />
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Lembretes de Streak</p>
                      <p className="text-xs font-medium text-slate-500">Alertas para não perder a ofensiva</p>
                    </div>
                  </div>
                  <Toggle ativo={streak} onClick={() => setStreak(!streak)} />
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Horário Principal</p>
                      <p className="text-xs font-medium text-slate-500">Resumo matinal</p>
                    </div>
                  </div>
                  <input 
                    type="time" 
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    className="bg-slate-50 text-slate-800 font-bold px-3 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
            <button
              onClick={handleSave}
              disabled={salvando}
              className="w-full py-5 rounded-[1.5rem] bg-slate-900 text-white font-black text-lg shadow-xl shadow-slate-900/20 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {salvando ? 'Salvando...' : 'Salvar Preferências'}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function Toggle({ ativo, onClick }: { ativo: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "w-12 h-7 rounded-full transition-colors relative cursor-pointer p-1 shrink-0",
        ativo ? 'bg-emerald-500' : 'bg-slate-200'
      )}
    >
      <div className={cn(
        "w-5 h-5 bg-white rounded-full transition-all shadow-sm",
        ativo ? 'translate-x-5' : 'translate-x-0'
      )} />
    </div>
  );
}
