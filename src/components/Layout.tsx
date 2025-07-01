import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { useAuthStore } from '@/store/authStore';
import allwaysLogo from '@/assets/allways-energy-logo.png';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={allwaysLogo} alt="Allways Energy" className="h-10 w-auto" />
              <h1 className="ml-3 text-xl font-bold text-foreground">Allways Energy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Bienvenido, {user?.nombre}
              </span>
              <button
                onClick={logout}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <Navigation />
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};