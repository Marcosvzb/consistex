import { collection, doc, onSnapshot, query, setDoc, serverTimestamp, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/servicos/firebase';
import { Habito, RegistroDiario } from '@/tipos/firebase';
import { normalizarFrequencia } from '@/utilitarios/habitos';

export const dashboardRepositorio = {
  /**
   * Ouve as mudanças nos hábitos do usuário em tempo real
   */
  ouvirHabitos(uid: string, callback: (habitos: Habito[]) => void) {
    console.log(`[Firestore] onSnapshot ouvirHabitos iniciado (${uid})`);
    const q = query(
      collection(db, 'usuarios', uid, 'habitos'),
      orderBy('ordem', 'asc')
    );
    return onSnapshot(q, (snapshot) => {
      console.log(`[Firestore] onSnapshot ouvirHabitos recebeu dados (${uid}, Size: ${snapshot.size}, FromCache: ${snapshot.metadata.fromCache})`);
      const habitos = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          frequencia: normalizarFrequencia(data.frequencia)
        };
      }) as Habito[];
      
      callback(habitos);
    }, (error: any) => {
      console.error(`[Firestore] onSnapshot ouvirHabitos erro (${uid}):`, {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      console.warn('[Firestore] Falha na sync de hábitos (offline mode ativado)', error);
    });
  },

  /**
   * Ouve as mudanças nos registros diários do usuário em tempo real
   */
  ouvirRegistros(uid: string, callback: (registros: Record<string, RegistroDiario>) => void) {
    console.log(`[Firestore] onSnapshot ouvirRegistros iniciado (${uid})`);
    const q = query(collection(db, 'usuarios', uid, 'registros'));
    return onSnapshot(q, (snapshot) => {
      console.log(`[Firestore] onSnapshot ouvirRegistros recebeu dados (${uid}, Size: ${snapshot.size}, FromCache: ${snapshot.metadata.fromCache})`);
      const registros: Record<string, RegistroDiario> = {};
      snapshot.docs.forEach(doc => {
        registros[doc.id] = doc.data() as RegistroDiario;
      });
      callback(registros);
    }, (error: any) => {
      console.error(`[Firestore] onSnapshot ouvirRegistros erro (${uid}):`, {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      console.warn('[Firestore] Falha na sync de registros (offline mode ativado)', error);
    });
  },

  /**
   * Atualiza ou cria um registro diário
   */
  async salvarRegistro(uid: string, data: string, registro: Partial<RegistroDiario>) {
    console.log(`[Firestore] setDoc salvarRegistro iniciado (${uid}/${data})`);
    const docRef = doc(db, 'usuarios', uid, 'registros', data);
    try {
      await setDoc(docRef, {
        ...registro,
        data,
        // @ts-ignore
        atualizadoEm: serverTimestamp()
      }, { merge: true });
      console.log(`[Firestore] setDoc salvarRegistro concluído (${uid}/${data})`);
    } catch (error: any) {
      console.error(`[Firestore] setDoc salvarRegistro erro (${uid}/${data}):`, {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      console.warn('[Firestore] Salvamento enfileirado localmente (offline)');
    }
  }
};
