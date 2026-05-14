'use client';

import { useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/servicos/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import { useInterfaceStore } from '@/store/useInterfaceStore';
import { Usuario } from '@/tipos/firebase';
import { usuarioRepositorio } from '@/repositorios/usuarioRepositorio';

/**
 * AUTH PROVIDER
 * 
 * Gerencia o ciclo de vida da autenticação global e sincronização do perfil.
 * Resiliência: Finaliza o carregamento assim que o Auth é resolvido, permitindo 
 * que o Firestore sincronize o perfil em background (cache ou rede).
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUsuario, setPerfil, setEstaCarregando } = useAuthStore();
  const { setEstaOnline } = useInterfaceStore();
  const unsubPerfilRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Monitoramento de conectividade
    const handleOnline = () => setEstaOnline(true);
    const handleOffline = () => setEstaOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!auth || !db) {
      setEstaCarregando(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (user) => {
        if (unsubPerfilRef.current) {
          unsubPerfilRef.current();
          unsubPerfilRef.current = null;
        }

        setUsuario(user);

        if (user) {
          try {
            const docRef = doc(db, 'usuarios', user.uid);
            
            // Tentativa resiliente de obter perfil inicial (do cache ou rede)
            getDoc(docRef).then((snap) => {
              if (snap.exists()) {
                const dados = snap.data() as Usuario;
                setPerfil(dados);
                // Trigger de sync silencioso se os dados estiverem legados/incompletos
                usuarioRepositorio.syncPerfilComAuth(user.uid, user, dados);
              }
            }).catch(() => {
              // Silencioso: Se falhar (offline), o onSnapshot abaixo assumirá
            });

            // Listener em tempo real (background)
            unsubPerfilRef.current = onSnapshot(
              docRef,
              (snap) => {
                if (snap.exists()) {
                  const dados = snap.data() as Usuario;
                  setPerfil(dados);
                }
              },
              (error) => {
                // Warning apenas se não for erro de offline esperado
                if (error.code !== 'unavailable') {
                  console.warn('[Auth] Sync de perfil limitado:', error.message);
                }
              }
            );
          } catch (error) {
            console.warn('[Auth] Erro ao iniciar sincronia de perfil.');
          } finally {
            // Crucial: Finaliza loading independente do Firestore
            setEstaCarregando(false);
          }
        } else {
          setPerfil(null);
          setEstaCarregando(false);
        }
      },
      (error) => {
        console.error('[Auth] Erro crítico no listener de autenticação:', error);
        setEstaCarregando(false);
      }
    );

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribeAuth();
      if (unsubPerfilRef.current) unsubPerfilRef.current();
    };
  }, [setUsuario, setPerfil, setEstaCarregando, setEstaOnline]);

  return <>{children}</>;
}
