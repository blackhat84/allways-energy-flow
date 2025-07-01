import { Cliente, Presupuesto, Factura, Evento } from '@/types';

export const mockClientes: Cliente[] = [
  {
    id: '1',
    nombre: 'Juan Pérez García',
    telefono: '+34 612 345 678',
    email: 'juan.perez@email.com',
    direccion: 'Calle Mayor, 123',
    nif: '12345678A',
    localidad: 'Madrid',
    provincia: 'Madrid',
    codigoPostal: '28001',
    contacto: 'Juan Pérez',
    observaciones: 'Cliente interesado en instalación solar',
    fechaCreacion: new Date('2024-01-15')
  },
  {
    id: '2',
    nombre: 'María López Fernández',
    telefono: '+34 623 456 789',
    email: 'maria.lopez@email.com',
    direccion: 'Avenida de la Paz, 45',
    nif: '87654321B',
    localidad: 'Barcelona',
    provincia: 'Barcelona',
    codigoPostal: '08001',
    contacto: 'María López',
    observaciones: 'Empresa mediana, necesita estudio energético',
    fechaCreacion: new Date('2024-02-10')
  },
  {
    id: '3',
    nombre: 'Sistemas Energéticos SL',
    telefono: '+34 634 567 890',
    email: 'info@sistemasenerg.com',
    direccion: 'Polígono Industrial, Nave 12',
    nif: 'B12345678',
    localidad: 'Valencia',
    provincia: 'Valencia',
    codigoPostal: '46001',
    contacto: 'Carlos Ruiz',
    observaciones: 'Cliente corporativo, instalaciones de gran tamaño',
    fechaCreacion: new Date('2024-01-20')
  }
];

export const mockPresupuestos: Presupuesto[] = [
  {
    id: '1',
    clienteId: '1',
    numero: 'PRES-2024-001',
    fecha: new Date('2024-03-01'),
    items: [
      {
        id: '1',
        descripcion: 'Panel Solar 450W Monocristalino',
        cantidad: 12,
        precio: 250,
        total: 3000
      },
      {
        id: '2',
        descripcion: 'Inversor String 5kW',
        cantidad: 1,
        precio: 800,
        total: 800
      },
      {
        id: '3',
        descripcion: 'Instalación y mano de obra',
        cantidad: 1,
        precio: 1200,
        total: 1200
      }
    ],
    subtotal: 5000,
    iva: 1050,
    total: 6050,
    estado: 'pendiente',
    observaciones: 'Instalación en tejado sur, óptima orientación'
  },
  {
    id: '2',
    clienteId: '2',
    numero: 'PRES-2024-002',
    fecha: new Date('2024-03-05'),
    items: [
      {
        id: '1',
        descripcion: 'Panel Solar 540W Bifacial',
        cantidad: 20,
        precio: 320,
        total: 6400
      },
      {
        id: '2',
        descripcion: 'Inversor Central 10kW',
        cantidad: 1,
        precio: 1500,
        total: 1500
      },
      {
        id: '3',
        descripcion: 'Sistema de monitorización',
        cantidad: 1,
        precio: 500,
        total: 500
      }
    ],
    subtotal: 8400,
    iva: 1764,
    total: 10164,
    estado: 'convertido',
    observaciones: 'Instalación industrial con sistema de monitorización avanzado'
  }
];

export const mockFacturas: Factura[] = [
  {
    id: '1',
    clienteId: '2',
    presupuestoId: '2',
    numero: 'FACT-2024-001',
    fecha: new Date('2024-03-15'),
    items: [
      {
        id: '1',
        descripcion: 'Panel Solar 540W Bifacial',
        cantidad: 20,
        precio: 320,
        total: 6400
      },
      {
        id: '2',
        descripcion: 'Inversor Central 10kW',
        cantidad: 1,
        precio: 1500,
        total: 1500
      },
      {
        id: '3',
        descripcion: 'Sistema de monitorización',
        cantidad: 1,
        precio: 500,
        total: 500
      }
    ],
    subtotal: 8400,
    iva: 1764,
    total: 10164,
    estado: 'pagada',
    observaciones: 'Factura generada desde presupuesto PRES-2024-002'
  }
];

export const mockEventos: Evento[] = [
  {
    id: '1',
    title: 'Visita técnica - Juan Pérez',
    start: new Date('2024-07-05T10:00:00'),
    end: new Date('2024-07-05T12:00:00'),
    clienteId: '1',
    descripcion: 'Evaluación del tejado para instalación solar',
    tipo: 'reunion'
  },
  {
    id: '2',
    title: 'Instalación - María López',
    start: new Date('2024-07-08T08:00:00'),
    end: new Date('2024-07-08T17:00:00'),
    clienteId: '2',
    descripcion: 'Instalación completa del sistema fotovoltaico',
    tipo: 'instalacion'
  },
  {
    id: '3',
    title: 'Mantenimiento - Sistemas Energéticos',
    start: new Date('2024-07-12T09:00:00'),
    end: new Date('2024-07-12T11:00:00'),
    clienteId: '3',
    descripcion: 'Revisión anual del sistema',
    tipo: 'mantenimiento'
  }
];