'use client';

import { ShellMobile } from '@/componentes/layout/ShellMobile';
import { Header } from '@/componentes/dashboard/Header';
import { SeletorData } from '@/componentes/dashboard/SeletorData';
import { ProgressoDiario } from '@/componentes/dashboard/ProgressoDiario';
import { ListaHabitos } from '@/componentes/dashboard/ListaHabitos';
import { HeatmapMensal } from '@/componentes/dashboard/HeatmapMensal';
import { useRealtimeHabitos } from '@/ganchos/useRealtimeHabitos';
import { NudgeDiario } from '@/componentes/notificacoes/NudgeDiario';

export default function DashboardPage() {
  // Inicializa o sync offline-first do Firestore
  useRealtimeHabitos();

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
