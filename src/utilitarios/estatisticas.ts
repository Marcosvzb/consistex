import { Habito, RegistroDiario } from '@/tipos/firebase';
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  subDays, 
  isSameDay, 
  parseISO, 
  getDay,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { normalizarFrequencia } from './habitos';

// 1. Taxa de Consistência Mensal
export function calcularConsistenciaMensal(registros: Record<string, RegistroDiario>, mesReferencia: Date = new Date()): number {
  const inicio = startOfMonth(mesReferencia);
  const fim = mesReferencia > endOfMonth(mesReferencia) ? endOfMonth(mesReferencia) : new Date(); // Limita ao dia de hoje se o mês for o atual
  
  const diasDoMes = eachDayOfInterval({ start: inicio, end: fim });
  let diasCompletos = 0;

  diasDoMes.forEach(dia => {
    const iso = format(dia, 'yyyy-MM-dd');
    const reg = registros[iso];
    if (reg && reg.porcentagemConclusao === 100) {
      diasCompletos++;
    }
  });

  if (diasDoMes.length === 0) return 0;
  return Math.round((diasCompletos / diasDoMes.length) * 100);
}

// 2. Evolução Semanal (Últimos 7 dias)
export function calcularEvolucaoUltimos7Dias(registros: Record<string, RegistroDiario>) {
  const hoje = new Date();
  const ultimos7Dias = Array.from({ length: 7 }).map((_, i) => subDays(hoje, 6 - i));

  return ultimos7Dias.map(dia => {
    const iso = format(dia, 'yyyy-MM-dd');
    const reg = registros[iso];
    return {
      dia: format(dia, 'EEEEEE', { locale: ptBR }).toUpperCase(), // ex: 'S', 'T', 'Q'
      dataOriginal: dia,
      porcentagem: reg?.porcentagemConclusao || 0
    };
  });
}

// 3. Ranking de Hábitos
export function calcularRankingHabitos(habitos: Habito[], registros: Record<string, RegistroDiario>) {
  const ranking = habitos.map(habito => {
    let vezesConcluido = 0;
    let totalDiasAtivos = 0; // Simplificação: conta todos os dias no registro
    
    Object.values(registros).forEach(reg => {
      // Idealmente, deveríamos verificar se o hábito deveria ter sido feito no dia, mas para performance global
      // vamos usar uma métrica de vezes que ele foi de fato marcado vs total de dias registrados.
      // Uma métrica melhor: quantas vezes ele foi feito / quantos dias ele DEVERIA ter sido feito (baseado na data de criação e frequência)
      
      const diaReg = parseISO(reg.data);
      const diaSemana = getDay(diaReg);
      const freq = normalizarFrequencia(habito.frequencia);
      
      // Se o hábito foi criado antes deste dia (simplificado se não tiver criadoEm acessível facilmente aqui)
      // e a frequência inclui este dia
      if (freq.includes(diaSemana)) {
        totalDiasAtivos++;
        if (reg.habitos && reg.habitos[habito.id]) {
          vezesConcluido++;
        }
      }
    });

    const taxa = totalDiasAtivos > 0 ? Math.round((vezesConcluido / totalDiasAtivos) * 100) : 0;

    return {
      habito,
      taxa,
      vezesConcluido,
      totalDiasAtivos
    };
  });

  return ranking.sort((a, b) => b.taxa - a.taxa);
}

// 4. Performance por Dia da Semana
export function calcularPerformancePorDiaSemana(registros: Record<string, RegistroDiario>) {
  const diasSoma = [0, 0, 0, 0, 0, 0, 0]; // Dom a Sáb
  const diasContagem = [0, 0, 0, 0, 0, 0, 0];

  Object.values(registros).forEach(reg => {
    const diaReg = parseISO(reg.data);
    const diaSemana = getDay(diaReg);
    diasSoma[diaSemana] += reg.porcentagemConclusao || 0;
    diasContagem[diaSemana]++;
  });

  const medias = diasSoma.map((soma, i) => ({
    diaSemana: i,
    media: diasContagem[i] > 0 ? Math.round(soma / diasContagem[i]) : 0,
    nome: format(new Date(2024, 0, i + 7), 'EEEE', { locale: ptBR }) // Hack para pegar nome do dia
  }));

  return medias.sort((a, b) => b.media - a.media);
}

// 5. Gerador de Insights Automáticos
export function gerarInsightsAutomaticos(
  consistencia: number, 
  ranking: ReturnType<typeof calcularRankingHabitos>,
  performanceDia: ReturnType<typeof calcularPerformancePorDiaSemana>
) {
  const insights = [];

  // Insight de Consistência
  if (consistencia >= 80) {
    insights.push({
      tipo: 'sucesso',
      icone: 'Flame',
      titulo: 'Consistência de Elite',
      texto: `Você atingiu incríveis ${consistencia}% de consistência este mês. Mantenha o ritmo!`
    });
  } else if (consistencia >= 50) {
    insights.push({
      tipo: 'info',
      icone: 'Target',
      titulo: 'No Caminho Certo',
      texto: `Sua consistência está em ${consistencia}%. Com um pouco mais de foco nos finais de semana, você chega aos 80%.`
    });
  }

  // Insight de Hábito Mais Forte
  const habitoForte = ranking[0];
  if (habitoForte && habitoForte.taxa > 0) {
    insights.push({
      tipo: 'destaque',
      icone: 'Trophy',
      titulo: 'Hábito Dominante',
      texto: `"${habitoForte.habito.titulo}" é seu hábito mais consistente, com ${habitoForte.taxa}% de taxa de sucesso.`
    });
  }

  // Insight de Dia Produtivo
  const melhorDia = performanceDia[0];
  if (melhorDia && melhorDia.media > 0) {
    insights.push({
      tipo: 'calendario',
      icone: 'Calendar',
      titulo: 'Dia de Pico',
      texto: `${melhorDia.nome} costuma ser seu dia mais produtivo. Aproveite para focar nos hábitos mais difíceis.`
    });
  }

  return insights;
}
