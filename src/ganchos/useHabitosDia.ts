import { useHabitoStore } from '@/store/useHabitoStore';
import { useInterfaceStore } from '@/store/useInterfaceStore';
import { useMemo } from 'react';
import { parseISO, getDay } from 'date-fns';
import { normalizarFrequencia } from '@/utilitarios/habitos';

export function useHabitosDia() {
  const { habitos, registros } = useHabitoStore();
  const { dataSelecionada } = useInterfaceStore();

  return useMemo(() => {
    try {
      const data = parseISO(dataSelecionada);
      const diaSemana = getDay(data); // 0 (Dom) a 6 (Sáb)

      // Filtrar apenas hábitos ativos que devem ocorrer no dia selecionado com validação pesada
      const habitosDoDia = habitos
        .filter(h => {
          if (!h || h.status !== 'ativo') return false;
          
          const freq = normalizarFrequencia(h.frequencia);
          return freq.includes(diaSemana);
        })
        .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

      const registroDia = registros[dataSelecionada];
      const totalHabitos = habitosDoDia.length;
      const concluidos = habitosDoDia.filter(h => registroDia?.habitos?.[h.id]).length;
      const porcentagem = totalHabitos > 0 ? Math.round((concluidos / totalHabitos) * 100) : 0;
      const arquivados = habitos.filter(h => h.status === 'arquivado').length;

      console.log(`[Metricas] ativos:${totalHabitos} concluidos:${concluidos} arquivados:${arquivados} percentual:${porcentagem}%`);

      return {
        habitos: habitosDoDia,
        registroDia,
        totalHabitos,
        concluidos,
        porcentagem,
        dataSelecionada
      };
    } catch (error) {
      console.error('[useHabitosDia] Erro crítico ao processar hábitos do dia:', error);
      return {
        habitos: [],
        registroDia: null,
        totalHabitos: 0,
        concluidos: 0,
        porcentagem: 0,
        dataSelecionada
      };
    }
  }, [habitos, registros, dataSelecionada]);
}
