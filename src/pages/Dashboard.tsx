import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Receipt, Calendar, TrendingUp, Euro } from 'lucide-react';
import { mockClientes, mockPresupuestos, mockFacturas, mockEventos } from '@/store/mockData';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const totalClientes = mockClientes.length;
  const presupuestosPendientes = mockPresupuestos.filter(p => p.estado === 'pendiente').length;
  const facturasPendientes = mockFacturas.filter(f => f.estado === 'pendiente').length;
  const eventosHoy = mockEventos.filter(e => {
    const today = new Date();
    const eventDate = new Date(e.start);
    return eventDate.toDateString() === today.toDateString();
  }).length;

  const ingresosMes = mockFacturas.reduce((total, factura) => total + factura.total, 0);
  const presupuestosPendientesValor = mockPresupuestos
    .filter(p => p.estado === 'pendiente')
    .reduce((total, presupuesto) => total + presupuesto.total, 0);

  const stats = [
    {
      title: 'Total Clientes',
      value: totalClientes,
      icon: Users,
      color: 'text-primary',
      link: '/clientes'
    },
    {
      title: 'Presupuestos Pendientes',
      value: presupuestosPendientes,
      icon: FileText,
      color: 'text-warning',
      link: '/presupuestos'
    },
    {
      title: 'Facturas Pendientes',
      value: facturasPendientes,
      icon: Receipt,
      color: 'text-destructive',
      link: '/facturas'
    },
    {
      title: 'Eventos Hoy',
      value: eventosHoy,
      icon: Calendar,
      color: 'text-accent',
      link: '/calendario'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Resumen general de la actividad de Allways Energy
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-soft transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stat.value}</div>
                <Link to={stat.link}>
                  <Button variant="ghost" size="sm">
                    Ver más
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-success" />
              Ingresos del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {ingresosMes.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR'
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Basado en facturas generadas este mes
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Euro className="mr-2 h-5 w-5 text-warning" />
              Presupuestos Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">
              {presupuestosPendientesValor.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR'
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Valor total de presupuestos sin convertir
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/clientes/nuevo">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Nuevo Cliente
              </Button>
            </Link>
            <Link to="/presupuestos/nuevo">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Nuevo Presupuesto
              </Button>
            </Link>
            <Link to="/facturas/nuevo">
              <Button variant="outline" className="w-full justify-start">
                <Receipt className="mr-2 h-4 w-4" />
                Nueva Factura
              </Button>
            </Link>
            <Link to="/calendario">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Ver Calendario
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Últimos Presupuestos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPresupuestos.slice(0, 3).map((presupuesto) => {
                const cliente = mockClientes.find(c => c.id === presupuesto.clienteId);
                return (
                  <div key={presupuesto.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{presupuesto.numero}</p>
                      <p className="text-sm text-muted-foreground">{cliente?.nombre}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {presupuesto.total.toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        presupuesto.estado === 'pendiente' 
                          ? 'bg-warning text-warning-foreground' 
                          : 'bg-success text-success-foreground'
                      }`}>
                        {presupuesto.estado}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockEventos.slice(0, 3).map((evento) => {
                const cliente = mockClientes.find(c => c.id === evento.clienteId);
                return (
                  <div key={evento.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{evento.title}</p>
                      <p className="text-sm text-muted-foreground">{cliente?.nombre}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(evento.start).toLocaleDateString('es-ES')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(evento.start).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};