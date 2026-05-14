import { useMemo } from 'react';
import { useHabitosDia } from './useHabitosDia';
import { gerarNudgeDiario, NudgeInteligente } from '@/utilitarios/notificacoes';

export function useRotinaInteligente() {
  const { habitos, registroDia, dataSelecionada } = useHabitosDia();

  const nudgeDiario: NudgeInteligente | null = useMemo(() => {
    return gerarNudgeDiario(habitos, registroDia, dataSelecionada);
  }, [habitos, registroDia, dataSelecionada]);

  return {
    nudgeDiario
  };
}
