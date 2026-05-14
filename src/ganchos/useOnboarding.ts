import { useMutation } from '@tanstack/react-query';
import { onboardingService } from '@/servicos/onboarding-service';
import { Habito, Usuario } from '@/tipos/firebase';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { useAuthStore } from '@/store/useAuthStore';

export function useOnboarding() {
  const router = useRouter();
  const { resetOnboarding } = useOnboardingStore();
  const { perfil, setPerfil } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async ({ 
      uid, 
      habitos, 
      configuracoes 
    }: { 
      uid: string; 
      habitos: Partial<Habito>[]; 
      configuracoes: Usuario['configuracoes'] 
    }) => {
      return onboardingService.finalizarOnboarding(uid, habitos, configuracoes);
    },
    onSuccess: (_, variables) => {
      console.log('[Onboarding Hook] Sucesso. Sincronizando estado local...');
      
      // 1. Sincroniza o perfil global IMEDIATAMENTE para evitar loops de redirect
      if (perfil) {
        setPerfil({
          ...perfil,
          onboardingConcluido: true,
          configuracoes: variables.configuracoes
        });
      }
      
      // 2. Limpa dados temporários
      resetOnboarding();
      
      // 3. Redireciona de forma confiável
      console.log('[Onboarding Hook] Redirecionando para Dashboard.');
      router.replace('/dashboard');
    },
    onError: (error: any) => {
      console.error('[Onboarding Hook] Erro fatal na finalização:', error);
    }
  });

  return mutation;
}
