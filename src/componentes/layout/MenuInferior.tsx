'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Settings, LayoutGrid, BarChart2 } from 'lucide-react';
import { cn } from '@/utilitarios/ui';
import { motion } from 'framer-motion';

const ITENS_MENU = [
  { rotulo: 'Hoje', icone: Home, rota: '/dashboard' },
  { rotulo: 'Hábitos', icone: LayoutGrid, rota: '/habitos' },
  { rotulo: 'Análise', icone: BarChart2, rota: '/estatisticas' },
  { rotulo: 'Ajustes', icone: Settings, rota: '/ajustes' },
];

export function MenuInferior() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 pb-[safe-area-inset-bottom] z-50">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-6">
        {ITENS_MENU.map((item) => {
          const ativo = pathname === item.rota;
          const Icone = item.icone;

          return (
            <Link
              key={item.rota}
              href={item.rota}
              className={cn(
                "relative flex flex-col items-center justify-center w-14 h-14 transition-all active:scale-90",
                ativo ? "text-emerald-500" : "text-slate-400"
              )}
            >
              <Icone className={cn("w-6 h-6 transition-all", ativo && "scale-110")} />
              <span className={cn("text-[9px] font-bold mt-1 uppercase tracking-tighter", ativo ? "opacity-100" : "opacity-0")}>
                {item.rotulo}
              </span>
              {ativo && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute -top-1 w-1.5 h-1.5 bg-emerald-500 rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
