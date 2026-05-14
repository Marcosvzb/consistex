'use client';

import { useOnboardingStore } from '@/store/useOnboardingStore';
import { EtapaBoasVindas } from '@/componentes/onboarding/EtapaBoasVindas';
import { EtapaHabitos } from '@/componentes/onboarding/EtapaHabitos';
import { EtapaLembretes } from '@/componentes/onboarding/EtapaLembretes';
import { EtapaFinalizacao } from '@/componentes/onboarding/EtapaFinalizacao';
import { OnboardingProgresso } from '@/componentes/onboarding/OnboardingProgresso';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function OnboardingPage() {
  const { etapaAtual } = useOnboardingStore();
  const [montado, setMontado] = useState(false);

  // Evita erros de hidratação com o persist do Zustand
  useEffect(() => {
    setMontado(true);
  }, []);

  if (!montado) return null;

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col p-8 safe-top safe-bottom">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        {etapaAtual > 1 && <OnboardingProgresso />}

        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {etapaAtual === 1 && <EtapaBoasVindas key="boas-vindas" />}
            {etapaAtual === 2 && <EtapaHabitos key="habitos" />}
            {etapaAtual === 3 && <EtapaLembretes key="lembretes" />}
            {etapaAtual === 4 && <EtapaFinalizacao key="finalizacao" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
