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
import { Plus, Search, Edit, Trash2, Printer, CheckCircle } from 'lucide-react';
import { mockFacturas, mockClientes, mockPresupuestos } from '@/store/mockData';
import { Factura, Cliente, ItemPresupuesto } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const Facturas = () => {
  const [facturas, setFacturas] = useState(mockFacturas);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFactura, setEditingFactura] = useState<Factura | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    clienteId: '',
    presupuestoId: '',
    numero: '',
    items: [{ id: '1', descripcion: '', cantidad: 1, precio: 0, total: 0 }] as ItemPresupuesto[],
    observaciones: ''
  });

  const filteredFacturas = facturas.filter(factura => {
    const cliente = mockClientes.find(c => c.id === factura.clienteId);
    return factura.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
           cliente?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           false;
  });

  const resetForm = () => {
    setFormData({
      clienteId: '',
      presupuestoId: '',
      numero: '',
      items: [{ id: '1', descripcion: '', cantidad: 1, precio: 0, total: 0 }],
      observaciones: ''
    });
    setEditingFactura(null);
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

    if (editingFactura) {
      setFacturas(facturas.map(factura => 
        factura.id === editingFactura.id 
          ? { ...factura, ...formData, subtotal, iva, total }
          : factura
      ));
      toast({
        title: "Factura actualizada",
        description: "La factura se ha actualizado correctamente.",
      });
    } else {
      const nuevaFactura: Factura = {
        id: Date.now().toString(),
        ...formData,
        fecha: new Date(),
        subtotal,
        iva,
        total,
        estado: 'pendiente'
      };
      setFacturas([...facturas, nuevaFactura]);
      toast({
        title: "Factura creada",
        description: "La nueva factura se ha creado correctamente.",
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (factura: Factura) => {
    setEditingFactura(factura);
    setFormData({
      clienteId: factura.clienteId,
      presupuestoId: factura.presupuestoId || '',
      numero: factura.numero,
      items: factura.items,
      observaciones: factura.observaciones
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setFacturas(facturas.filter(factura => factura.id !== id));
    toast({
      title: "Factura eliminada",
      description: "La factura se ha eliminado correctamente.",
      variant: "destructive",
    });
  };

  const marcarComoPagada = (id: string) => {
    setFacturas(facturas.map(factura => 
      factura.id === id 
        ? { ...factura, estado: 'pagada' as const }
        : factura
    ));
    toast({
      title: "Factura marcada como pagada",
      description: "El estado de la factura se ha actualizado correctamente.",
    });
  };

  const imprimirFactura = (factura: Factura) => {
    const cliente = mockClientes.find(c => c.id === factura.clienteId);
    
    const printContent = `
      <html>
        <head>
          <title>Factura ${factura.numero}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-info { margin-bottom: 30px; }
            .client-info { margin-bottom: 30px; }
            .invoice-details { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .totals { text-align: right; margin-top: 20px; }
            .total-line { margin: 5px 0; }
            .final-total { font-weight: bold; font-size: 1.2em; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ALLWAYS ENERGY</h1>
            <h2>FACTURA</h2>
          </div>
          
          <div class="company-info">
            <strong>Allways Energy</strong><br>
            Dirección de la empresa<br>
            Ciudad, CP<br>
            Teléfono: XXX XXX XXX<br>
            Email: info@allwaysenergy.com
          </div>
          
          <div class="client-info">
            <strong>Cliente:</strong><br>
            ${cliente?.nombre}<br>
            ${cliente?.direccion}<br>
            ${cliente?.localidad}, ${cliente?.codigoPostal}<br>
            ${cliente?.provincia}<br>
            NIF: ${cliente?.nif}
          </div>
          
          <div class="invoice-details">
            <strong>Número de Factura:</strong> ${factura.numero}<br>
            <strong>Fecha:</strong> ${new Date(factura.fecha).toLocaleDateString('es-ES')}<br>
            <strong>Estado:</strong> ${factura.estado}
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${factura.items.map(item => `
                <tr>
                  <td>${item.descripcion}</td>
                  <td>${item.cantidad}</td>
                  <td>${item.precio.toFixed(2)} €</td>
                  <td>${item.total.toFixed(2)} €</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="total-line">Subtotal: ${factura.subtotal.toFixed(2)} €</div>
            <div class="total-line">IVA (21%): ${factura.iva.toFixed(2)} €</div>
            <div class="total-line final-total">Total: ${factura.total.toFixed(2)} €</div>
          </div>
          
          ${factura.observaciones ? `
            <div style="margin-top: 30px;">
              <strong>Observaciones:</strong><br>
              ${factura.observaciones}
            </div>
          ` : ''}
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const subtotal = calculateSubtotal(formData.items);
  const iva = calculateIva(subtotal);
  const total = calculateTotal(subtotal, iva);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Facturas</h1>
          <p className="text-muted-foreground mt-2">
            Administra todas las facturas de Allways Energy
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="energy" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Factura
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingFactura ? 'Editar Factura' : 'Nueva Factura'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Label htmlFor="presupuestoId">Presupuesto (opcional)</Label>
                  <Select
                    value={formData.presupuestoId}
                    onValueChange={(value) => setFormData({...formData, presupuestoId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar presupuesto" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPresupuestos.filter(p => p.clienteId === formData.clienteId).map((presupuesto) => (
                        <SelectItem key={presupuesto.id} value={presupuesto.id}>
                          {presupuesto.numero}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número de Factura *</Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => setFormData({...formData, numero: e.target.value})}
                    placeholder="FAC-001"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-semibold">Items de la Factura</Label>
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
                  {editingFactura ? 'Actualizar' : 'Crear'} Factura
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
          <CardTitle>Lista de Facturas ({filteredFacturas.length})</CardTitle>
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
                {filteredFacturas.map((factura) => {
                  const cliente = mockClientes.find(c => c.id === factura.clienteId);
                  return (
                    <TableRow key={factura.id}>
                      <TableCell className="font-medium">{factura.numero}</TableCell>
                      <TableCell>{cliente?.nombre}</TableCell>
                      <TableCell>{new Date(factura.fecha).toLocaleDateString('es-ES')}</TableCell>
                      <TableCell>{factura.total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</TableCell>
                      <TableCell>
                        <Badge variant={factura.estado === 'pendiente' ? 'destructive' : 'default'}>
                          {factura.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(factura)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => imprimirFactura(factura)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          {factura.estado === 'pendiente' && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => marcarComoPagada(factura.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(factura.id)}
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