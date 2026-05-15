import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/servicos/firebase';
import { Habito } from '@/tipos/firebase';
import { normalizarFrequencia } from '@/utilitarios/habitos';

export const habitoRepositorio = {
  obterCaminhoColecao(uid: string) {
    return collection(db, 'usuarios', uid, 'habitos');
  },

  async criarHabito(uid: string, dados: Omit<Habito, 'id' | 'criadoEm'>): Promise<string> {
    console.log(`[Firestore] addDoc hábito iniciado (${uid})`);
    try {
      const colecao = this.obterCaminhoColecao(uid);
      const docRef = await addDoc(colecao, {
        ...dados,
        frequencia: normalizarFrequencia(dados.frequencia),
        criadoEm: serverTimestamp(),
      });
      console.log(`[Firestore] addDoc hábito concluído (${uid}/${docRef.id})`);
      return docRef.id;
    } catch (error: any) {
      console.error(`[Firestore] addDoc hábito erro (${uid}):`, {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  },

  async atualizarHabito(uid: string, habitoId: string, dados: Partial<Habito>): Promise<void> {
    console.log(`[Firestore] updateDoc hábito iniciado (${uid}/${habitoId})`);
    try {
      const docRef = doc(db, 'usuarios', uid, 'habitos', habitoId);
      const dadosAtualizados = { ...dados };
      
      if (dados.frequencia !== undefined) {
        dadosAtualizados.frequencia = normalizarFrequencia(dados.frequencia);
      }
      
      await updateDoc(docRef, dadosAtualizados);
      console.log(`[Firestore] updateDoc hábito concluído (${uid}/${habitoId})`);
    } catch (error: any) {
      console.error(`[Firestore] updateDoc hábito erro (${uid}/${habitoId}):`, {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  },

  async excluirHabito(uid: string, habitoId: string): Promise<void> {
    console.log(`[Firestore] deleteDoc hábito iniciado (${uid}/${habitoId})`);
    try {
      const docRef = doc(db, 'usuarios', uid, 'habitos', habitoId);
      await deleteDoc(docRef);
      console.log(`[Firestore] deleteDoc hábito concluído (${uid}/${habitoId})`);
    } catch (error: any) {
      console.error(`[Firestore] deleteDoc hábito erro (${uid}/${habitoId}):`, {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  },

  async reordenarHabitos(uid: string, novasOrdens: { id: string, ordem: number }[]): Promise<void> {
    console.log(`[Firestore] batch reordenarHabitos iniciado (${uid}, Total: ${novasOrdens.length})`);
    try {
      const batch = writeBatch(db);
      novasOrdens.forEach(({ id, ordem }) => {
        const docRef = doc(db, 'usuarios', uid, 'habitos', id);
        batch.update(docRef, { ordem });
      });
      await batch.commit();
      console.log(`[Firestore] batch reordenarHabitos concluído (${uid})`);
    } catch (error: any) {
      console.error(`[Firestore] batch reordenarHabitos erro (${uid}):`, {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  },

  ouvirHabitos(uid: string, callback: (habitos: Habito[]) => void) {
    console.log(`[Firestore] onSnapshot ouvirHabitos iniciado (${uid})`);
    // Escuta tanto ativos quanto arquivados, ordenados por ordem
    const q = query(
      this.obterCaminhoColecao(uid),
      orderBy('ordem', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      console.log(`[Firestore] onSnapshot ouvirHabitos recebeu dados (${uid}, Size: ${snapshot.size}, FromCache: ${snapshot.metadata.fromCache})`);
      const habitos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Habito[];
      callback(habitos);
    }, (error: any) => {
      console.error(`[Firestore] onSnapshot ouvirHabitos erro (${uid}):`, {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
    });
  }
};
