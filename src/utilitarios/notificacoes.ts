import { Habito, RegistroDiario } from '@/tipos/firebase';
import { normalizarFrequencia } from './habitos';
import { parseISO, getDay } from 'date-fns';

export interface NudgeInteligente {
  tipo: 'urgente' | 'motivacional' | 'informativo' | 'neutro' | 'sucesso';
  mensagem: string;
  icone: string;
}

/**
 * Analisa os hábitos do dia e o registro atual para gerar um "nudge" (empurrãozinho)
 * contextualizado e não agressivo.
 */
export function gerarNudgeDiario(
  habitos: Habito[], 
  registro: RegistroDiario | null, 
  dataSelecionada: string
): NudgeInteligente | null {
  if (!habitos || habitos.length === 0) return null;

  const dataObj = parseISO(dataSelecionada);
  const diaSemana = getDay(dataObj);

  // Filtra hábitos válidos para o dia
  const habitosDoDia = habitos.filter(h => h.status === 'ativo' && normalizarFrequencia(h.frequencia).includes(diaSemana));
  if (habitosDoDia.length === 0) return null;

  const total = habitosDoDia.length;
  const concluidos = habitosDoDia.filter(h => registro?.habitos?.[h.id]).length;
  const pendentes = total - concluidos;

  if (pendentes === 0) {
    return {
      tipo: 'sucesso' as any,
      mensagem: 'Todos os hábitos concluídos! Excelente trabalho hoje. 🌟',
      icone: 'Target'
    };
  }

  if (pendentes === 1) {
    return {
      tipo: 'motivacional',
      mensagem: 'Falta só mais um para fechar o dia com chave de ouro! 👀',
      icone: 'Flame'
    };
  }

  if (concluidos > 0 && concluidos >= total / 2) {
    return {
      tipo: 'informativo',
      mensagem: `Você já passou da metade! Faltam ${pendentes} hábitos.`,
      icone: 'Trophy'
    };
  }

  return {
    tipo: 'neutro',
    mensagem: `Você tem ${pendentes} hábitos planejados para hoje. Um passo de cada vez.`,
    icone: 'Coffee'
  };
}
