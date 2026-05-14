'use client';

import { useOnboardingStore } from '@/store/useOnboardingStore';
import { motion } from 'framer-motion';

export function OnboardingProgresso() {
  const { etapaAtual } = useOnboardingStore();

  return (
    <div className="flex gap-2 mb-10">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          {i <= etapaAtual && (
            <motion.div
              layoutId="progresso"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              className="h-full bg-emerald-500"
            />
          )}
        </div>
      ))}
    </div>
  );
}
