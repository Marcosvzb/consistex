import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/servicos/firebase';
import { Usuario } from '@/tipos/firebase';
import { User } from 'firebase/auth';

export const usuarioRepositorio = {
  /**
   * Busca o perfil do usuário. 
   * Tenta o servidor por padrão, mas falha silenciosamente se estiver offline, 
   * confiando que o onSnapshot do AuthProvider resolverá o estado assim que possível.
   */
  async obterPerfil(uid: string): Promise<Usuario | null> {
    console.log(`[Firestore] getDoc perfil iniciado (${uid})`);
    try {
      const docRef = doc(db, 'usuarios', uid);
      const docSnap = await getDoc(docRef);
      console.log(`[Firestore] getDoc perfil concluído (${uid})`);
      return docSnap.exists() ? (docSnap.data() as Usuario) : null;
    } catch (error: any) {
      console.error(`[Firestore] getDoc perfil erro (${uid}):`, {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      // Se o erro for de offline, não travamos o fluxo
      if (error.code === 'unavailable' || !navigator.onLine) {
        console.warn('[Firestore] Servidor inacessível. Perfil será carregado via cache/snapshot.');
        return null;
      }
      return null;
    }
  },

  /**
   * Cria o perfil inicial. 
   * O Firestore enfileira esta operação se estiver offline.
   */
  async criarPerfilInicial(user: User): Promise<Usuario> {
    console.log('[Firestore] setDoc perfil inicial iniciado:', user.uid);
    
    const novoUsuario: any = {
      id: user.uid,
      nome: user.displayName || 'Usuário',
      email: user.email || '',
      fotoUrl: user.photoURL || '',
      onboardingConcluido: false,
      configuracoes: {
        tema: 'sistema',
        notificacoesAtivas: false,
        horarioLembrete: '08:00',
        diasLembrete: [0, 1, 2, 3, 4, 5, 6],
        intensidade: 'normal',
        notificacoesInteligentes: true,
        resumoSemanal: true,
        lembretesStreak: true,
        heatmapAtivo: true,
      },
      estatisticas: {
        streakAtual: 0,
        melhorStreak: 0,
        totalConcluidos: 0,
      },
      criadoEm: serverTimestamp(),
      atualizadoEm: serverTimestamp(),
    };

    try {
      const docRef = doc(db, 'usuarios', user.uid);
      await setDoc(docRef, novoUsuario, { merge: true });
      console.log('[Firestore] setDoc perfil inicial concluído:', user.uid);
      return novoUsuario as Usuario;
    } catch (error: any) {
      console.error(`[Firestore] setDoc perfil inicial erro (${user.uid}):`, {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      if (error.code === 'permission-denied') {
        console.error('[Firestore] Erro de Permissão ao criar perfil. Verifique as Security Rules.');
      }
      // Retornamos o objeto local mesmo em caso de erro de rede ou permissão temporária, 
      // pois o App precisa do objeto em memória para não crashar a UI.
      return novoUsuario as Usuario;
    }
  },

  /**
   * Sincroniza dados do Auth para o Firestore se o perfil estiver incompleto.
   * Corrige "Usuário" genérico ou falta de foto.
   */
  async syncPerfilComAuth(uid: string, authUser: User, perfilAtual: Usuario): Promise<void> {
    const precisaAtualizarNome = authUser.displayName && 
                                (!perfilAtual.nome || perfilAtual.nome === 'Usuário') && 
                                perfilAtual.nome !== authUser.displayName;
    
    const precisaAtualizarFoto = authUser.photoURL && 
                                !perfilAtual.fotoUrl && 
                                perfilAtual.fotoUrl !== authUser.photoURL;
    
    const precisaAtualizarEmail = authUser.email && 
                                 !perfilAtual.email && 
                                 perfilAtual.email !== authUser.email;

    if (precisaAtualizarNome || precisaAtualizarFoto || precisaAtualizarEmail) {
      console.log(`[Firestore] setDoc syncPerfilComAuth iniciado (${uid})`);
      const updates: any = {
        atualizadoEm: serverTimestamp()
      };
      if (precisaAtualizarNome) updates.nome = authUser.displayName;
      if (precisaAtualizarFoto) updates.fotoUrl = authUser.photoURL;
      if (precisaAtualizarEmail) updates.email = authUser.email;

      try {
        const docRef = doc(db, 'usuarios', uid);
        await setDoc(docRef, updates, { merge: true });
        console.log(`[Firestore] setDoc syncPerfilComAuth concluído (${uid})`);
      } catch (error: any) {
        console.error(`[Firestore] setDoc syncPerfilComAuth erro (${uid}):`, {
          code: error.code,
          message: error.message,
          stack: error.stack
        });
        console.warn('[Firestore] Falha silenciosa ao sincronizar perfil (provável erro de permissão ou offline).');
      }
    }
  }
};
