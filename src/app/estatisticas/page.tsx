'use client';

import { ShellMobile } from '@/componentes/layout/ShellMobile';
import { ResumoCards } from '@/componentes/estatisticas/ResumoCards';
import { GraficoEvolucao } from '@/componentes/estatisticas/GraficoEvolucao';
import { GraficoPerformance } from '@/componentes/estatisticas/GraficoPerformance';
import { RankingHabitos } from '@/componentes/estatisticas/RankingHabitos';
import { ListaInsights } from '@/componentes/estatisticas/ListaInsights';
import { useEstatisticas } from '@/ganchos/useEstatisticas';

export default function EstatisticasPage() {
  console.log('[Estatisticas] render');
  const estatisticas = useEstatisticas();

  return (
    <ShellMobile>
      <header className="mb-8 px-2">
        <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Estatísticas</h1>
        <p className="text-slate-400 font-medium">Acompanhe sua evolução em detalhes.</p>
      </header>

      <div className="space-y-6 pb-12">
        <ResumoCards dados={estatisticas} />
        <GraficoEvolucao dados={estatisticas} />
        <ListaInsights />
        <GraficoPerformance dados={estatisticas} />
        <RankingHabitos dados={estatisticas} />
      </div>
    </ShellMobile>
  );
}
