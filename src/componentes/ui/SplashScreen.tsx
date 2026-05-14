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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F8FAFC] dark:bg-[#020617]"
        >
          {/* Light Mode Splash */}
          <div className="block dark:hidden w-full h-full relative">
            <Image 
              src="/splash-light.png" 
              alt="Consistex" 
              fill 
              priority 
              className="object-cover"
            />
          </div>

          {/* Dark Mode Splash */}
          <div className="hidden dark:block w-full h-full relative">
            <Image 
              src="/splash-dark.png" 
              alt="Consistex" 
              fill 
              priority 
              className="object-cover"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
