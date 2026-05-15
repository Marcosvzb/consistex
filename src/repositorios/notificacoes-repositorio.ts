import { collection, doc, setDoc, query, orderBy, onSnapshot, updateDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '@/servicos/firebase';
import { NotificacaoApp } from '@/tipos/notificacoes';

export const notificacoesRepositorio = {
  ouvirNotificacoes(uid: string, callback: (notificacoes: NotificacaoApp[]) => void) {
    console.log(`[Firestore] onSnapshot ouvirNotificacoes iniciado (${uid})`);
    const q = query(
      collection(db, 'usuarios', uid, 'notificacoes'),
      orderBy('criadaEm', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      console.log(`[Firestore] onSnapshot ouvirNotificacoes recebeu dados (${uid}, Size: ${snapshot.size}, FromCache: ${snapshot.metadata.fromCache})`);
      const notificacoes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NotificacaoApp[];
      callback(notificacoes);
    }, (error: any) => {
      console.error(`[Firestore] onSnapshot ouvirNotificacoes erro (${uid}):`, {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
    });
  },

  async marcarComoLida(uid: string, notificacaoId: string) {
    console.log(`[Firestore] updateDoc marcarComoLida iniciado (${uid}/${notificacaoId})`);
    try {
      const docRef = doc(db, 'usuarios', uid, 'notificacoes', notificacaoId);
      await updateDoc(docRef, { lida: true });
      console.log(`[Firestore] updateDoc marcarComoLida concluído (${uid}/${notificacaoId})`);
    } catch (error: any) {
      console.error(`[Firestore] updateDoc marcarComoLida erro (${uid}/${notificacaoId}):`, {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  },

  async marcarTodasComoLidas(uid: string, notificacoesNaoLidas: string[]) {
    console.log(`[Firestore] batch marcarTodasComoLidas iniciado (${uid}, Total: ${notificacoesNaoLidas.length})`);
    try {
      const batch = writeBatch(db);
      notificacoesNaoLidas.forEach(id => {
        const docRef = doc(db, 'usuarios', uid, 'notificacoes', id);
        batch.update(docRef, { lida: true });
      });
      await batch.commit();
      console.log(`[Firestore] batch marcarTodasComoLidas concluído (${uid})`);
    } catch (error: any) {
      console.error(`[Firestore] batch marcarTodasComoLidas erro (${uid}):`, {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  },

  async atualizarTokenFCM(uid: string, token: string) {
    console.log(`[Firestore] updateDoc atualizarTokenFCM iniciado (${uid})`);
    try {
      const docRef = doc(db, 'usuarios', uid);
      await updateDoc(docRef, { fcmToken: token, 'configuracoes.notificacoesAtivas': true });
      console.log(`[Firestore] updateDoc atualizarTokenFCM concluído (${uid})`);
    } catch (error: any) {
      console.error(`[Firestore] updateDoc atualizarTokenFCM erro (${uid}):`, {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
};
