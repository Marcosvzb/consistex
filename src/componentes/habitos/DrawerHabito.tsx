'use client';

import { useState, useEffect } from 'react';
import { Drawer } from 'vaul';
import { X, Trash2, Archive, RotateCcw } from 'lucide-react';
import { Habito } from '@/tipos/firebase';
import { SeletorIcone } from './SeletorIcone';
import { SeletorCor } from './SeletorCor';
import { SeletorFrequencia } from './SeletorFrequencia';
import { useGerenciarHabito } from '@/ganchos/useGerenciarHabito';
import { useHabitos } from '@/ganchos/useHabitos';

interface DrawerHabitoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habitoParaEditar?: Habito | null;
}

export function DrawerHabito({ open, onOpenChange, habitoParaEditar }: DrawerHabitoProps) {
  const { criarHabito, editarHabito, arquivarHabito, reativarHabito, excluirHabito, isPending } = useGerenciarHabito();
  const { habitosAtivos } = useHabitos();
  
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [icone, setIcone] = useState('heart');
  const [cor, setCor] = useState('bg-emerald-500');
  const [frequencia, setFrequencia] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  useEffect(() => {
    if (habitoParaEditar) {
      setTitulo(habitoParaEditar.titulo);
      setDescricao(habitoParaEditar.descricao);
      setIcone(habitoParaEditar.icone);
      setCor(habitoParaEditar.cor);
      setFrequencia(habitoParaEditar.frequencia);
    } else {
      setTitulo('');
      setDescricao('');
      setIcone('heart');
      setCor('bg-emerald-500');
      setFrequencia([0, 1, 2, 3, 4, 5, 6]);
    }
  }, [habitoParaEditar, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    const dados = {
      titulo,
      descricao,
      icone,
      cor,
      frequencia,
      status: (habitoParaEditar?.status || 'ativo') as "ativo" | "arquivado",
      ordem: habitoParaEditar?.ordem ?? habitosAtivos.length
    };

    if (habitoParaEditar) {
      editarHabito({ id: habitoParaEditar.id, dados });
    } else {
      await criarHabito(dados);
    }
    onOpenChange(false);
  };

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[2rem] h-[92%] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-200 mt-4 mb-2" />
          
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <Drawer.Title className="text-2xl font-black text-slate-800">
                  {habitoParaEditar ? 'Editar Hábito' : 'Novo Hábito'}
                </Drawer.Title>
                <Drawer.Description className="text-xs text-slate-400 font-medium">
                  {habitoParaEditar 
                    ? 'Ajuste os detalhes do seu hábito para manter sua consistência.' 
                    : 'Defina um novo hábito para começar a transformar sua rotina.'}
                </Drawer.Description>
              </div>
              <button 
                onClick={() => onOpenChange(false)}
                className="p-2 bg-slate-100 rounded-full text-slate-400 active:scale-90 transition-transform"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 pb-24">
              {/* Título e Descrição */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome do hábito (ex: Beber água)"
                  className="w-full text-xl font-bold text-slate-800 placeholder:text-slate-300 border-none focus:ring-0 p-0"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  autoFocus
                />
                <textarea
                  placeholder="Adicione uma descrição ou nota..."
                  className="w-full text-slate-500 placeholder:text-slate-300 border-none focus:ring-0 p-0 resize-none h-20"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              {/* Seletor de Cor */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Cor</label>
                <SeletorCor corSelecionada={cor} onChange={setCor} />
              </div>

              {/* Seletor de Frequência */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Frequência</label>
                <SeletorFrequencia frequencia={frequencia} onChange={setFrequencia} corSelecionada={cor} />
              </div>

              {/* Seletor de Ícone */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Ícone</label>
                <SeletorIcone iconeSelecionado={icone} onChange={setIcone} corSelecionada={cor} />
              </div>

              {/* Ações Secundárias (Editar) */}
              {habitoParaEditar && (
                <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      habitoParaEditar.status === 'ativo' ? arquivarHabito(habitoParaEditar.id) : reativarHabito(habitoParaEditar.id);
                      onOpenChange(false);
                    }}
                    className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 text-slate-600 font-bold text-sm transition-colors"
                  >
                    {habitoParaEditar.status === 'ativo' ? (
                      <><Archive className="w-4 h-4" /> Arquivar</>
                    ) : (
                      <><RotateCcw className="w-4 h-4" /> Reativar</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir?')) {
                        excluirHabito(habitoParaEditar.id);
                        onOpenChange(false);
                      }
                    }}
                    className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-rose-50 text-rose-600 font-bold text-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Excluir
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Botão Salvar (Fixo no Bottom) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
            <button
              onClick={handleSubmit}
              disabled={!titulo.trim() || isPending}
              className={`w-full py-5 rounded-[1.5rem] text-white font-black text-lg shadow-xl transition-all active:scale-[0.98] ${
                !titulo.trim() ? 'bg-slate-200 cursor-not-allowed' : `${cor} shadow-${cor.replace('bg-', '')}/30`
              }`}
            >
              {isPending ? 'Salvando...' : habitoParaEditar ? 'Salvar Alterações' : 'Criar Hábito'}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
