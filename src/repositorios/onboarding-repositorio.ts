import { doc, writeBatch, serverTimestamp, collection } from 'firebase/firestore';
import { db, auth } from '@/servicos/firebase';
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
    console.log('[Onboarding Repo] Iniciando processo de finalização...');
    
    // 1. Validação de Segurança
    if (!uid) throw new Error('UID do usuário não fornecido.');
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('[Onboarding Repo] Erro: Nenhum usuário autenticado no Firebase Auth.');
      throw new Error('Você precisa estar autenticado para finalizar o onboarding.');
    }

    if (currentUser.uid !== uid) {
      console.error(`[Onboarding Repo] Erro de Inconsistência: Auth UID (${currentUser.uid}) != Param UID (${uid})`);
      throw new Error('Erro de segurança: Identificador de usuário inválido.');
    }

    if (!db) {
      console.error('[Onboarding Repo] Firestore não inicializado.');
      throw new Error('Erro técnico: Banco de dados indisponível.');
    }

    try {
      const batch = writeBatch(db);
      console.log('[Batch] 📦 Criando batch atômico...');

      // 2. Atualizar perfil do usuário
      // PATH: usuarios/{uid}
      const userRef = doc(db, 'usuarios', uid);
      console.log(`[Batch] -> Preparando write em: ${userRef.path}`);
      
      const dadosUsuario = limparDados({
        configuracoes,
        onboardingConcluido: true,
        atualizadoEm: serverTimestamp(),
      });
      
      batch.set(userRef, dadosUsuario, { merge: true });

      // 3. Criar hábitos iniciais
      // PATH: usuarios/{uid}/habitos/{randomId}
      console.log(`[Batch] -> Preparando ${habitos.length} hábitos na subcoleção...`);
      
      habitos.forEach((habito, index) => {
        const habitoRef = doc(collection(db, 'usuarios', uid, 'habitos'));
        console.log(`[Batch]    [Hábito ${index + 1}] path: ${habitoRef.path}`);
        
        const { id, ...dadosBase } = habito;
        
        const dadosHabitoFinal = limparDados({
          ...dadosBase,
          id: habitoRef.id,
          status: 'ativo',
          ordem: index,
          frequencia: [0, 1, 2, 3, 4, 5, 6],
          criadoEm: serverTimestamp(),
        });

        batch.set(habitoRef, dadosHabitoFinal);
      });

      console.log('[Batch] ⌛ Chamando batch.commit()...');
      
      const inicio = Date.now();
      await batch.commit();
      const fim = Date.now();
      
      console.log(`[Batch] ✅ Sucesso! Batch finalizado em ${fim - inicio}ms.`);
    } catch (error: any) {
      console.error('[Batch] ❌ Falha crítica no Firestore:');
      console.error('Código:', error.code);
      console.error('Mensagem:', error.message);
      
      if (error.code === 'permission-denied') {
        console.error('DICA: Verifique se as Security Rules permitem escrita em:', `usuarios/${uid}`);
      }
      
      throw error;
    }
  }
};
