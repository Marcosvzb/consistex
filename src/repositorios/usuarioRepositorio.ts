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
    try {
      const docRef = doc(db, 'usuarios', uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as Usuario) : null;
    } catch (error: any) {
      // Se o erro for de offline, não travamos o fluxo
      if (error.code === 'unavailable' || !navigator.onLine) {
        console.warn('[Firestore] Servidor inacessível. Perfil será carregado via cache/snapshot.');
        return null;
      }
      console.error('[Firestore] Erro ao obter perfil:', error);
      return null;
    }
  },

  /**
   * Cria o perfil inicial. 
   * O Firestore enfileira esta operação se estiver offline.
   */
  async criarPerfilInicial(user: User): Promise<Usuario> {
    const novoUsuario: Partial<Usuario> = {
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
      // @ts-ignore
      criadoEm: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'usuarios', user.uid), novoUsuario);
      return novoUsuario as Usuario;
    } catch (error) {
      console.error('[Firestore] Erro ao criar perfil inicial:', error);
      return novoUsuario as Usuario;
    }
  },

  /**
   * Sincroniza dados do Auth para o Firestore se o perfil estiver incompleto.
   * Corrige "Usuário" genérico ou falta de foto.
   */
  async syncPerfilComAuth(uid: string, authUser: User, perfilAtual: Usuario): Promise<void> {
    const precisaAtualizarNome = (!perfilAtual.nome || perfilAtual.nome === 'Usuário') && authUser.displayName;
    const precisaAtualizarFoto = !perfilAtual.fotoUrl && authUser.photoURL;
    const precisaAtualizarEmail = !perfilAtual.email && authUser.email;

    if (precisaAtualizarNome || precisaAtualizarFoto || precisaAtualizarEmail) {
      console.log('[Firestore] Sincronizando dados do Google Auth para o perfil...');
      const updates: any = {};
      if (precisaAtualizarNome) updates.nome = authUser.displayName;
      if (precisaAtualizarFoto) updates.fotoUrl = authUser.photoURL;
      if (precisaAtualizarEmail) updates.email = authUser.email;

      const docRef = doc(db, 'usuarios', uid);
      await setDoc(docRef, updates, { merge: true });
    }
  }
};
