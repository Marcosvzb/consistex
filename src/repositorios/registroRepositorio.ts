import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/servicos/firebase';
import { RegistroDiario } from '@/tipos/firebase';

export const registroRepositorio = {
  async obterRegistro(uid: string, data: string): Promise<RegistroDiario | null> {
    console.log(`[Firestore] getDoc registro iniciado (${uid}/${data})`);
    try {
      const docRef = doc(db, 'usuarios', uid, 'registros', data);
      const docSnap = await getDoc(docRef);
      console.log(`[Firestore] getDoc registro concluído (${uid}/${data})`);
      return docSnap.exists() ? (docSnap.data() as RegistroDiario) : null;
    } catch (error: any) {
      console.error(`[Firestore] getDoc registro erro (${uid}/${data}):`, {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  },

  async marcarHabito(uid: string, data: string, habitoId: string, concluido: boolean, totalHabitos: number): Promise<void> {
    const docRef = doc(db, 'usuarios', uid, 'registros', data);
    
    console.log(`[Firestore] getDoc (marcarHabito) iniciado (${uid}/${data})`);
    let habitosAtuais = {};
    try {
      const docSnap = await getDoc(docRef);
      console.log(`[Firestore] getDoc (marcarHabito) concluído (${uid}/${data})`);
      if (docSnap.exists()) {
        habitosAtuais = docSnap.data().habitos || {};
      }
    } catch (error: any) {
      console.error(`[Firestore] getDoc (marcarHabito) erro (${uid}/${data}):`, {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }

    const novosHabitos = { ...habitosAtuais, [habitoId]: concluido };
    const concluidos = Object.values(novosHabitos).filter(v => v === true).length;
    const porcentagem = totalHabitos > 0 ? Math.round((concluidos / totalHabitos) * 100) : 0;

    console.log(`[Firestore] setDoc (marcarHabito) iniciado (${uid}/${data})`);
    try {
      await setDoc(docRef, {
        data,
        habitos: novosHabitos,
        porcentagemConclusao: porcentagem,
        atualizadoEm: serverTimestamp(),
      }, { merge: true });
      console.log(`[Firestore] setDoc (marcarHabito) concluído (${uid}/${data})`);
    } catch (error: any) {
      console.error(`[Firestore] setDoc (marcarHabito) erro (${uid}/${data}):`, {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
};
