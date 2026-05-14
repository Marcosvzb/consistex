import { create } from 'zustand';

interface InterfaceState {
  dataSelecionada: string; // YYYY-MM-DD
  setDataSelecionada: (data: string) => void;
  estaOnline: boolean;
  setEstaOnline: (online: boolean) => void;
}

export const useInterfaceStore = create<InterfaceState>((set) => ({
  dataSelecionada: new Date().toISOString().split('T')[0], // Hoje por padrão
  setDataSelecionada: (dataSelecionada) => set({ dataSelecionada }),
  estaOnline: typeof window !== 'undefined' ? navigator.onLine : true,
  setEstaOnline: (estaOnline) => set({ estaOnline }),
}));
