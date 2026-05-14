import { notificacoesRepositorio } from '@/repositorios/notificacoes-repositorio';

export const notificacoesService = {
  async solicitarPermissaoPush(uid: string): Promise<boolean> {
    try {
      if (!('Notification' in window)) {
        console.warn('Este browser não suporta notificações web.');
        return false;
      }

      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('[Notificacoes] Permissão concedida. Registrando Service Worker e obtendo token FCM (mock para setup)...');
        
        // Em um app real, aqui chamaríamos a lib do FCM (firebase/messaging)
        // const { getMessaging, getToken } = await import('firebase/messaging');
        // const messaging = getMessaging(app);
        // const token = await getToken(messaging, { vapidKey: '...' });
        
        const mockToken = `fcm-token-${Date.now()}`;
        await notificacoesRepositorio.atualizarTokenFCM(uid, mockToken);
        return true;
      } else {
        console.log('[Notificacoes] Permissão negada pelo usuário.');
        return false;
      }
    } catch (error) {
      console.error('[Notificacoes] Erro ao solicitar permissão de push:', error);
      return false;
    }
  },

  marcarComoLida(uid: string, notificacaoId: string) {
    return notificacoesRepositorio.marcarComoLida(uid, notificacaoId);
  },

  marcarTodasComoLidas(uid: string, ids: string[]) {
    return notificacoesRepositorio.marcarTodasComoLidas(uid, ids);
  }
};
