'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { ShellMobile } from '@/componentes/layout/ShellMobile';
import { useHabitos } from '@/ganchos/useHabitos';
import { useGerenciarHabito } from '@/ganchos/useGerenciarHabito';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utilitarios/ui';
import { GripVertical, Edit3, Archive, RotateCcw, ChevronRight, Search, Plus, SlidersHorizontal } from 'lucide-react';
import { DrawerHabito } from '@/componentes/habitos/DrawerHabito';
import { Habito } from '@/tipos/firebase';
import { FABHabito } from '@/componentes/habitos/FABHabito';
import { IconeHabito } from '@/componentes/ui/IconeHabito';

export default function HabitosPage() {
  const { habitosAtivos, habitosArquivados } = useHabitos();
  const { reordenarHabitos, reativarHabito, arquivarHabito } = useGerenciarHabito();
  
  // Estado local para reordenação fluida e debounced sync
  const [listaLocalAtivos, setListaLocalAtivos] = useState<Habito[]>([]);
  const reorderTimeout = useRef<NodeJS.Timeout | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [habitoParaEditar, setHabitoParaEditar] = useState<Habito | null>(null);
  const [mostrarArquivados, setMostrarArquivados] = useState(false);
  const [busca, setBusca] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setListaLocalAtivos(habitosAtivos);
  }, [habitosAtivos]);

  const handleReorder = (novosHabitos: Habito[]) => {
    setListaLocalAtivos(novosHabitos);
    
    // Debounce de 1s para salvar no servidor, evitando estourar quota do Firestore
    if (reorderTimeout.current) clearTimeout(reorderTimeout.current);
    
    reorderTimeout.current = setTimeout(() => {
      console.log('[Sync] Sincronizando nova ordem de hábitos...');
      reordenarHabitos(novosHabitos);
    }, 1000);
  };

  const filtrarBusca = (lista: Habito[]) => {
    if (!busca.trim()) return lista;
    return lista.filter(h => 
      h.titulo.toLowerCase().includes(busca.toLowerCase()) || 
      h.descricao?.toLowerCase().includes(busca.toLowerCase())
    );
  };

  const ativosFiltrados = useMemo(() => filtrarBusca(listaLocalAtivos), [listaLocalAtivos, busca]);
  const arquivadosFiltrados = useMemo(() => filtrarBusca(habitosArquivados), [habitosArquivados, busca]);

  const handleEdit = (habito: Habito) => {
    setHabitoParaEditar(habito);
    setIsDrawerOpen(true);
  };

  const handleCreate = () => {
    setHabitoParaEditar(null);
    setIsDrawerOpen(true);
  };

  if (!mounted) return null;

  return (
    <ShellMobile>
      <header className="mb-8 px-1">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 mb-1 tracking-tight">Gerenciar Hábitos</h1>
            <p className="text-slate-400 font-medium">Ajuste sua rotina e organização.</p>
          </div>
        </div>

        {/* Busca e Filtros */}
        <div className="flex gap-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar hábito..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-[1.25rem] pl-11 pr-4 py-4 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/20 transition-all shadow-sm"
            />
          </div>
          <button className="p-4 bg-white border border-slate-100 rounded-[1.25rem] text-slate-400 hover:text-slate-800 transition-all shadow-sm">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Lista de Ativos */}
      <div className="space-y-4 mb-12">
        <div className="flex justify-between items-center px-1 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ativos</h2>
            <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-black">{habitosAtivos.length}</span>
          </div>
          {busca && ativosFiltrados.length === 0 && habitosAtivos.length > 0 && (
             <span className="text-[10px] font-bold text-slate-300 uppercase">Nenhum resultado</span>
          )}
        </div>

        {habitosAtivos.length === 0 && !busca ? (
          <EmptyState 
            titulo="Nenhum hábito ativo" 
            subtitulo="Crie seu primeiro hábito clicando no botão flutuante abaixo."
          />
        ) : (
          <Reorder.Group axis="y" values={listaLocalAtivos} onReorder={handleReorder} className="space-y-3">
            {ativosFiltrados.map((habito) => (
              <Reorder.Item 
                key={habito.id} 
                value={habito}
                className="touch-none"
              >
                <HabitoCard 
                  habito={habito} 
                  onEdit={() => handleEdit(habito)}
                  onArchive={() => arquivarHabito(habito.id)}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>

      {/* Seção de Arquivados */}
      {(habitosArquivados.length > 0 || (busca && arquivadosFiltrados.length > 0)) && (
        <div className="space-y-4 pb-32">
          <button 
            onClick={() => setMostrarArquivados(!mostrarArquivados)}
            className="flex items-center justify-between w-full px-1 py-4 border-t border-slate-100 group"
          >
            <div className="flex items-center gap-2">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Arquivados</h2>
              <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[9px] font-black">{habitosArquivados.length}</span>
            </div>
            <ChevronRight className={cn("w-4 h-4 text-slate-300 transition-transform group-active:scale-90", mostrarArquivados && "rotate-90")} />
          </button>

          <AnimatePresence>
            {mostrarArquivados && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden"
              >
                {arquivadosFiltrados.map((habito) => (
                  <HabitoCard 
                    key={habito.id} 
                    habito={habito} 
                    onEdit={() => handleEdit(habito)}
                    onArchive={() => reativarHabito(habito.id)}
                    arquivado
                  />
                ))}
                {busca && arquivadosFiltrados.length === 0 && (
                   <p className="text-center text-xs text-slate-400 py-4">Nenhum arquivado encontrado para "{busca}"</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <FABHabito onClick={handleCreate} />

      <DrawerHabito 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen}
        habitoParaEditar={habitoParaEditar}
      />
    </ShellMobile>
  );
}

function EmptyState({ titulo, subtitulo }: { titulo: string, subtitulo: string }) {
  return (
    <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-slate-200 text-center flex flex-col items-center">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
        <Plus className="w-8 h-8 text-slate-300" />
      </div>
      <h3 className="font-bold text-slate-800 mb-2">{titulo}</h3>
      <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-[200px]">{subtitulo}</p>
    </div>
  );
}

function HabitoCard({ habito, onEdit, onArchive, arquivado }: { habito: Habito, onEdit: () => void, onArchive: () => void, arquivado?: boolean }) {
  return (
    <motion.div
      layout
      className={cn(
        "bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all",
        arquivado && "opacity-60 bg-slate-50/50"
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        {!arquivado && (
          <div className="text-slate-200 group-active:text-slate-400 transition-colors cursor-grab px-1">
            <GripVertical className="w-5 h-5" />
          </div>
        )}
        
        <IconeHabito 
          icone={habito.icone} 
          cor={habito.cor} 
          animar={false}
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 truncate">{habito.titulo}</h3>
          <p className="text-xs text-slate-400 font-medium truncate">{habito.descricao || 'Sem descrição'}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onEdit}
          className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-90"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button 
          onClick={onArchive}
          className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-90"
        >
          {arquivado ? <RotateCcw className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
        </button>
      </div>
    </motion.div>
  );
}
