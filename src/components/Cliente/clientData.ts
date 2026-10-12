import { Client } from './types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: 1,
    name: 'El manzano',
    phone: '+56 9 8765 4321',
    email: 'contacto@elmanzano.cl',
    status: 'activo',
    caso: {
      expediente: 'EXP-2026-042',
      juzgado: '1° Juzgado Civil de Santiago',
      materia: 'Asesoría Mensual Corporativa',
      estado: 'Contrato vigente al día',
      proximaAudiencia: '28 Oct, 2026 - 10:00 AM',
    },
    pago: {
      monto: 450000,
      concepto: 'Asesoría Mensual',
      fecha: '10 Oct, 2026',
      estado: 'completed',
    },
  },
  {
    id: 2,
    name: 'Sebastian Bastian',
    phone: '+56 9 9123 4567',
    email: 'sebastian.bastian@empresa.com',
    status: 'en_proceso',
    caso: {
      expediente: 'EXP-2026-118',
      juzgado: '2° Juzgado de Letras del Trabajo',
      materia: 'Desarrollo de Módulo y Propiedad Intelectual',
      estado: 'Revisión de entregables y cobro pendiente',
      proximaAudiencia: '14 Oct, 2026 - 11:30 AM',
    },
    pago: {
      monto: 1200000,
      concepto: 'Desarrollo de Modulo',
      fecha: '14 Oct, 2026',
      estado: 'pending',
    },
  },
  {
    id: 3,
    name: 'MaxiMaxi',
    phone: '+56 9 6543 2109',
    email: 'administracion@maximaxi.com',
    status: 'en_proceso',
    caso: {
      expediente: 'EXP-2026-077',
      juzgado: 'Juzgado de Cobranza Judicial',
      materia: 'Mantenimiento de Agenda y Soporte Legal',
      estado: 'Notificación de cobro vencido',
      proximaAudiencia: '05 Nov, 2026 - 09:30 AM',
    },
    pago: {
      monto: 300000,
      concepto: 'Mantenimiento de Agenda',
      fecha: '05 Oct, 2026',
      estado: 'overdue',
    },
  },
  {
    id: 4,
    name: 'No se guardo',
    phone: '+56 9 7890 1234',
    email: 'sin_registro@consultorio.cl',
    status: 'completado',
    caso: {
      expediente: 'EXP-2026-009',
      juzgado: 'Juzgado de Policía Local',
      materia: 'Consulta Individual de Urgencia',
      estado: 'Consulta finalizada con éxito',
    },
    pago: {
      monto: 80000,
      concepto: 'Consulta Individual',
      fecha: '11 Oct, 2026',
      estado: 'completed',
    },
  },
];
