'use client';

import { ShellMobile } from '@/componentes/layout/ShellMobile';
import { useAuthStore } from '@/store/useAuthStore';
import { auth } from '@/servicos/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Botao } from '@/componentes/ui/Botao';
import { User, LogOut, Bell, Moon, Shield } from 'lucide-react';
import { cn } from '@/utilitarios/ui';
import { useState } from 'react';
import { ConfiguracoesNotificacao } from '@/componentes/notificacoes/ConfiguracoesNotificacao';

export default function AjustesPage() {
  const { perfil, setUsuario, setPerfil } = useAuthStore();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    setUsuario(null);
    setPerfil(null);
    router.push('/login');
  };

  const configuracoes = perfil?.configuracoes || {
    notificacoesAtivas: false,
    heatmapAtivo: false,
    tema: 'sistema'
  };

  return (
    <ShellMobile>
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 mb-2">Ajustes</h1>
        <p className="text-slate-400 font-medium">Gerencie sua conta e preferências.</p>
      </header>

      <div className="flex items-center gap-4 bg-white p-6 rounded-[2.5rem] border border-slate-100 mb-8 shadow-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 overflow-hidden border border-slate-100">
          {perfil?.fotoUrl ? (
            <img src={perfil.fotoUrl} alt={perfil.nome} className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8" />
          )}
        </div>
        <div>
          <h2 className="font-bold text-xl text-slate-800">{perfil?.nome || 'Carregando...'}</h2>
          <p className="text-slate-400 text-sm font-medium">{perfil?.email}</p>
        </div>
      </div>

      <div className="space-y-3 mb-10">
        <div 
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
              <Bell className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-700">Notificações</span>
          </div>
          <div className={cn(
            "w-12 h-7 rounded-full transition-colors relative p-1",
            configuracoes.notificacoesAtivas ? 'bg-emerald-500' : 'bg-slate-200'
          )}>
            <div className={cn(
              "w-5 h-5 bg-white rounded-full transition-all shadow-sm",
              configuracoes.notificacoesAtivas ? 'translate-x-5' : 'translate-x-0'
            )} />
          </div>
        </div>

        {[
          { icon: Moon, label: 'Modo Escuro', active: configuracoes.tema === 'escuro' },
          { icon: Shield, label: 'Privacidade', active: true },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-700">{item.label}</span>
            </div>
            <div className={cn(
              "w-12 h-7 rounded-full transition-colors relative cursor-pointer p-1",
              item.active ? 'bg-emerald-500' : 'bg-slate-200'
            )}>
              <div className={cn(
                "w-5 h-5 bg-white rounded-full transition-all shadow-sm",
                item.active ? 'translate-x-5' : 'translate-x-0'
              )} />
            </div>
          </div>
        ))}
      </div>

      <Botao 
        variante="fantasma" 
        tamanho="full" 
        onClick={handleLogout}
        className="text-red-500 hover:bg-red-50"
      >
        <LogOut className="w-5 h-5 mr-2" />
        Sair da Conta
      </Botao>

      <ConfiguracoesNotificacao open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </ShellMobile>
  );
}
