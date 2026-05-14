import { collection, doc, setDoc, query, orderBy, onSnapshot, updateDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '@/servicos/firebase';
import { NotificacaoApp } from '@/tipos/notificacoes';

export const notificacoesRepositorio = {
  ouvirNotificacoes(uid: string, callback: (notificacoes: NotificacaoApp[]) => void) {
    const q = query(
      collection(db, 'usuarios', uid, 'notificacoes'),
      orderBy('criadaEm', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const notificacoes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NotificacaoApp[];
      callback(notificacoes);
    });
  },

  async marcarComoLida(uid: string, notificacaoId: string) {
    const docRef = doc(db, 'usuarios', uid, 'notificacoes', notificacaoId);
    await updateDoc(docRef, { lida: true });
  },

  async marcarTodasComoLidas(uid: string, notificacoesNaoLidas: string[]) {
    const batch = writeBatch(db);
    notificacoesNaoLidas.forEach(id => {
      const docRef = doc(db, 'usuarios', uid, 'notificacoes', id);
      batch.update(docRef, { lida: true });
    });
    await batch.commit();
  },

  async atualizarTokenFCM(uid: string, token: string) {
    const docRef = doc(db, 'usuarios', uid);
    await updateDoc(docRef, { fcmToken: token, 'configuracoes.notificacoesAtivas': true });
  }
};
