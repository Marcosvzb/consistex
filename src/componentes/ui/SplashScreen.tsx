'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Mantém a splash por 1.8s para garantir preload e efeito premium
    const timer = setTimeout(() => setIsVisible(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(20px)' }}
          transition={{ duration: 0.5, ease: 'circOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F8FAFC] dark:bg-[#020617] overflow-hidden"
        >
          {/* Efeito de brilho de fundo (apenas Desktop) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full md:w-[420px] md:h-[85vh] md:max-h-[840px] md:aspect-[9/19.5] md:rounded-[3.5rem] md:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:md:shadow-[0_20px_50px_rgba(0,0,0,0.4)] md:ring-12 md:ring-white dark:md:ring-slate-900 md:overflow-hidden transition-all duration-700"
          >
            {/* Light Mode Splash */}
            <div className="block dark:hidden w-full h-full relative bg-[#F8FAFC]">
              <Image 
                src="/splash-light.png" 
                alt="Consistex" 
                fill 
                priority 
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover md:object-contain"
              />
            </div>

            {/* Dark Mode Splash */}
            <div className="hidden dark:block w-full h-full relative bg-[#020617]">
              <Image 
                src="/splash-dark.png" 
                alt="Consistex" 
                fill 
                priority 
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover md:object-contain"
              />
            </div>

            {/* Overlay sutil para realçar bordas no mockup (apenas Desktop) */}
            <div className="absolute inset-0 pointer-events-none rounded-[3.5rem] ring-1 ring-inset ring-black/5 dark:ring-white/10 hidden md:block" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
