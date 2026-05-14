import { collection, doc, onSnapshot, query, setDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '@/servicos/firebase';
import { Habito, RegistroDiario } from '@/tipos/firebase';
import { normalizarFrequencia } from '@/utilitarios/habitos';

export const dashboardRepositorio = {
  /**
   * Ouve as mudanças nos hábitos do usuário em tempo real
   */
  ouvirHabitos(uid: string, callback: (habitos: Habito[]) => void) {
    const q = query(collection(db, 'usuarios', uid, 'habitos'));
    return onSnapshot(q, (snapshot) => {
      const habitos = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          frequencia: normalizarFrequencia(data.frequencia)
        };
      }) as Habito[];
      // Mantém a ordenação padrão por ordem
      const habitosOrdenados = [...habitos].sort((a, b) => a.ordem - b.ordem);
      callback(habitosOrdenados);
    }, (error) => {
      console.warn('[Firestore] Falha na sync de hábitos (offline mode ativado)', error);
    });
  },

  /**
   * Ouve as mudanças nos registros diários do usuário em tempo real
   */
  ouvirRegistros(uid: string, callback: (registros: Record<string, RegistroDiario>) => void) {
    const q = query(collection(db, 'usuarios', uid, 'registros'));
    return onSnapshot(q, (snapshot) => {
      const registros: Record<string, RegistroDiario> = {};
      snapshot.docs.forEach(doc => {
        registros[doc.id] = doc.data() as RegistroDiario;
      });
      callback(registros);
    }, (error) => {
      console.warn('[Firestore] Falha na sync de registros (offline mode ativado)', error);
    });
  },

  /**
   * Atualiza ou cria um registro diário
   */
  async salvarRegistro(uid: string, data: string, registro: Partial<RegistroDiario>) {
    const docRef = doc(db, 'usuarios', uid, 'registros', data);
    try {
      await setDoc(docRef, {
        ...registro,
        data,
        // @ts-ignore
        atualizadoEm: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.warn('[Firestore] Salvamento enfileirado localmente (offline)');
    }
  }
};
