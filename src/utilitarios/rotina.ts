import { RegistroDiario } from '@/tipos/firebase';
import { parseISO, getDay, differenceInDays } from 'date-fns';

/**
 * Função para perdoar uma quebra de streak com base em dias de descanso
 * ou flexibilidade de rotina.
 */
export function avaliarRecuperacaoStreak(registros: Record<string, RegistroDiario>, dataAtual: Date): boolean {
  // Lógica fictícia premium:
  // Se o usuário falhou 1 dia, mas foi consistente nos 10 dias anteriores, o streak é preservado (streak freeze).
  // Retorna true se elegível para recuperação.
  // Em uma implementação real, isso avaliaria um histórico de 14 dias para trás.
  return false; 
}

/**
 * Extrai padrões do usuário (ex: dias mais fortes, piores dias)
 */
export function analisarPadroesRotina(registros: Record<string, RegistroDiario>) {
  // Simulação de análise profunda para IA
  return {
    diasForte: [1, 2], // Seg, Ter
    diasFracos: [0, 6], // FDS
  };
}
