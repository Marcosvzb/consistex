import { useMemo } from 'react';
import { useEstatisticas } from './useEstatisticas';
import { gerarInsightsAutomaticos } from '@/utilitarios/estatisticas';

export function useInsights() {
  const { consistenciaMensal, rankingHabitos, performanceDia } = useEstatisticas();

  const insights = useMemo(() => 
    gerarInsightsAutomaticos(consistenciaMensal, rankingHabitos, performanceDia),
  [consistenciaMensal, rankingHabitos, performanceDia]);

  return { insights };
}
