import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { useHabitoStore } from '@/store/useHabitoStore';
import { habitosService } from '@/servicos/habitos-service';
import { Habito } from '@/tipos/firebase';

export function useGerenciarHabito() {
  const { usuario } = useAuthStore();
  const { setHabitos, habitos } = useHabitoStore();
  const queryClient = useQueryClient();

  // Mutação para CRIAR hábito
  const mutationCriar = useMutation({
    mutationFn: async (dados: Omit<Habito, 'id' | 'criadoEm'>) => {
      if (!usuario) throw new Error('Usuário não autenticado');
      return habitosService.criarHabito(usuario.uid, dados);
    }
  });

  // Mutação para EDITAR hábito
  const mutationEditar = useMutation({
    mutationFn: async ({ id, dados }: { id: string, dados: Partial<Habito> }) => {
      if (!usuario) throw new Error('Usuário não autenticado');
      return habitosService.atualizarHabito(usuario.uid, id, dados);
    },
    onMutate: async ({ id, dados }) => {
      const habitosAntigos = [...habitos];
      const novosHabitos = habitos.map(h => h.id === id ? { ...h, ...dados } : h);
      setHabitos(novosHabitos);
      return { habitosAntigos };
    },
    onError: (err, variables, context) => {
      if (context?.habitosAntigos) setHabitos(context.habitosAntigos);
    }
  });

  // Mutação para ARQUIVAR hábito
  const mutationArquivar = useMutation({
    mutationFn: async (id: string) => {
      if (!usuario) throw new Error('Usuário não autenticado');
      return habitosService.arquivarHabito(usuario.uid, id);
    },
    onMutate: async (id) => {
      const habitosAntigos = [...habitos];
      const novosHabitos = habitos.map(h => h.id === id ? { ...h, status: 'arquivado' as const } : h);
      setHabitos(novosHabitos);
      return { habitosAntigos };
    },
    onError: (err, variables, context) => {
      if (context?.habitosAntigos) setHabitos(context.habitosAntigos);
    }
  });

  // Mutação para REATIVAR hábito
  const mutationReativar = useMutation({
    mutationFn: async (id: string) => {
      if (!usuario) throw new Error('Usuário não autenticado');
      return habitosService.reativarHabito(usuario.uid, id);
    },
    onMutate: async (id) => {
      const habitosAntigos = [...habitos];
      const novosHabitos = habitos.map(h => h.id === id ? { ...h, status: 'ativo' as const } : h);
      setHabitos(novosHabitos);
      return { habitosAntigos };
    },
    onError: (err, variables, context) => {
      if (context?.habitosAntigos) setHabitos(context.habitosAntigos);
    }
  });

  // Mutação para EXCLUIR hábito
  const mutationExcluir = useMutation({
    mutationFn: async (id: string) => {
      if (!usuario) throw new Error('Usuário não autenticado');
      return habitosService.excluirHabito(usuario.uid, id);
    },
    onMutate: async (id) => {
      const habitosAntigos = [...habitos];
      const novosHabitos = habitos.filter(h => h.id !== id);
      setHabitos(novosHabitos);
      return { habitosAntigos };
    },
    onError: (err, variables, context) => {
      if (context?.habitosAntigos) setHabitos(context.habitosAntigos);
    }
  });

  // Mutação para REORDENAR hábitos
  const mutationReordenar = useMutation({
    mutationFn: async (novosHabitos: Habito[]) => {
      if (!usuario) throw new Error('Usuário não autenticado');
      const novasOrdens = novosHabitos.map((h, index) => ({ id: h.id, ordem: index }));
      return habitosService.reordenarHabitos(usuario.uid, novasOrdens);
    },
    onMutate: async (novosHabitos) => {
      const habitosAntigos = [...habitos];
      setHabitos(novosHabitos);
      return { habitosAntigos };
    },
    onError: (err, variables, context) => {
      if (context?.habitosAntigos) setHabitos(context.habitosAntigos);
    }
  });

  return {
    criarHabito: mutationCriar.mutateAsync,
    editarHabito: mutationEditar.mutate,
    arquivarHabito: mutationArquivar.mutate,
    reativarHabito: mutationReativar.mutate,
    excluirHabito: mutationExcluir.mutate,
    reordenarHabitos: mutationReordenar.mutate,
    isPending: mutationCriar.isPending || mutationEditar.isPending || mutationArquivar.isPending || mutationExcluir.isPending
  };
}
