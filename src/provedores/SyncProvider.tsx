'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useHabitoStore } from '@/store/useHabitoStore';
import { useNotificacaoStore } from '@/store/useNotificacaoStore';
import { dashboardService } from '@/servicos/dashboard-service';
import { habitosService } from '@/servicos/habitos-service';
import { notificacoesRepositorio } from '@/repositorios/notificacoes-repositorio';
import { normalizarHabito, precisaDeMigracao } from '@/utilitarios/habitos';

/**
 * SYNC PROVIDER (Singleton Listener Manager)
 * 
 * Este provider gerencia TODA a sincronização em tempo real do app.
 * Ele garante que exista APENAS UM listener por coleção, independente de 
 * quantas vezes os hooks de consumo (useHabitos, useNotificacoes) sejam chamados.
 * 
 * Localizado no RootLayout para evitar ciclos de unmount/remount durante navegação.
 */
export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { usuario } = useAuthStore();
  const { setHabitos, setRegistros } = useHabitoStore();
  const { setNotificacoes } = useNotificacaoStore();

  const lastUid = useRef<string | null>(null);
  const activeUnsubs = useRef<(() => void)[]>([]);
  const processedMigrations = useRef<Set<string>>(new Set());

  useEffect(() => {
    const uid = usuario?.uid;

    // Se o UID não mudou, não fazemos nada (proteção contra renders extras)
    if (uid === lastUid.current) return;

    // Se o usuário deslogou ou mudou, limpamos listeners antigos
    if (activeUnsubs.current.length > 0) {
      console.log(`[Sync] Limpando ${activeUnsubs.current.length} listeners ativos (UID antigo: ${lastUid.current})`);
      activeUnsubs.current.forEach(unsub => unsub());
      activeUnsubs.current = [];
      processedMigrations.current.clear();
    }

    lastUid.current = uid || null;

    if (!uid) {
      console.log('[Sync] Nenhum usuário logado. Sync pausado.');
      return;
    }

    console.log(`[Sync] 🚀 Iniciando Sincronização Global para: ${uid}`);

    // 1. LISTENER DE HÁBITOS
    console.log('[Sync] [Listener] Criado: habitos');
    const unsubHabitos = dashboardService.ouvirHabitos(uid, (habitosRecebidos) => {
      console.log(`[Sync] Snapshot: ${habitosRecebidos.length} hábitos recebidos`);
      
      const habitosNormalizados = habitosRecebidos.map(h => normalizarHabito(h));
      setHabitos(habitosNormalizados);

      // Migração de Dados (Protegida)
      habitosRecebidos.forEach(h => {
        if (precisaDeMigracao(h) && !processedMigrations.current.has(h.id)) {
          processedMigrations.current.add(h.id);
          const habitoMigrado = normalizarHabito(h);
          console.log(`[Sync] [Migração] Corrigindo hábito legado: ${h.id}`);
          
          habitosService.migrarHabitoLegado(uid, habitoMigrado)
            .catch(err => {
              console.error('[Sync] [Erro] Falha na migração:', h.id, err);
              processedMigrations.current.delete(h.id);
            });
        }
      });
    });

    // 2. LISTENER DE REGISTROS
    console.log('[Sync] [Listener] Criado: registros');
    const unsubRegistros = dashboardService.ouvirRegistros(uid, (novosRegistros) => {
      console.log(`[Sync] Snapshot: ${Object.keys(novosRegistros).length} registros recebidos`);
      setRegistros(novosRegistros);
    });

    // 3. LISTENER DE NOTIFICAÇÕES
    console.log('[Sync] [Listener] Criado: notificacoes');
    const unsubNotificacoes = notificacoesRepositorio.ouvirNotificacoes(uid, (dados) => {
      console.log(`[Sync] Snapshot: ${dados.length} notificações recebidas`);
      setNotificacoes(dados);
    });

    // Guardamos os unsubs para limpeza futura
    activeUnsubs.current = [unsubHabitos, unsubRegistros, unsubNotificacoes];

    return () => {
      // Cleanup total ao desmontar o Provider (fim da sessão)
      console.log('[Sync] 🛑 Desmontando SyncProvider - Encerrando todos os listeners');
      activeUnsubs.current.forEach(unsub => unsub());
      activeUnsubs.current = [];
      lastUid.current = null;
    };
  }, [usuario?.uid, setHabitos, setRegistros, setNotificacoes]);

  return <>{children}</>;
}
