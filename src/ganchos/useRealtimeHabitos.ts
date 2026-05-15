/**
 * HOOK DEPRECATED: Sincronização agora é gerenciada pelo SyncProvider global.
 * Este hook foi mantido apenas para evitar quebras em componentes legados,
 * mas ele não executa mais nenhuma lógica de listener.
 */
export function useRealtimeHabitos() {
  // Logic moved to SyncProvider
  return null;
}
