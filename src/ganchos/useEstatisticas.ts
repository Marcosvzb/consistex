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

  // Memoização granular para evitar recalculação se apenas um mudar
  const consistenciaMensal = useMemo(() => {
    console.log('[Stats] Recalculando consistenciaMensal');
    return calcularConsistenciaMensal(registros);
  }, [registros]);

  const evolucaoSemanal = useMemo(() => {
    console.log('[Stats] Recalculando evolucaoSemanal');
    return calcularEvolucaoUltimos7Dias(registros);
  }, [registros]);

  const rankingHabitos = useMemo(() => {
    console.log('[Stats] Recalculando rankingHabitos');
    return calcularRankingHabitos(habitos, registros);
  }, [habitos, registros]);

  const performanceDia = useMemo(() => {
    console.log('[Stats] Recalculando performanceDia');
    return calcularPerformancePorDiaSemana(registros);
  }, [registros]);

  const totalHabitosAtivos = useMemo(() => {
    return habitos.filter(h => h.status === 'active' || h.status === 'ativo').length;
  }, [habitos]);

  const melhorStreak = perfil?.estatisticas?.melhorStreak || 0;
  const streakAtual = perfil?.estatisticas?.streakAtual || 0;

  return {
    consistenciaMensal,
    evolucaoSemanal,
    rankingHabitos,
    performanceDia,
    melhorStreak,
    streakAtual,
    totalHabitosAtivos
  };
}
