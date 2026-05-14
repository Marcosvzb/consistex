import { useHabitoStore } from '@/store/useHabitoStore';
import { useMemo } from 'react';
import { 
  calcularConsistenciaMensal, 
  calcularEvolucaoUltimos7Dias, 
  calcularRankingHabitos, 
  calcularPerformancePorDiaSemana 
} from '@/utilitarios/estatisticas';
import { useAuthStore } from '@/store/useAuthStore';

export function useEstatisticas() {
  const { registros, habitos } = useHabitoStore();
  const { perfil } = useAuthStore();

  const consistenciaMensal = useMemo(() => 
    calcularConsistenciaMensal(registros), 
  [registros]);

  const evolucaoSemanal = useMemo(() => 
    calcularEvolucaoUltimos7Dias(registros), 
  [registros]);

  const rankingHabitos = useMemo(() => 
    calcularRankingHabitos(habitos, registros), 
  [habitos, registros]);

  const performanceDia = useMemo(() => 
    calcularPerformancePorDiaSemana(registros), 
  [registros]);

  const melhorStreak = perfil?.estatisticas?.melhorStreak || 0;
  
  // O Streak atual já é calculado no header ou pode ser pego do store/util, mas vamos simplificar aqui:
  const streakAtual = perfil?.estatisticas?.streakAtual || 0; // Se o perfil manter atualizado. Na verdade o Consistex calcula no front, mas vamos assumir o utilitario

  return {
    consistenciaMensal,
    evolucaoSemanal,
    rankingHabitos,
    performanceDia,
    melhorStreak,
    streakAtual,
    totalHabitosAtivos: habitos.filter(h => h.status === 'ativo').length
  };
}
