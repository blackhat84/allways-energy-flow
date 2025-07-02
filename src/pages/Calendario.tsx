import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar as CalendarIcon, Edit, Trash2 } from 'lucide-react';
import { mockEventos, mockClientes } from '@/store/mockData';
import { Evento } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const Calendario = () => {
  const [eventos, setEventos] = useState(mockEventos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    clienteId: '',
    descripcion: '',
    tipo: 'reunion' as 'reunion' | 'instalacion' | 'mantenimiento' | 'otro'
  });

  const resetForm = () => {
    setFormData({
      title: '',
      start: '',
      end: '',
      clienteId: '',
      descripcion: '',
      tipo: 'reunion'
    });
    setEditingEvento(null);
    setSelectedDate(null);
  };

  const handleDateClick = (arg: any) => {
    setSelectedDate(new Date(arg.date));
    const dateStr = arg.dateStr;
    setFormData({
      ...formData,
      start: dateStr + 'T09:00',
      end: dateStr + 'T10:00'
    });
    setIsDialogOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const evento = eventos.find(e => e.id === clickInfo.event.id);
    if (evento) {
      setEditingEvento(evento);
      setFormData({
        title: evento.title,
        start: new Date(evento.start).toISOString().slice(0, 16),
        end: evento.end ? new Date(evento.end).toISOString().slice(0, 16) : '',
        clienteId: evento.clienteId || '',
        descripcion: evento.descripcion,
        tipo: evento.tipo
      });
      setIsDialogOpen(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEvento) {
      setEventos(eventos.map(evento => 
        evento.id === editingEvento.id 
          ? {
              ...evento,
              title: formData.title,
              start: new Date(formData.start),
              end: formData.end ? new Date(formData.end) : undefined,
              clienteId: formData.clienteId || undefined,
              descripcion: formData.descripcion,
              tipo: formData.tipo
            }
          : evento
      ));
      toast({
        title: "Evento actualizado",
        description: "El evento se ha actualizado correctamente.",
      });
    } else {
      const nuevoEvento: Evento = {
        id: Date.now().toString(),
        title: formData.title,
        start: new Date(formData.start),
        end: formData.end ? new Date(formData.end) : undefined,
        clienteId: formData.clienteId || undefined,
        descripcion: formData.descripcion,
        tipo: formData.tipo
      };
      setEventos([...eventos, nuevoEvento]);
      toast({
        title: "Evento creado",
        description: "El nuevo evento se ha creado correctamente.",
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (editingEvento) {
      setEventos(eventos.filter(evento => evento.id !== editingEvento.id));
      toast({
        title: "Evento eliminado",
        description: "El evento se ha eliminado correctamente.",
        variant: "destructive",
      });
      resetForm();
      setIsDialogOpen(false);
    }
  };

  const calendarEvents = eventos.map(evento => ({
    id: evento.id,
    title: evento.title,
    start: evento.start,
    end: evento.end,
    backgroundColor: getTipoColor(evento.tipo),
    borderColor: getTipoColor(evento.tipo),
    textColor: '#ffffff'
  }));

  function getTipoColor(tipo: string) {
    switch (tipo) {
      case 'reunion': return '#3b82f6';
      case 'instalacion': return '#10b981';
      case 'mantenimiento': return '#f59e0b';
      case 'otro': return '#8b5cf6';
      default: return '#6b7280';
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendario de Eventos</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona reuniones, instalaciones y eventos de Allways Energy
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="energy" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingEvento ? 'Editar Evento' : 'Nuevo Evento'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Título del Evento *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Reunión con cliente"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start">Fecha y Hora de Inicio *</Label>
                  <Input
                    id="start"
                    type="datetime-local"
                    value={formData.start}
                    onChange={(e) => setFormData({...formData, start: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end">Fecha y Hora de Fin</Label>
                  <Input
                    id="end"
                    type="datetime-local"
                    value={formData.end}
                    onChange={(e) => setFormData({...formData, end: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Evento</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => setFormData({...formData, tipo: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reunion">Reunión</SelectItem>
                      <SelectItem value="instalacion">Instalación</SelectItem>
                      <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clienteId">Cliente (opcional)</Label>
                  <Select
                    value={formData.clienteId}
                    onValueChange={(value) => setFormData({...formData, clienteId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin cliente</SelectItem>
                      {mockClientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    rows={3}
                    placeholder="Detalles del evento..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                {editingEvento && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="energy">
                  {editingEvento ? 'Actualizar' : 'Crear'} Evento
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Leyenda de colores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tipos de Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
              <span className="text-sm">Reunión</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
              <span className="text-sm">Instalación</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
              <span className="text-sm">Mantenimiento</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#8b5cf6' }}></div>
              <span className="text-sm">Otro</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendario */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={calendarEvents}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              locale="es"
              height="auto"
              eventDisplay="block"
              displayEventTime={true}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};