import { Usuario } from '@/tipos/firebase';

/**
 * Cria um objeto de perfil padrão com valores seguros.
 * Útil para estados iniciais e fallbacks de carregamento.
 */
export function criarPerfilDefault(): Usuario {
  return {
    id: '',
    nome: 'Usuário',
    email: '',
    fotoUrl: '',
    onboardingConcluido: false,
    configuracoes: {
      tema: 'sistema',
      notificacoesAtivas: false,
      horarioLembrete: '08:00',
      diasLembrete: [0, 1, 2, 3, 4, 5, 6],
      intensidade: 'normal',
      notificacoesInteligentes: true,
      resumoSemanal: true,
      lembretesStreak: true,
      heatmapAtivo: true,
    },
    estatisticas: {
      streakAtual: 0,
      melhorStreak: 0,
      totalConcluidos: 0,
    },
    criadoEm: new Date() as any, // Placeholder para Timestamp
  };
}

/**
 * Normaliza um objeto de perfil vindo do Firestore, garantindo que todos os campos existam.
 */
export function normalizarPerfil(dados: any): Usuario {
  const padrao = criarPerfilDefault();

  if (!dados) return padrao;

  return {
    ...padrao,
    ...dados,
    id: dados.id || dados.uid || padrao.id,
    configuracoes: {
      ...padrao.configuracoes,
      ...(dados.configuracoes || {}),
    },
    estatisticas: {
      ...padrao.estatisticas,
      ...(dados.estatisticas || {}),
    },
  };
}

/**
 * Obtém o primeiro nome de forma segura.
 */
export function obterPrimeiroNome(nome?: string): string {
  if (!nome) return 'Usuário';
  return nome.trim().split(' ')[0] || 'Usuário';
}
