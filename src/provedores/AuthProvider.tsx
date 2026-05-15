'use client';

import { useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/servicos/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import { useInterfaceStore } from '@/store/useInterfaceStore';
import { Usuario } from '@/tipos/firebase';
import { usuarioRepositorio } from '@/repositorios/usuarioRepositorio';

/**
 * AUTH PROVIDER
 * 
 * Gerencia o ciclo de vida da autenticação global e carregamento do perfil.
 * Blindado contra loops de renderização e excesso de leituras no Firestore.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Usamos SELECTORS específicos para evitar que o Provider rerenderize quando o estado muda.
  // Isso quebra o loop: update store -> rerender provider -> re-run effect.
  const setUsuario = useAuthStore(state => state.setUsuario);
  const setPerfil = useAuthStore(state => state.setPerfil);
  const setEstaCarregando = useAuthStore(state => state.setEstaCarregando);
  const setEstaOnline = useInterfaceStore(state => state.setEstaOnline);
  
  // Refs para controle de estabilidade absoluta
  const lastUid = useRef<string | null>(null);
  const fetchedUids = useRef<Set<string>>(new Set());
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      console.log('[Auth] Provider montado');
      isInitialMount.current = false;
    }

    const handleOnline = () => setEstaOnline(true);
    const handleOffline = () => setEstaOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!auth || !db) {
      setEstaCarregando(false);
      return;
    }

    console.log('[Auth] Listener auth criado');

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (user) => {
        const uid = user?.uid || null;

        // Guard 1: Se o UID não mudou, ignoramos o disparo (proteção contra instabilidade do Firebase)
        if (uid === lastUid.current) {
          return;
        }

        console.log(`[Auth] Usuário autenticado: ${uid || 'Nenhum'}`);
        lastUid.current = uid;
        
        setUsuario(user);

        if (user) {
          // Guard 2: Impedir busca repetida do mesmo perfil na mesma sessão/instância
          if (fetchedUids.current.has(user.uid)) {
            console.log('[Auth] Perfil ignorado (já carregado nesta sessão)');
            setEstaCarregando(false);
            return;
          }

          console.log('[Auth] Iniciando busca perfil');
          try {
            const docRef = doc(db, 'usuarios', user.uid);
            
            // Leitura ÚNICA para economizar quota
            const snap = await getDoc(docRef);

            if (snap.exists()) {
              const dados = snap.data() as Usuario;
              console.log('[Auth] Perfil carregado');
              
              // Marcar como carregado ANTES do setPerfil para evitar race conditions
              fetchedUids.current.add(user.uid);
              setPerfil(dados);
              
              // Sincronização offline-first em background
              usuarioRepositorio.syncPerfilComAuth(user.uid, user, dados);
            } else {
              console.log('[Auth] Perfil não encontrado, criando inicial...');
              const novoPerfil = await usuarioRepositorio.criarPerfilInicial(user);
              fetchedUids.current.add(user.uid);
              setPerfil(novoPerfil);
            }
          } catch (error: any) {
            if (error.code === 'resource-exhausted') {
              console.error('[Auth] ERRO CRÍTICO: Quota do Firestore esgotada.');
            } else {
              console.warn('[Auth] Falha ao carregar perfil:', error.message);
            }
          } finally {
            setEstaCarregando(false);
          }
        } else {
          console.log('[Auth] Sessão encerrada');
          setPerfil(null);
          setEstaCarregando(false);
          fetchedUids.current.clear();
        }
      },
      (error) => {
        console.error('[Auth] Erro crítico no listener de autenticação:', error);
        setEstaCarregando(false);
      }
    );

    return () => {
      console.log('[Auth] Cleanup auth');
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribeAuth();
    };
    // Dependências estáveis (setters do Zustand) garantem que o useEffect rode apenas uma vez.
  }, [setUsuario, setPerfil, setEstaCarregando, setEstaOnline]);

  return <>{children}</>;
}
