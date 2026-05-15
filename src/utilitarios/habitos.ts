import { Habito } from '@/tipos/firebase';

/**
 * Normaliza o campo de frequência de um hábito para garantir que seja sempre um number[].
 * Lida com dados legados, nulos ou malformados de forma silenciosa e resiliente.
 */
export function normalizarFrequencia(frequencia: any): number[] {
  // Fallback padrão: todos os dias
  const DEFAULT_FREQ = [0, 1, 2, 3, 4, 5, 6];

  if (frequencia === null || frequencia === undefined) {
    return DEFAULT_FREQ;
  }

  // Se já for um array, limpa valores inválidos
  if (Array.isArray(frequencia)) {
    const validos = frequencia
      .map(v => Number(v))
      .filter(v => !isNaN(v) && v >= 0 && v <= 6)
      .sort((a, b) => a - b);
    
    return validos.length > 0 ? Array.from(new Set(validos)) : DEFAULT_FREQ;
  }

  // Se for uma string (ex: "0,1,2")
  if (typeof frequencia === 'string') {
    const partes = frequencia.split(',').map(v => Number(v.trim()));
    return normalizarFrequencia(partes);
  }

  // Se for um número único (ex: 1)
  if (typeof frequencia === 'number' && !isNaN(frequencia)) {
    if (frequencia >= 0 && frequencia <= 6) return [frequencia];
    return DEFAULT_FREQ;
  }

  return DEFAULT_FREQ;
}

/**
 * Verifica se um hábito precisa de migração (dados inconsistentes).
 */
export function precisaDeMigracao(habito: any): boolean {
  if (!habito) return false;
  
  // Verifica se a frequência é um array válido de números
  if (!Array.isArray(habito.frequencia)) return true;
  
  const freqInvalida = habito.frequencia.some((v: any) => typeof v !== 'number' || v < 0 || v > 6);
  if (freqInvalida) return true;

  // Verifica se faltam campos essenciais ou se o status é legado
  if (habito.status === undefined || habito.status === 'active' || habito.status === 'archived') return true;
  if (habito.ordem === undefined) return true;

  return false;
}

/**
 * Normaliza e prepara um hábito para exibição e persistência.
 */
export function normalizarHabito(habito: any): Habito {
  return {
    ...habito,
    id: habito.id || '',
    titulo: habito.titulo || 'Hábito sem título',
    descricao: habito.descricao || '',
    status: (habito.status === 'arquivado' || habito.status === 'archived') ? 'arquivado' : 'ativo',
    ordem: typeof habito.ordem === 'number' ? habito.ordem : 0,
    cor: habito.cor || 'bg-emerald-500',
    icone: habito.icone || 'heart',
    frequencia: normalizarFrequencia(habito.frequencia),
    // criadoEm é mantido como Timestamp original do Firestore
    criadoEm: habito.criadoEm
  };
}
