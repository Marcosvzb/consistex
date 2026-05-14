import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Habito, Usuario } from '@/tipos/firebase';

interface OnboardingState {
  etapaAtual: number;
  habitosTemporarios: Partial<Habito>[];
  configuracoes: Usuario['configuracoes'];
  setEtapaAtual: (etapa: number) => void;
  adicionarHabito: (habito: Partial<Habito>) => void;
  removerHabito: (id: string) => void;
  atualizarHabito: (id: string, dados: Partial<Habito>) => void;
  setNotificacoes: (ativas: boolean) => void;
  setHorarioLembrete: (horario: string) => void;
  resetOnboarding: () => void;
}

const CONFIG_INICIAL: Usuario['configuracoes'] = {
  tema: 'sistema',
  notificacoesAtivas: false,
  horarioLembrete: '08:00',
  diasLembrete: [0, 1, 2, 3, 4, 5, 6],
  intensidade: 'normal',
  notificacoesInteligentes: true,
  resumoSemanal: true,
  lembretesStreak: true,
  heatmapAtivo: true,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      etapaAtual: 1,
      habitosTemporarios: [],
      configuracoes: CONFIG_INICIAL,

      setEtapaAtual: (etapaAtual) => set({ etapaAtual }),

      adicionarHabito: (habito) => set((state) => ({
        habitosTemporarios: [...state.habitosTemporarios, { ...habito, id: crypto.randomUUID() }]
      })),

      removerHabito: (id) => set((state) => ({
        habitosTemporarios: state.habitosTemporarios.filter((h) => h.id !== id)
      })),

      atualizarHabito: (id, dados) => set((state) => ({
        habitosTemporarios: state.habitosTemporarios.map((h) => 
          h.id === id ? { ...h, ...dados } : h
        )
      })),

      setNotificacoes: (ativas) => set((state) => ({
        configuracoes: { ...state.configuracoes, notificacoesAtivas: ativas }
      })),

      setHorarioLembrete: (horario) => set((state) => ({
        configuracoes: { ...state.configuracoes, horarioLembrete: horario }
      })),

      resetOnboarding: () => set({
        etapaAtual: 1,
        habitosTemporarios: [],
        configuracoes: CONFIG_INICIAL
      }),
    }),
    {
      name: 'consistex-onboarding',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
