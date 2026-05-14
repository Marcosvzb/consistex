import { create } from 'zustand';
import { User } from 'firebase/auth';
import { Usuario } from '@/tipos/firebase';
import { normalizarPerfil } from '@/utilitarios/perfil';

interface AuthState {
  usuario: User | null;
  perfil: Usuario | null;
  estaCarregando: boolean;
  setUsuario: (usuario: User | null) => void;
  setPerfil: (perfil: any) => void;
  setEstaCarregando: (esta: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  perfil: null,
  estaCarregando: true,
  setUsuario: (usuario) => set({ usuario }),
  setPerfil: (perfil) => set({ perfil: normalizarPerfil(perfil) }),
  setEstaCarregando: (estaCarregando) => set({ estaCarregando }),
}));
