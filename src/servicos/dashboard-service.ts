import { dashboardRepositorio } from '@/repositorios/dashboard-repositorio';
import { Habito, RegistroDiario } from '@/tipos/firebase';

export const dashboardService = {
  ouvirHabitos: (uid: string, callback: (habitos: Habito[]) => void) => {
    return dashboardRepositorio.ouvirHabitos(uid, callback);
  },

  ouvirRegistros: (uid: string, callback: (registros: Record<string, RegistroDiario>) => void) => {
    return dashboardRepositorio.ouvirRegistros(uid, callback);
  },

  salvarRegistro: async (
    uid: string, 
    data: string, 
    habitoId: string, 
    concluido: boolean, 
    totalHabitos: number, 
    registroAtual: RegistroDiario | null
  ) => {
    const habitos = registroAtual?.habitos || {};
    const novosHabitos = { ...habitos, [habitoId]: concluido };
    const concluidos = Object.values(novosHabitos).filter(Boolean).length;
    const porcentagemConclusao = totalHabitos > 0 ? Math.round((concluidos / totalHabitos) * 100) : 0;

    await dashboardRepositorio.salvarRegistro(uid, data, {
      habitos: novosHabitos,
      porcentagemConclusao
    });

    return { habitos: novosHabitos, porcentagemConclusao };
  }
};
