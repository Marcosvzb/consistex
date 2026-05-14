import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/servicos/firebase';
import { RegistroDiario } from '@/tipos/firebase';

export const registroRepositorio = {
  async obterRegistro(uid: string, data: string): Promise<RegistroDiario | null> {
    const docRef = doc(db, 'usuarios', uid, 'registros', data);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as RegistroDiario) : null;
  },

  async marcarHabito(uid: string, data: string, habitoId: string, concluido: boolean, totalHabitos: number): Promise<void> {
    const docRef = doc(db, 'usuarios', uid, 'registros', data);
    const docSnap = await getDoc(docRef);

    let habitosAtuais = {};
    if (docSnap.exists()) {
      habitosAtuais = docSnap.data().habitos || {};
    }

    const novosHabitos = { ...habitosAtuais, [habitoId]: concluido };
    const concluidos = Object.values(novosHabitos).filter(v => v === true).length;
    const porcentagem = totalHabitos > 0 ? Math.round((concluidos / totalHabitos) * 100) : 0;

    await setDoc(docRef, {
      data,
      habitos: novosHabitos,
      porcentagemConclusao: porcentagem,
      atualizadoEm: serverTimestamp(),
    }, { merge: true });
  }
};
