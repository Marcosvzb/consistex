'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { LoadingBranding } from '@/componentes/ui/LoadingBranding';

export default function RootPage() {
  const { usuario, perfil, estaCarregando } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!estaCarregando) {
      if (!usuario) {
        router.push('/login');
      } else {
        // Usuário autenticado
        if (!perfil || !perfil.onboardingConcluido) {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      }
    }
  }, [usuario, perfil, estaCarregando, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#F8FAFC]">
      <LoadingBranding 
        tamanho={100} 
        mensagem="Iniciando Consistex" 
      />
    </div>
  );
}
