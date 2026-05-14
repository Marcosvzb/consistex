import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth
} from 'date-fns';

/**
 * Gera a grade de dias para o calendário mensal, incluindo dias extras 
 * no início e fim para completar as semanas.
 */
export function gerarGradeMensal(dataReferencia: Date) {
  const inicioMes = startOfMonth(dataReferencia);
  const fimMes = endOfMonth(dataReferencia);
  
  // Ajusta para o início da primeira semana (domingo por padrão)
  const dataInicio = startOfWeek(inicioMes, { weekStartsOn: 0 });
  // Ajusta para o fim da última semana (sábado por padrão)
  const dataFim = endOfWeek(fimMes, { weekStartsOn: 0 });

  return eachDayOfInterval({ start: dataInicio, end: dataFim });
}

/**
 * Calcula a intensidade da cor baseada na porcentagem de conclusão.
 * Cores solicitadas:
 * 0% → slate-100
 * 25% → emerald-200
 * 50% → emerald-300
 * 75% → emerald-400
 * 100% → emerald-500
 */
export function obterCorIntensidade(porcentagem: number, isMesAtual: boolean) {
  if (!isMesAtual) return 'bg-transparent text-slate-300 opacity-20';
  
  if (porcentagem === 0) return 'bg-slate-100 text-slate-400 hover:bg-slate-200';
  if (porcentagem <= 25) return 'bg-emerald-200 text-emerald-800 hover:bg-emerald-300';
  if (porcentagem <= 50) return 'bg-emerald-300 text-emerald-900 hover:bg-emerald-400';
  if (porcentagem <= 75) return 'bg-emerald-400 text-white hover:bg-emerald-500';
  return 'bg-emerald-500 text-white shadow-sm shadow-emerald-200 hover:bg-emerald-600';
}

/**
 * Verifica se um dia pertence ao mês de referência.
 */
export function pertenceAoMes(dia: Date, mesReferencia: Date) {
  return isSameMonth(dia, mesReferencia);
}
