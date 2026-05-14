import { onboardingRepositorio } from '@/repositorios/onboarding-repositorio';
import { Habito, Usuario } from '@/tipos/firebase';

export const onboardingService = {
  async finalizarOnboarding(
    uid: string, 
    habitos: Partial<Habito>[], 
    configuracoes: Usuario['configuracoes']
  ): Promise<void> {
    try {
      console.log('[Onboarding] Finalizando jornada para UID:', uid);
      await onboardingRepositorio.finalizarOnboarding(uid, habitos, configuracoes);
      console.log('[Onboarding] Sucesso ao salvar dados iniciais.');
    } catch (error) {
      console.error('[Onboarding] Erro ao finalizar:', error);
      throw error;
    }
  }
};
