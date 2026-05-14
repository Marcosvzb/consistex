import { useHabitoStore } from '@/store/useHabitoStore';
import { useMemo } from 'react';

export function useHabitos() {
  const { habitos } = useHabitoStore();

  const habitosAtivos = useMemo(() => 
    habitos.filter(h => h.status === 'ativo').sort((a, b) => a.ordem - b.ordem),
    [habitos]
  );

  const habitosArquivados = useMemo(() => 
    habitos.filter(h => h.status === 'arquivado').sort((a, b) => a.ordem - b.ordem),
    [habitos]
  );

  return {
    habitos,
    habitosAtivos,
    habitosArquivados,
  };
}
