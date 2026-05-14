import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useHabitoStore } from '@/store/useHabitoStore';
import { dashboardService } from '@/servicos/dashboard-service';
import { habitosService } from '@/servicos/habitos-service';
import { normalizarHabito, precisaDeMigracao } from '@/utilitarios/habitos';

export function useRealtimeHabitos() {
  const { usuario } = useAuthStore();
  const { setHabitos, setRegistros } = useHabitoStore();

  useEffect(() => {
    if (!usuario) return;

    const unsubHabitos = dashboardService.ouvirHabitos(usuario.uid, (habitosRecebidos) => {
      // Normaliza todos os hábitos recebidos
      const habitosNormalizados = habitosRecebidos.map(h => normalizarHabito(h));
      setHabitos(habitosNormalizados);

      // Migração Silenciosa: Detecta hábitos que precisam de correção no Firestore
      habitosRecebidos.forEach(h => {
        if (precisaDeMigracao(h)) {
          const habitoMigrado = normalizarHabito(h);
          habitosService.migrarHabitoLegado(usuario.uid, habitoMigrado)
            .catch(err => console.error('[Migration] Falha ao auto-corrigir hábito:', h.id, err));
        }
      });
    });

    const unsubRegistros = dashboardService.ouvirRegistros(usuario.uid, (novosRegistros) => {
      setRegistros(novosRegistros);
    });

    return () => {
      unsubHabitos();
      unsubRegistros();
    };
  }, [usuario, setHabitos, setRegistros]);
}
