import { create } from 'zustand';
import { Habito, RegistroDiario } from '@/tipos/firebase';

interface HabitoState {
  habitos: Habito[];
  registros: Record<string, RegistroDiario>; // chave: YYYY-MM-DD
  setHabitos: (habitos: Habito[]) => void;
  setRegistros: (registros: Record<string, RegistroDiario>) => void;
  atualizarRegistro: (data: string, registro: RegistroDiario) => void;
}

export const useHabitoStore = create<HabitoState>((set) => ({
  habitos: [],
  registros: {},
  setHabitos: (habitos) => set({ habitos }),
  setRegistros: (registros) => set({ registros }),
  atualizarRegistro: (data, registro) => 
    set((state) => ({
      registros: { ...state.registros, [data]: registro }
    })),
}));
