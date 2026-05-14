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
    const colecao = this.obterCaminhoColecao(uid);
    const docRef = await addDoc(colecao, {
      ...dados,
      frequencia: normalizarFrequencia(dados.frequencia),
      criadoEm: serverTimestamp(),
    });
    return docRef.id;
  },

  async atualizarHabito(uid: string, habitoId: string, dados: Partial<Habito>): Promise<void> {
    const docRef = doc(db, 'usuarios', uid, 'habitos', habitoId);
    const dadosAtualizados = { ...dados };
    
    if (dados.frequencia !== undefined) {
      dadosAtualizados.frequencia = normalizarFrequencia(dados.frequencia);
    }
    
    await updateDoc(docRef, dadosAtualizados);
  },

  async excluirHabito(uid: string, habitoId: string): Promise<void> {
    const docRef = doc(db, 'usuarios', uid, 'habitos', habitoId);
    await deleteDoc(docRef);
  },

  async reordenarHabitos(uid: string, novasOrdens: { id: string, ordem: number }[]): Promise<void> {
    const batch = writeBatch(db);
    novasOrdens.forEach(({ id, ordem }) => {
      const docRef = doc(db, 'usuarios', uid, 'habitos', id);
      batch.update(docRef, { ordem });
    });
    await batch.commit();
  },

  ouvirHabitos(uid: string, callback: (habitos: Habito[]) => void) {
    // Escuta tanto ativos quanto arquivados, ordenados por ordem
    const q = query(
      this.obterCaminhoColecao(uid),
      orderBy('ordem', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const habitos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Habito[];
      callback(habitos);
    });
  }
};
