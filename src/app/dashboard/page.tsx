'use client';

import { useEffect } from 'react';
import { ShellMobile } from '@/componentes/layout/ShellMobile';
import { Header } from '@/componentes/dashboard/Header';
import { SeletorData } from '@/componentes/dashboard/SeletorData';
import { ProgressoDiario } from '@/componentes/dashboard/ProgressoDiario';
import { ListaHabitos } from '@/componentes/dashboard/ListaHabitos';
import { HeatmapMensal } from '@/componentes/dashboard/HeatmapMensal';
import { useRealtimeHabitos } from '@/ganchos/useRealtimeHabitos';
import { NudgeDiario } from '@/componentes/notificacoes/NudgeDiario';
import { useInterfaceStore } from '@/store/useInterfaceStore';

export default function DashboardPage() {
  // Inicializa o sync offline-first do Firestore
  useRealtimeHabitos();
  
  const { resetarDataParaHoje } = useInterfaceStore();

  // Resetar para hoje ao abrir o dashboard
  useEffect(() => {
    resetarDataParaHoje();
  }, [resetarDataParaHoje]);

  return (
    <ShellMobile>
      <div className="animate-in fade-in duration-500">
        <Header />
        <NudgeDiario />
        <ProgressoDiario />
        <SeletorData />
        <ListaHabitos />
        <HeatmapMensal />
      </div>
    </ShellMobile>
  );
}
