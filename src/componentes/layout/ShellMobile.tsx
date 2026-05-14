'use client';

import { MenuInferior } from './MenuInferior';

export function ShellMobile({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <div className="flex-1 pb-20">
        <div className="max-w-md mx-auto w-full px-4 pt-6">
          {children}
        </div>
      </div>
      <MenuInferior />
    </div>
  );
}
