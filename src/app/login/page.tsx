'use client';

import { Botao } from '@/componentes/ui/Botao';
import { auth } from '@/servicos/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authServico } from '@/servicos/authServico';
import { useAuthStore } from '@/store/useAuthStore';
import Image from 'next/image';

export default function LoginPage() {
  const [carregandoLocal, setCarregandoLocal] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();
  
  const { usuario, perfil, estaCarregando: authCarregando } = useAuthStore();

  useEffect(() => {
    if (!authCarregando && usuario) {
      if (!perfil || !perfil.onboardingConcluido) {
        router.replace('/onboarding');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [usuario, perfil, authCarregando, router]);

  const handleLoginGoogle = async () => {
    if (carregandoLocal) return;

    setCarregandoLocal(true);
    setErro(null);
    
    try {
      await authServico.loginComGoogle(auth);
    } catch (error: any) {
      if (authServico.isPopupFechadoPeloUsuario(error)) {
        setErro('O login foi cancelado. Tente novamente.');
      } else if (authServico.isPopupBloqueado(error)) {
        setErro('O popup de login foi bloqueado. Verifique os bloqueadores de pop-up.');
      } else {
        setErro('Não conseguimos entrar com Google agora. Tente novamente.');
      }
      setCarregandoLocal(false);
    }
  };

  const estaEmProcessoDeLogin = carregandoLocal || (usuario && authCarregando);

  return (
    <div className="flex flex-col items-center justify-between min-h-[100dvh] bg-[#F8FAFC] p-8 text-slate-900">
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="mb-10 relative"
        >
          <Image 
            src="/logo-horizontal.png" 
            alt="Consistex" 
            width={220} 
            height={55} 
            priority
            className="drop-shadow-sm"
          />
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-500 text-lg mb-8 font-medium leading-relaxed px-4"
        >
          Construa hábitos que duram com uma experiência <span className="text-slate-900 font-bold underline decoration-emerald-400 decoration-2 underline-offset-4">premium</span> e focada em você.
        </motion.p>

        <AnimatePresence>
          {erro && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm flex items-center gap-3 mb-8 w-full border border-red-100"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-medium text-left">{erro}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm"
      >
        <Botao
          tamanho="full"
          onClick={handleLoginGoogle}
          estaCarregando={!!estaEmProcessoDeLogin}
          className="bg-slate-900 text-white py-7 rounded-[1.5rem] shadow-xl shadow-slate-200"
        >
          <div className="flex items-center gap-3">
            {!estaEmProcessoDeLogin && (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                />
              </svg>
            )}
            <span className="font-black tracking-tight">{estaEmProcessoDeLogin ? 'AUTENTICANDO...' : 'ENTRAR COM GOOGLE'}</span>
          </div>
        </Botao>

        <p className="text-center text-[10px] font-bold text-slate-400 mt-8 uppercase tracking-widest leading-loose">
          Ao continuar, você concorda com nossos <br/> Termos de Uso e Política de Privacidade.
        </p>
      </motion.div>
    </div>
  );
}
