import { useHabitoStore } from '@/store/useHabitoStore';
import { useMemo, useEffect, useRef } from 'react';
import { 
  calcularConsistenciaMensal, 
  calcularEvolucaoUltimos7Dias, 
  calcularRankingHabitos, 
  calcularPerformancePorDiaSemana 
} from '@/utilitarios/estatisticas';
import { useAuthStore } from '@/store/useAuthStore';
import { useShallow } from 'zustand/react/shallow';

export function useEstatisticas() {
  // Uso de useShallow para garantir que o hook só re-execute se o conteúdo mudar, não a referência do objeto retornado pelo seletor
  const { registros, habitos } = useHabitoStore(
    useShallow((s) => ({
      registros: s.registros,
      habitos: s.habitos,
    }))
  );

  const { melhorStreak, streakAtual } = useAuthStore(
    useShallow((s) => ({
      melhorStreak: s.perfil?.estatisticas?.melhorStreak || 0,
      streakAtual: s.perfil?.estatisticas?.streakAtual || 0,
    }))
  );

  // DEBUG DE REFERÊNCIAS
  const prevRefs = useRef({ registros, habitos });
  useEffect(() => {
    const regMudou = prevRefs.current.registros !== registros;
    const habMudou = prevRefs.current.habitos !== habitos;
    
    if (regMudou || habMudou) {
      console.log('[Stats Compare]', {
        registrosMudou: regMudou,
        habitosMudou: habMudou,
        registrosKeys: Object.keys(registros).length,
        habitosCount: habitos.length
      });
    }
    prevRefs.current = { registros, habitos };
  });

  console.log('[Stats] Hook useEstatisticas executado');

  // Cálculos memorizados individualmente com dependências granulares
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
    console.log('[Stats] Recalculando totalHabitosAtivos');
    return habitos.filter(h => h.status === 'ativo').length;
  }, [habitos]);

  // Retorno memorizado para evitar que componentes consumidores re-renderizem se os valores não mudarem
  return useMemo(() => ({
    consistenciaMensal,
    evolucaoSemanal,
    rankingHabitos,
    performanceDia,
    melhorStreak,
    streakAtual,
    totalHabitosAtivos
  }), [
    consistenciaMensal,
    evolucaoSemanal,
    rankingHabitos,
    performanceDia,
    melhorStreak,
    streakAtual,
    totalHabitosAtivos
  ]);
}
