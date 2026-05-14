import { format, addDays, isToday, parseISO, startOfDay, endOfDay, differenceInDays } from 'date-fns';
import { toZonedTime, format as formatTZ } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';

const TIMEZONE = 'America/Sao_Paulo';

/**
 * Obtém a data atual no formato ISO (YYYY-MM-DD) considerando o timezone de Brasília.
 */
export function obterHojeISO(): string {
  const agora = new Date();
  const dataZonada = toZonedTime(agora, TIMEZONE);
  return format(dataZonada, 'yyyy-MM-dd');
}

/**
 * Formata uma data para exibição amigável.
 */
export function formatarData(data: Date | string, formato = "dd 'de' MMMM"): string {
  const d = typeof data === 'string' ? parseISO(data) : data;
  return format(d, formato, { locale: ptBR });
}

/**
 * Adiciona dias a uma data.
 */
export function adicionarDias(data: Date | string, dias: number): Date {
  const d = typeof data === 'string' ? parseISO(data) : data;
  return addDays(d, dias);
}

/**
 * Compara se duas datas são o mesmo dia.
 */
export function compararDatas(data1: Date | string, data2: Date | string): boolean {
  const d1 = typeof data1 === 'string' ? parseISO(data1) : data1;
  const d2 = typeof data2 === 'string' ? parseISO(data2) : data2;
  return format(d1, 'yyyy-MM-dd') === format(d2, 'yyyy-MM-dd');
}

/**
 * Calcula o streak atual baseado nos registros.
 * Um dia é considerado completo se todos os hábitos ativos foram marcados.
 */
export function calcularStreak(registros: Record<string, any>): number {
  return calcularStreakAteData(registros, obterHojeISO());
}

/**
 * Calcula o streak terminando em uma data específica.
 */
export function calcularStreakAteData(registros: Record<string, any>, dataFim: string): number {
  let streak = 0;
  let dataAtual = parseISO(dataFim);
  
  // Se for hoje e não estiver completo, o streak pode vir do dia anterior
  const registroHoje = registros[dataFim];
  if (dataFim === obterHojeISO() && (!registroHoje || registroHoje.porcentagemConclusao < 100)) {
    dataAtual = addDays(dataAtual, -1);
  }

  while (true) {
    const iso = format(dataAtual, 'yyyy-MM-dd');
    const registro = registros[iso];
    
    if (!registro || registro.porcentagemConclusao < 100) {
      break;
    }
    
    streak++;
    dataAtual = addDays(dataAtual, -1);
    
    if (streak > 3650) break;
  }
  
  return streak;
}
