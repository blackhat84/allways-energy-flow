import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, FileText, Receipt } from 'lucide-react';
import { mockPresupuestos, mockClientes, mockFacturas } from '@/store/mockData';
import { Presupuesto, Cliente, ItemPresupuesto, Factura } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const Presupuestos = () => {
  const [presupuestos, setPresupuestos] = useState(mockPresupuestos);
  const [facturas, setFacturas] = useState(mockFacturas);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPresupuesto, setEditingPresupuesto] = useState<Presupuesto | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    clienteId: '',
    numero: '',
    items: [{ id: '1', descripcion: '', cantidad: 1, precio: 0, total: 0 }] as ItemPresupuesto[],
    observaciones: ''
  });

  const filteredPresupuestos = presupuestos.filter(presupuesto => {
    const cliente = mockClientes.find(c => c.id === presupuesto.clienteId);
    return presupuesto.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
           cliente?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           false;
  });

  const resetForm = () => {
    setFormData({
      clienteId: '',
      numero: '',
      items: [{ id: '1', descripcion: '', cantidad: 1, precio: 0, total: 0 }],
      observaciones: ''
    });
    setEditingPresupuesto(null);
  };

  const calculateItemTotal = (cantidad: number, precio: number) => cantidad * precio;

  const calculateSubtotal = (items: ItemPresupuesto[]) => 
    items.reduce((sum, item) => sum + item.total, 0);

  const calculateIva = (subtotal: number) => subtotal * 0.21;

  const calculateTotal = (subtotal: number, iva: number) => subtotal + iva;

  const updateItemTotal = (index: number, cantidad: number, precio: number) => {
    const newItems = [...formData.items];
    newItems[index].cantidad = cantidad;
    newItems[index].precio = precio;
    newItems[index].total = calculateItemTotal(cantidad, precio);
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    const newItem: ItemPresupuesto = {
      id: Date.now().toString(),
      descripcion: '',
      cantidad: 1,
      precio: 0,
      total: 0
    };
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subtotal = calculateSubtotal(formData.items);
    const iva = calculateIva(subtotal);
    const total = calculateTotal(subtotal, iva);

    if (editingPresupuesto) {
      setPresupuestos(presupuestos.map(presupuesto => 
        presupuesto.id === editingPresupuesto.id 
          ? { ...presupuesto, ...formData, subtotal, iva, total }
          : presupuesto
      ));
      toast({
        title: "Presupuesto actualizado",
        description: "El presupuesto se ha actualizado correctamente.",
      });
    } else {
      const nuevoPresupuesto: Presupuesto = {
        id: Date.now().toString(),
        ...formData,
        fecha: new Date(),
        subtotal,
        iva,
        total,
        estado: 'pendiente'
      };
      setPresupuestos([...presupuestos, nuevoPresupuesto]);
      toast({
        title: "Presupuesto creado",
        description: "El nuevo presupuesto se ha creado correctamente.",
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (presupuesto: Presupuesto) => {
    setEditingPresupuesto(presupuesto);
    setFormData({
      clienteId: presupuesto.clienteId,
      numero: presupuesto.numero,
      items: presupuesto.items,
      observaciones: presupuesto.observaciones
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPresupuestos(presupuestos.filter(presupuesto => presupuesto.id !== id));
    toast({
      title: "Presupuesto eliminado",
      description: "El presupuesto se ha eliminado correctamente.",
      variant: "destructive",
    });
  };

  const convertirAFactura = (presupuesto: Presupuesto) => {
    const nuevaFactura: Factura = {
      id: Date.now().toString(),
      clienteId: presupuesto.clienteId,
      presupuestoId: presupuesto.id,
      numero: `FAC-${Date.now()}`,
      fecha: new Date(),
      items: presupuesto.items,
      subtotal: presupuesto.subtotal,
      iva: presupuesto.iva,
      total: presupuesto.total,
      estado: 'pendiente',
      observaciones: presupuesto.observaciones
    };

    setFacturas([...facturas, nuevaFactura]);
    
    setPresupuestos(presupuestos.map(p => 
      p.id === presupuesto.id 
        ? { ...p, estado: 'convertido' as const }
        : p
    ));

    toast({
      title: "Factura creada",
      description: "El presupuesto se ha convertido a factura correctamente.",
    });
  };

  const subtotal = calculateSubtotal(formData.items);
  const iva = calculateIva(subtotal);
  const total = calculateTotal(subtotal, iva);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Presupuestos</h1>
          <p className="text-muted-foreground mt-2">
            Administra todos los presupuestos de Allways Energy
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="energy" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Presupuesto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPresupuesto ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clienteId">Cliente *</Label>
                  <Select
                    value={formData.clienteId}
                    onValueChange={(value) => setFormData({...formData, clienteId: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número de Presupuesto *</Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => setFormData({...formData, numero: e.target.value})}
                    placeholder="PRES-001"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-semibold">Items del Presupuesto</Label>
                  <Button type="button" variant="outline" onClick={addItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Añadir Item
                  </Button>
                </div>
                
                {formData.items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                    <div className="col-span-5">
                      <Label>Descripción</Label>
                      <Input
                        value={item.descripcion}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[index].descripcion = e.target.value;
                          setFormData({ ...formData, items: newItems });
                        }}
                        placeholder="Descripción del servicio"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => updateItemTotal(index, parseInt(e.target.value) || 0, item.precio)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Precio €</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.precio}
                        onChange={(e) => updateItemTotal(index, item.cantidad, parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Total €</Label>
                      <Input
                        value={item.total.toFixed(2)}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItem(index)}
                        disabled={formData.items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-end space-y-2">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IVA (21%):</span>
                      <span>{iva.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>{total.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="energy">
                  {editingPresupuesto ? 'Actualizar' : 'Crear'} Presupuesto
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Presupuestos ({filteredPresupuestos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPresupuestos.map((presupuesto) => {
                  const cliente = mockClientes.find(c => c.id === presupuesto.clienteId);
                  return (
                    <TableRow key={presupuesto.id}>
                      <TableCell className="font-medium">{presupuesto.numero}</TableCell>
                      <TableCell>{cliente?.nombre}</TableCell>
                      <TableCell>{new Date(presupuesto.fecha).toLocaleDateString('es-ES')}</TableCell>
                      <TableCell>{presupuesto.total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</TableCell>
                      <TableCell>
                        <Badge variant={presupuesto.estado === 'pendiente' ? 'default' : 'secondary'}>
                          {presupuesto.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(presupuesto)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {presupuesto.estado === 'pendiente' && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => convertirAFactura(presupuesto)}
                            >
                              <Receipt className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(presupuesto.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};