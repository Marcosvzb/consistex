import { create } from 'zustand';
import { NotificacaoApp } from '@/tipos/notificacoes';

interface NotificacaoState {
  notificacoes: NotificacaoApp[];
  estaCarregando: boolean;
  setNotificacoes: (notificacoes: NotificacaoApp[]) => void;
  setEstaCarregando: (esta: boolean) => void;
}

export const useNotificacaoStore = create<NotificacaoState>((set) => ({
  notificacoes: [],
  estaCarregando: true,
  setNotificacoes: (notificacoes) => set({ notificacoes, estaCarregando: false }),
  setEstaCarregando: (estaCarregando) => set({ estaCarregando }),
}));
