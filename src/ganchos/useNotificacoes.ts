import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { notificacoesRepositorio } from '@/repositorios/notificacoes-repositorio';
import { notificacoesService } from '@/servicos/notificacoes-service';
import { NotificacaoApp } from '@/tipos/notificacoes';

export function useNotificacoes() {
  const { usuario } = useAuthStore();
  const [notificacoes, setNotificacoes] = useState<NotificacaoApp[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(true);

  useEffect(() => {
    if (!usuario) {
      setNotificacoes([]);
      setEstaCarregando(false);
      return;
    }

    const unsub = notificacoesRepositorio.ouvirNotificacoes(usuario.uid, (dados) => {
      setNotificacoes(dados);
      setEstaCarregando(false);
    });

    return () => unsub();
  }, [usuario]);

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
