import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Usuario } from '@/types';

interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        // Simulación de login - en producción esto sería una llamada a la API
        if (username === 'admin' && password === 'allways2024') {
          const user: Usuario = {
            id: '1',
            username: 'admin',
            email: 'admin@allwaysenergy.com',
            nombre: 'Administrador',
            isAuthenticated: true
          };
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);