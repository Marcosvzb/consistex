import { habitoRepositorio } from '@/repositorios/habitos-repositorio';
import { Habito } from '@/tipos/firebase';

export const habitosService = {
  async criarHabito(uid: string, dados: Omit<Habito, 'id' | 'criadoEm'>) {
    return habitoRepositorio.criarHabito(uid, dados);
  },

  async atualizarHabito(uid: string, habitoId: string, dados: Partial<Habito>) {
    return habitoRepositorio.atualizarHabito(uid, habitoId, dados);
  },

  async arquivarHabito(uid: string, habitoId: string) {
    return habitoRepositorio.atualizarHabito(uid, habitoId, { status: 'arquivado' });
  },

  async reativarHabito(uid: string, habitoId: string) {
    return habitoRepositorio.atualizarHabito(uid, habitoId, { status: 'ativo' });
  },

  async excluirHabito(uid: string, habitoId: string) {
    return habitoRepositorio.excluirHabito(uid, habitoId);
  },

  async reordenarHabitos(uid: string, novasOrdens: { id: string, ordem: number }[]) {
    return habitoRepositorio.reordenarHabitos(uid, novasOrdens);
  },

  async migrarHabitoLegado(uid: string, habito: any) {
    const { id, ...resto } = habito;
    // Evita loop infinito: só atualiza se realmente mudou algo
    return habitoRepositorio.atualizarHabito(uid, id, resto);
  }
};
