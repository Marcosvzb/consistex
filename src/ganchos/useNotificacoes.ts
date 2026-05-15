import { useAuthStore } from '@/store/useAuthStore';
import { useNotificacaoStore } from '@/store/useNotificacaoStore';
import { notificacoesService } from '@/servicos/notificacoes-service';

export function useNotificacoes() {
  const { usuario } = useAuthStore();
  const { notificacoes, estaCarregando } = useNotificacaoStore();

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida);

  const marcarComoLida = async (id: string) => {
    if (!usuario) return;
    await notificacoesService.marcarComoLida(usuario.uid, id);
  };

  const marcarTodasComoLidas = async () => {
    if (!usuario || notificacoesNaoLidas.length === 0) return;
    const ids = notificacoesNaoLidas.map(n => n.id);
    await notificacoesService.marcarTodasComoLidas(usuario.uid, ids);
  };

  const solicitarPush = async () => {
    if (!usuario) return false;
    return await notificacoesService.solicitarPermissaoPush(usuario.uid);
  };

  return {
    notificacoes,
    notificacoesNaoLidas,
    naoLidasCount: notificacoesNaoLidas.length,
    estaCarregando,
    marcarComoLida,
    marcarTodasComoLidas,
    solicitarPush
  };
}
