'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { Botao } from '@/componentes/ui/Botao';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { ICONES_HABITO, OBTER_ICONE } from '@/constantes/icones';
import { useState } from 'react';
import { cn } from '@/utilitarios/ui';

const PRESETS = [
  { titulo: 'Beber Água', icone: 'water', cor: '#3B82F6' },
  { titulo: 'Ler Livro', icone: 'book', cor: '#8B5CF6' },
  { titulo: 'Treinar', icone: 'gym', cor: '#EF4444' },
  { titulo: 'Meditar', icone: 'brain', cor: '#10B981' },
  { titulo: 'Dormir Cedo', icone: 'sleep', cor: '#6366F1' },
];

const CORES = ['#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#EC4899'];

export function EtapaHabitos() {
  const { setEtapaAtual, habitosTemporarios, adicionarHabito, removerHabito, atualizarHabito } = useOnboardingStore();
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const handleTogglePreset = (preset: typeof PRESETS[0]) => {
    const existe = habitosTemporarios.find(h => h.titulo === preset.titulo);
    if (existe) {
      removerHabito(existe.id!);
    } else {
      adicionarHabito({
        titulo: preset.titulo,
        icone: preset.icone,
        cor: preset.cor,
        descricao: 'Hábito diário',
      });
    }
  };

  const handleAdicionarCustomizado = () => {
    adicionarHabito({
      titulo: 'Novo Hábito',
      icone: 'default',
      cor: '#10B981',
      descricao: 'Descrição do hábito',
    });
  };

  const podeAvancar = habitosTemporarios.length >= 5;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full overflow-hidden"
    >
      <header className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Escolha seus hábitos</h2>
        <p className="text-slate-500 text-sm">
          Selecione ou crie pelo menos <span className="font-bold text-slate-900">5 hábitos</span> para começar.
          ({habitosTemporarios.length}/5)
        </p>
      </header>

      <div className="flex-1 overflow-y-auto pr-1 space-y-6 pb-20 no-scrollbar">
        {/* Presets */}
        <section>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Sugestões</h3>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => {
              const selecionado = habitosTemporarios.some(h => h.titulo === preset.titulo);
              return (
                <button
                  key={preset.titulo}
                  onClick={() => handleTogglePreset(preset)}
                  className={cn(
                    "px-4 py-2 rounded-full border text-sm font-medium transition-all flex items-center gap-2",
                    selecionado 
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-100" 
                      : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                  )}
                >
                  {preset.titulo}
                  {selecionado && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* Lista de Hábitos */}
        <section className="space-y-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Meus Hábitos</h3>
            <button 
              onClick={handleAdicionarCustomizado}
              className="text-emerald-500 text-sm font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Adicionar
            </button>
          </div>

          <AnimatePresence mode="popLayout">
            {habitosTemporarios.map((habito, index) => {
              const Icone = OBTER_ICONE(habito.icone || 'default');
              const isEditando = editandoId === habito.id;

              return (
                <motion.div
                  key={habito.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={cn(
                    "bg-white border rounded-2xl transition-all overflow-hidden",
                    isEditando ? "border-emerald-200 ring-2 ring-emerald-50 shadow-lg" : "border-slate-100 shadow-sm"
                  )}
                >
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
                        style={{ backgroundColor: `${habito.cor}15`, color: habito.cor }}
                        onClick={() => setEditandoId(isEditando ? null : habito.id!)}
                      >
                        <Icone className="w-5 h-5" />
                      </div>
                      
                      {isEditando ? (
                        <input
                          autoFocus
                          value={habito.titulo}
                          onChange={(e) => atualizarHabito(habito.id!, { titulo: e.target.value })}
                          className="font-bold text-slate-800 bg-transparent outline-none border-b-2 border-emerald-500 flex-1 py-1"
                        />
                      ) : (
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => setEditandoId(habito.id!)}
                        >
                          <h4 className="font-bold text-slate-800 leading-tight">{habito.titulo}</h4>
                          <p className="text-xs text-slate-400">Todo dia</p>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => removerHabito(habito.id!)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {isEditando && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="mb-4">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Cor</label>
                        <div className="flex gap-2">
                          {CORES.map(c => (
                            <button
                              key={c}
                              onClick={() => atualizarHabito(habito.id!, { cor: c })}
                              className={cn(
                                "w-6 h-6 rounded-full border-2 transition-transform",
                                habito.cor === c ? "scale-125 border-slate-900" : "border-transparent"
                              )}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="mb-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Ícone</label>
                        <div className="grid grid-cols-6 gap-2">
                          {Object.keys(ICONES_HABITO).map(key => {
                            const ItemIcon = OBTER_ICONE(key);
                            return (
                              <button
                                key={key}
                                onClick={() => atualizarHabito(habito.id!, { icone: key })}
                                className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                  habito.icone === key ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                                )}
                              >
                                <ItemIcon className="w-4 h-4" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {habitosTemporarios.length === 0 && (
            <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl text-center">
              <Sparkles className="w-8 h-8 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Clique em uma sugestão acima para começar.</p>
            </div>
          )}
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background via-background/90 to-transparent pt-12">
        <div className="max-w-md mx-auto">
          <Botao
            tamanho="full"
            disabled={!podeAvancar}
            onClick={() => setEtapaAtual(3)}
            className={cn(
              "py-6 text-lg rounded-2xl shadow-xl transition-all",
              podeAvancar ? "bg-slate-900 text-white shadow-slate-200" : "bg-slate-100 text-slate-300"
            )}
          >
            {podeAvancar ? 'Continuar' : `Escolha mais ${5 - habitosTemporarios.length}`}
          </Botao>
        </div>
      </div>
    </motion.div>
  );
}
