import { Timestamp } from "firebase/firestore";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  fotoUrl: string;
  onboardingConcluido: boolean;
  fcmToken?: string;
  
  configuracoes: {
    tema: "claro" | "escuro" | "sistema";
    notificacoesAtivas: boolean;
    horarioLembrete: string;
    diasLembrete: number[]; // [0,1,2,3,4,5,6]
    intensidade: "suave" | "normal";
    notificacoesInteligentes: boolean;
    resumoSemanal: boolean;
    lembretesStreak: boolean;
    heatmapAtivo: boolean;
  };
  
  estatisticas: {
    streakAtual: number;
    melhorStreak: number;
    totalConcluidos: number;
  };
  
  criadoEm: Timestamp;
}

export interface Habito {
  id: string;
  titulo: string;
  descricao: string;
  status: "ativo" | "arquivado";
  ordem: number;
  cor: string;
  icone: string;
  frequencia: number[]; // Dias da semana [0, 1, 2, 3, 4, 5, 6]
  criadoEm: Timestamp;
}

export interface RegistroDiario {
  data: string; // YYYY-MM-DD
  habitos: {
    [habitoId: string]: boolean;
  };
  porcentagemConclusao: number;
  atualizadoEm: Timestamp;
}
