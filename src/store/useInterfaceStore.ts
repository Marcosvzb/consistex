import { create } from 'zustand';
import { obterHojeISO } from '@/utilitarios/data';

interface InterfaceState {
  dataAtual: string; // YYYY-MM-DD (Sempre hoje)
  dataSelecionada: string; // YYYY-MM-DD (Navegável)
  setDataSelecionada: (data: string) => void;
  resetarDataParaHoje: () => void;
  estaOnline: boolean;
  setEstaOnline: (online: boolean) => void;
}

export const useInterfaceStore = create<InterfaceState>((set) => ({
  dataAtual: obterHojeISO(),
  dataSelecionada: obterHojeISO(),
  setDataSelecionada: (dataSelecionada) => set({ dataSelecionada }),
  resetarDataParaHoje: () => set({ dataSelecionada: obterHojeISO() }),
  estaOnline: typeof window !== 'undefined' ? navigator.onLine : true,
  setEstaOnline: (estaOnline) => set({ estaOnline }),
}));
