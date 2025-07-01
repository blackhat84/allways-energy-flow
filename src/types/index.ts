export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  nif: string;
  localidad: string;
  provincia: string;
  codigoPostal: string;
  contacto: string;
  observaciones: string;
  fechaCreacion: Date;
}

export interface ItemPresupuesto {
  id: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  total: number;
}

export interface Presupuesto {
  id: string;
  clienteId: string;
  cliente?: Cliente;
  numero: string;
  fecha: Date;
  items: ItemPresupuesto[];
  subtotal: number;
  iva: number;
  total: number;
  estado: 'pendiente' | 'convertido';
  observaciones: string;
}

export interface Factura {
  id: string;
  clienteId: string;
  cliente?: Cliente;
  presupuestoId?: string;
  numero: string;
  fecha: Date;
  items: ItemPresupuesto[];
  subtotal: number;
  iva: number;
  total: number;
  estado: 'pendiente' | 'pagada';
  observaciones: string;
}

export interface Evento {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  clienteId?: string;
  cliente?: Cliente;
  descripcion: string;
  tipo: 'reunion' | 'instalacion' | 'mantenimiento' | 'otro';
}

export interface Usuario {
  id: string;
  username: string;
  email: string;
  nombre: string;
  isAuthenticated: boolean;
}