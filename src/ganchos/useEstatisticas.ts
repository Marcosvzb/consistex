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
import { getDay, parseISO } from 'date-fns';
import { normalizarFrequencia } from '@/utilitarios/habitos';
import { calcularStreak } from '@/utilitarios/data';

export function useEstatisticas() {
  // Uso de useShallow para garantir que o hook só re-execute se o conteúdo mudar, não a referência do objeto retornado pelo seletor
  const { registros, habitos } = useHabitoStore(
    useShallow((s) => ({
      registros: s.registros,
      habitos: s.habitos,
    }))
  );

  const { melhorStreak, perfilStreakAtual } = useAuthStore(
    useShallow((s) => ({
      melhorStreak: s.perfil?.estatisticas?.melhorStreak || 0,
      perfilStreakAtual: s.perfil?.estatisticas?.streakAtual || 0,
    }))
  );

  // Filtrar hábitos arquivados IMEDIATAMENTE e CENTRALIZADO
  const habitosAtivos = useMemo(() => {
    return habitos.filter(h => h.status === 'ativo');
  }, [habitos]);

  // Recalcular registros para ignorar hábitos arquivados nas porcentagens
  const registrosFiltrados = useMemo(() => {
    const novoRegistros: typeof registros = {};
    
    Object.entries(registros).forEach(([data, reg]) => {
      const diaSemana = getDay(parseISO(data));
      
      // Hábitos que deveriam ser feitos neste dia (apenas entre os ATIVOS)
      const habitosObrigatorios = habitosAtivos.filter(h => 
        normalizarFrequencia(h.frequencia).includes(diaSemana)
      );

      if (habitosObrigatorios.length === 0) {
        // Dias sem hábitos planejados são marcados com -1 para indicar "vazio" mas não "falho"
        // No entanto, para manter compatibilidade com tipos, usamos 0 e controlamos na streak
        novoRegistros[data] = { ...reg, porcentagemConclusao: 0 };
        return;
      }

      const concluidos = habitosObrigatorios.filter(h => reg.habitos[h.id]).length;
      const porcentagem = Math.round((concluidos / habitosObrigatorios.length) * 100);

      novoRegistros[data] = {
        ...reg,
        porcentagemConclusao: porcentagem
      };
    });

    return novoRegistros;
  }, [registros, habitosAtivos]);

  // Streak recalculado localmente para respeitar o arquivamento imediato
  // IMPORTANTE: precisamos de uma versão de streak que ignore dias sem hábitos planejados
  const streakAtual = useMemo(() => {
    // Para o streak, dias vazios (0% e 0 habitos ativos) devem ser ignorados, não quebrar o streak
    let streak = 0;
    const datasOrdenadas = Object.keys(registrosFiltrados).sort().reverse();
    
    // Simplificação: usa o calcularStreak mas garante que registrosFiltrados reflete a realidade dos ativos
    // Nota: calcularStreakAteData em data.ts quebra em porcentagem < 100.
    // Se um dia não tem hábitos, ele não deve ter registro ou deve ter 100% para não quebrar.
    // Vamos ajustar os registrosFiltrados para ter 100% em dias sem hábitos APENAS para o cálculo do streak.
    
    const registrosParaStreak = { ...registrosFiltrados };
    Object.keys(registrosFiltrados).forEach(data => {
       const diaSemana = getDay(parseISO(data));
       const temHabitosNoDia = habitosAtivos.some(h => normalizarFrequencia(h.frequencia).includes(diaSemana));
       if (!temHabitosNoDia) {
         registrosParaStreak[data] = { ...registrosParaStreak[data], porcentagemConclusao: 100 };
       }
    });

    return calcularStreak(registrosParaStreak);
  }, [registrosFiltrados, habitosAtivos]);

  // DEBUG DE REFERÊNCIAS
  const prevRefs = useRef({ registros: registrosFiltrados, habitos: habitosAtivos });
  useEffect(() => {
    const regMudou = prevRefs.current.registros !== registrosFiltrados;
    const habMudou = prevRefs.current.habitos !== habitosAtivos;
    
    if (regMudou || habMudou) {
      console.log('[Metricas] Estatísticas atualizadas', {
        ativos: habitosAtivos.length,
        arquivados: habitos.length - habitosAtivos.length,
        registros: Object.keys(registrosFiltrados).length,
        streak: streakAtual
      });
    }
    prevRefs.current = { registros: registrosFiltrados, habitos: habitosAtivos };
  });

  // Cálculos memorizados individualmente com dependências granulares
  const consistenciaMensal = useMemo(() => {
    console.log('[Stats] Recalculando consistenciaMensal');
    return calcularConsistenciaMensal(registrosFiltrados);
  }, [registrosFiltrados]);

  const evolucaoSemanal = useMemo(() => {
    console.log('[Stats] Recalculando evolucaoSemanal');
    return calcularEvolucaoUltimos7Dias(registrosFiltrados);
  }, [registrosFiltrados]);

  const rankingHabitos = useMemo(() => {
    console.log('[Stats] Recalculando rankingHabitos');
    return calcularRankingHabitos(habitosAtivos, registrosFiltrados);
  }, [habitosAtivos, registrosFiltrados]);

  const performanceDia = useMemo(() => {
    console.log('[Stats] Recalculando performanceDia');
    return calcularPerformancePorDiaSemana(registrosFiltrados);
  }, [registrosFiltrados]);

  const totalHabitosAtivosCount = habitosAtivos.length;

  return useMemo(() => ({
    consistenciaMensal,
    evolucaoSemanal,
    rankingHabitos,
    performanceDia,
    melhorStreak,
    streakAtual,
    totalHabitosAtivos: totalHabitosAtivosCount
  }), [
    consistenciaMensal,
    evolucaoSemanal,
    rankingHabitos,
    performanceDia,
    melhorStreak,
    streakAtual,
    totalHabitosAtivosCount
  ]);
}
