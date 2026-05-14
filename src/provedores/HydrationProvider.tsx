'use client';

import { useEffect, useState } from 'react';

/**
 * HYDRATION PROVIDER
 * 
 * Garante que a aplicação só renderize o conteúdo real após a hidratação do cliente.
 * Isso resolve o erro #418 (Hydration Mismatch) causado por disparidades entre 
 * o HTML gerado no servidor e o renderizado no cliente (ex: datas, stores persistidos).
 */
export function HydrationProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
}
