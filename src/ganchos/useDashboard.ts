import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { useHabitoStore } from '@/store/useHabitoStore';
import { dashboardService } from '@/servicos/dashboard-service';
import { obterHojeISO } from '@/utilitarios/data';
import { RegistroDiario } from '@/tipos/firebase';
import { parseISO, getDay } from 'date-fns';
import { normalizarFrequencia } from '@/utilitarios/habitos';

export function useDashboard() {
  const { usuario } = useAuthStore();
  const { atualizarRegistro, registros, habitos } = useHabitoStore();

  const mutationMarcarHabito = useMutation({
    mutationFn: async ({ habitoId, concluido, data = obterHojeISO() }: { habitoId: string, concluido: boolean, data?: string }) => {
      if (!usuario) throw new Error('Usuário não autenticado');
      
      const dataObj = parseISO(data);
      const diaSemana = getDay(dataObj);
      const habitosDoDia = habitos.filter(h => {
        if (!h || h.status !== 'ativo') return false;
        return normalizarFrequencia(h.frequencia).includes(diaSemana);
      });
      
      const registroAtual = registros[data] || null;
      return dashboardService.salvarRegistro(usuario.uid, data, habitoId, concluido, habitosDoDia.length, registroAtual);
    },
    onMutate: async ({ habitoId, concluido, data = obterHojeISO() }) => {
      // Optimistic Update
      const registroAntigo = registros[data];
      const novosHabitos = { ...(registroAntigo?.habitos || {}), [habitoId]: concluido };
      
      const dataObj = parseISO(data);
      const diaSemana = getDay(dataObj);
      const habitosDoDia = habitos.filter(h => {
        if (!h || h.status !== 'ativo') return false;
        return normalizarFrequencia(h.frequencia).includes(diaSemana);
      });

      const concluidos = Object.values(novosHabitos).filter((v, i) => {
        const id = Object.keys(novosHabitos)[i];
        return v === true && habitosDoDia.some(h => h.id === id);
      }).length;
      
      const porcentagem = habitosDoDia.length > 0 ? Math.round((concluidos / habitosDoDia.length) * 100) : 0;

      const novoRegistro: RegistroDiario = {
        data,
        habitos: novosHabitos,
        porcentagemConclusao: porcentagem,
        atualizadoEm: new Date() as any,
      };

      atualizarRegistro(data, novoRegistro);

      return { registroAntigo };
    },
    onError: (err, variables, context) => {
      // Rollback em caso de erro fatal
      if (context?.registroAntigo) {
        atualizarRegistro(variables.data || obterHojeISO(), context.registroAntigo);
      }
    }
  });

  return {
    marcarHabito: mutationMarcarHabito.mutate,
    isPending: mutationMarcarHabito.isPending
  };
}
