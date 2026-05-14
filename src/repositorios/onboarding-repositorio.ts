import { doc, writeBatch, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '@/servicos/firebase';
import { Habito, Usuario } from '@/tipos/firebase';

/**
 * Utilitário para remover campos undefined que podem travar o Firestore
 */
function limparDados(obj: any) {
  const novoObj = { ...obj };
  Object.keys(novoObj).forEach(key => {
    if (novoObj[key] === undefined) {
      delete novoObj[key];
    } else if (typeof novoObj[key] === 'object' && novoObj[key] !== null && !(novoObj[key] instanceof Date)) {
      novoObj[key] = limparDados(novoObj[key]);
    }
  });
  return novoObj;
}

export const onboardingRepositorio = {
  async finalizarOnboarding(
    uid: string, 
    habitos: Partial<Habito>[], 
    configuracoes: Usuario['configuracoes']
  ): Promise<void> {
    if (!uid) throw new Error('UID do usuário não fornecido.');
    
    console.log('[Batch] 🚀 Verificando instância do Firestore...');
    if (!db) {
      console.error('[Batch] Instância "db" está undefined! Verifique src/servicos/firebase.ts');
      throw new Error('Firestore não inicializado.');
    }

    console.log('[Batch] 📦 Iniciando batch atômico para UID:', uid);

    try {
      const batch = writeBatch(db);
      console.log('[Batch] Instância do writeBatch criada com sucesso.');

      // 1. Atualizar perfil do usuário
      const userRef = doc(db, 'usuarios', uid);
      const dadosUsuario = limparDados({
        configuracoes,
        onboardingConcluido: true,
        // @ts-ignore
        atualizadoEm: serverTimestamp(),
      });
      
      console.log('[Batch] Passo 1: Configurando perfil do usuário...');
      batch.set(userRef, dadosUsuario, { merge: true });
      console.log('[Batch] Passo 1: OK.');

      // 2. Criar hábitos iniciais
      console.log('[Batch] Passo 2: Configurando hábitos...');
      habitos.forEach((habito, index) => {
        const habitoRef = doc(collection(db, 'usuarios', uid, 'habitos'));
        const { id, ...dadosBase } = habito;
        
        const dadosHabitoFinal = limparDados({
          ...dadosBase,
          id: habitoRef.id,
          status: 'ativo',
          ordem: index,
          frequencia: [0, 1, 2, 3, 4, 5, 6],
          // @ts-ignore
          criadoEm: serverTimestamp(),
        });

        console.log(`[Batch] Adicionando hábito ${index + 1}: ${habito.titulo}`);
        batch.set(habitoRef, dadosHabitoFinal);
      });
      console.log('[Batch] Passo 2: OK.');

      console.log('[Batch] ⌛ Chamando batch.commit()...');
      
      // Monitor de tempo para o commit
      const inicio = Date.now();
      await batch.commit();
      const fim = Date.now();
      
      console.log(`[Batch] ✅ Commit finalizado em ${fim - inicio}ms.`);
    } catch (error: any) {
      console.error('[Batch] ❌ Erro na finalização:');
      console.error('Mensagem:', error.message);
      console.error('Código:', error.code);
      console.error('Stack:', error.stack);
      throw error;
    }
  }
};
