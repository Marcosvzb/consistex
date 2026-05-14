import { Timestamp } from "firebase/firestore";

export interface NotificacaoApp {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'lembrete' | 'insight' | 'streak' | 'sistema' | 'recuperacao';
  icone?: string; // Nome do ícone Lucide
  lida: boolean;
  acaoUrl?: string;
  criadaEm: Timestamp | Date | number;
}

export interface ConfiguracoesNotificacao {
  notificacoesAtivas: boolean;
  horarioLembrete: string;
  diasLembrete: number[];
  intensidade: 'suave' | 'normal';
  notificacoesInteligentes: boolean;
  resumoSemanal: boolean;
  lembretesStreak: boolean;
}
