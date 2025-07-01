import { NavLink, useLocation } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Receipt, 
  Calendar,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Presupuestos', href: '/presupuestos', icon: FileText },
  { name: 'Facturas', href: '/facturas', icon: Receipt },
  { name: 'Calendario', href: '/calendario', icon: Calendar },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="w-64 bg-card border-r shadow-soft">
      <div className="p-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={cn(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};