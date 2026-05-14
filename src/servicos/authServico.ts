import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  User, 
  Auth
} from 'firebase/auth';
import { usuarioRepositorio } from '@/repositorios/usuarioRepositorio';
import { Usuario } from '@/tipos/firebase';

/**
 * SERVIÇO DE AUTENTICAÇÃO
 * 
 * Centraliza a lógica de autenticação Firebase.
 * Resiliência Offline: O fluxo prioriza a autenticação. Se o Firestore estiver 
 * inacessível, o usuário ainda entra no app e o perfil sincroniza via background.
 */
export const authServico = {
  /**
   * Realiza login com Google.
   * Não trava se o Firestore estiver offline.
   */
  async loginComGoogle(auth: Auth): Promise<{ user: User; perfil: Usuario | null }> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('[Auth] Usuário autenticado:', user.email);

      // Tentativa de obter/criar perfil (não fatal se falhar por rede)
      let perfil: Usuario | null = null;
      try {
        perfil = await usuarioRepositorio.obterPerfil(user.uid);
        
        if (!perfil) {
          console.log('[Auth] Perfil não encontrado, tentando criar...');
          perfil = await usuarioRepositorio.criarPerfilInicial(user);
        }
      } catch (profileError) {
        console.warn('[Auth] Falha não-fatal ao sincronizar perfil Firestore durante login. Sync continuará em background.');
      }

      return { user, perfil };
    } catch (error: any) {
      console.error('[Auth] Falha crítica no login Google:', error.code || error.message);
      throw error;
    }
  },

  isPopupFechadoPeloUsuario: (error: any) => error.code === 'auth/popup-closed-by-user',
  isPopupBloqueado: (error: any) => error.code === 'auth/popup-blocked',
  isRequisicaoCancelada: (error: any) => error.code === 'auth/cancelled-popup-request',
};
