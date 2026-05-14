'use client';

import { Drawer } from 'vaul';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/utilitarios/ui';

interface ConfirmacaoDesmarcarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  habitoTitulo: string;
}

export function ConfirmacaoDesmarcar({ open, onOpenChange, onConfirm, habitoTitulo }: ConfirmacaoDesmarcarProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[2.5rem] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-200 mt-4 mb-2" />
          
          <div className="p-8 pb-10 text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-[1.5rem] flex items-center justify-center text-rose-500 mx-auto mb-6 shadow-sm border border-rose-100">
              <AlertCircle className="w-8 h-8" />
            </div>

            <Drawer.Title className="text-2xl font-black text-slate-800 mb-2">
              Desmarcar Hábito?
            </Drawer.Title>
            
            <Drawer.Description className="text-slate-500 font-medium leading-relaxed max-w-[280px] mx-auto mb-10">
              Você concluiu <span className="text-slate-800 font-bold">"{habitoTitulo}"</span>. Desmarcar agora impactará sua consistência e streak atual.
            </Drawer.Description>

            <div className="flex flex-col gap-3">
              <button
                onClick={onConfirm}
                className="w-full py-5 rounded-[1.5rem] bg-rose-500 text-white font-black text-lg shadow-xl shadow-rose-500/20 active:scale-[0.98] transition-all"
              >
                Sim, Desmarcar
              </button>
              <button
                onClick={() => onOpenChange(false)}
                className="w-full py-5 rounded-[1.5rem] bg-slate-100 text-slate-600 font-bold text-lg active:scale-[0.98] transition-all"
              >
                Manter Concluído
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
