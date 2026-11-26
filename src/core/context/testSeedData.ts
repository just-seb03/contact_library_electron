import type { CalendarEvent, Client, Payment } from './types';

/**
 * Cambia esta bandera a `false` para desactivar al instante todos los datos de prueba.
 * Los registros de prueba nunca se guardan en SQLite ni en localStorage.
 */
export const ENABLE_TEST_DATA = true;

const TEST_CLIENT_ID_MIN = 900000;
const TEST_ID_PREFIX = 'test-';

const SHORT_MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function offsetDate(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function formatISODate(days: number): string {
  const d = offsetDate(days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatHearingDate(days: number, timeStr: string): string {
  const d = offsetDate(days);
  return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}, ${d.getFullYear()} - ${timeStr}`;
}

export const TEST_CLIENTS: Client[] = [
  {
    id: 900001,
    name: 'Camila Valenzuela Soto',
    phone: '+56 9 8412 3390',
    email: 'c.valenzuela@correo.cl',
    rut: '16.482.910-3',
    status: 'activo',
    caso: {
      expediente: 'C-1420-2026',
      juzgado: '4° Juzgado Civil de Santiago',
      materia: 'Civil — Incumplimiento de contrato',
      estado: 'En tramitación',
      proximaAudiencia: formatHearingDate(0, '11:00'),
    },
    pago: {
      monto: 450000,
      concepto: 'Honorarios etapa probatoria',
      fecha: formatISODate(-3),
      estado: 'pending',
    },
  },
  {
    id: 900002,
    name: 'Rodrigo Fuentes Paredes',
    phone: '+56 9 7105 8821',
    email: 'rfuentes@empresasur.cl',
    rut: '12.904.115-K',
    status: 'en_proceso',
    caso: {
      expediente: 'T-388-2026',
      juzgado: '1° Juzgado de Letras del Trabajo',
      materia: 'Laboral — Despido injustificado',
      estado: 'Audiencia de juicio',
      proximaAudiencia: formatHearingDate(1, '09:30'),
    },
    pago: {
      monto: 620000,
      concepto: 'Provisión inicial y demanda',
      fecha: formatISODate(-12),
      estado: 'completed',
    },
  },
  {
    id: 900003,
    name: 'María José Arancibia',
    phone: '+56 9 6234 1109',
    email: 'mjarancibia@gmail.com',
    rut: '18.210.442-7',
    status: 'activo',
    caso: {
      expediente: 'F-912-2026',
      juzgado: '2° Juzgado de Familia de Providencia',
      materia: 'Familia — Relación directa y regular',
      estado: 'Mediación cerrada',
      proximaAudiencia: formatHearingDate(3, '10:00'),
    },
    pago: {
      monto: 280000,
      concepto: 'Cuota mensual representación',
      fecha: formatISODate(-8),
      estado: 'overdue',
    },
  },
  {
    id: 900004,
    name: 'Inversiones Altamira SpA',
    phone: '+56 2 2480 9900',
    email: 'legal@altamira.cl',
    rut: '76.512.890-4',
    status: 'en_proceso',
    caso: {
      expediente: 'C-2890-2026',
      juzgado: '12° Juzgado Civil de Santiago',
      materia: 'Comercial — Cobro de pagaré',
      estado: 'Notificación en curso',
      proximaAudiencia: formatHearingDate(5, '12:15'),
    },
    pago: {
      monto: 1250000,
      concepto: 'Retainer corporativo mensual',
      fecha: formatISODate(-1),
      estado: 'completed',
    },
  },
  {
    id: 900005,
    name: 'Felipe Muñoz Carrasco',
    phone: '+56 9 9301 4472',
    email: 'fmunoz.c@outlook.com',
    rut: '15.773.208-1',
    status: 'completado',
    caso: {
      expediente: 'P-504-2025',
      juzgado: 'Juzgado de Garantía de Ñuñoa',
      materia: 'Penal — Querella por estafa',
      estado: 'Acuerdo reparatorio aprobado',
    },
    pago: {
      monto: 890000,
      concepto: 'Honorarios cierre de causa',
      fecha: formatISODate(-20),
      estado: 'completed',
    },
  },
  {
    id: 900006,
    name: 'Valentina Riquelme Díaz',
    phone: '+56 9 5518 7734',
    email: 'v.riquelme@estudio.cl',
    rut: '19.340.661-5',
    status: 'activo',
    caso: {
      expediente: 'C-411-2026',
      juzgado: '23° Juzgado Civil de Santiago',
      materia: 'Arrendamiento — Término de contrato',
      estado: 'Audiencia única fijada',
      proximaAudiencia: formatHearingDate(2, '15:00'),
    },
    pago: {
      monto: 340000,
      concepto: 'Presentación de demanda',
      fecha: formatISODate(-5),
      estado: 'pending',
    },
  },
  {
    id: 900007,
    name: 'Constructora Cordillera Ltda.',
    phone: '+56 2 2719 3040',
    email: 'administracion@cordillera.cl',
    rut: '77.108.334-9',
    status: 'en_proceso',
    caso: {
      expediente: 'O-112-2026',
      juzgado: '2° Juzgado de Letras del Trabajo',
      materia: 'Laboral — Tutela de derechos',
      estado: 'Contestación presentada',
    },
    pago: {
      monto: 780000,
      concepto: 'Defensa laboral primera instancia',
      fecha: formatISODate(-14),
      estado: 'overdue',
    },
  },
  {
    id: 900008,
    name: 'Ignacio Tapia Sepúlveda',
    phone: '+56 9 4092 6158',
    email: 'itapia@gmail.com',
    rut: '14.619.823-0',
    status: 'completado',
    caso: {
      expediente: 'V-209-2026',
      juzgado: '7° Juzgado Civil de Santiago',
      materia: 'Voluntario — Posesión efectiva',
      estado: 'Resolución ejecutoriada',
    },
  },
];

export const TEST_PAYMENTS: Payment[] = [
  {
    id: 'test-pay-01',
    client: 'Camila Valenzuela Soto',
    clientId: 900001,
    concept: 'Honorarios etapa probatoria',
    amount: 450000,
    date: formatISODate(-3),
    status: 'pending',
  },
  {
    id: 'test-pay-02',
    client: 'Rodrigo Fuentes Paredes',
    clientId: 900002,
    concept: 'Provisión inicial y demanda',
    amount: 620000,
    date: formatISODate(-12),
    status: 'completed',
  },
  {
    id: 'test-pay-03',
    client: 'María José Arancibia',
    clientId: 900003,
    concept: 'Cuota mensual representación',
    amount: 280000,
    date: formatISODate(-8),
    status: 'overdue',
  },
  {
    id: 'test-pay-04',
    client: 'Inversiones Altamira SpA',
    clientId: 900004,
    concept: 'Retainer corporativo mensual',
    amount: 1250000,
    date: formatISODate(-1),
    status: 'completed',
  },
  {
    id: 'test-pay-05',
    client: 'Felipe Muñoz Carrasco',
    clientId: 900005,
    concept: 'Honorarios cierre de causa',
    amount: 890000,
    date: formatISODate(-20),
    status: 'completed',
  },
  {
    id: 'test-pay-06',
    client: 'Valentina Riquelme Díaz',
    clientId: 900006,
    concept: 'Presentación de demanda',
    amount: 340000,
    date: formatISODate(-5),
    status: 'pending',
  },
  {
    id: 'test-pay-07',
    client: 'Constructora Cordillera Ltda.',
    clientId: 900007,
    concept: 'Defensa laboral primera instancia',
    amount: 780000,
    date: formatISODate(-14),
    status: 'overdue',
  },
  {
    id: 'test-pay-08',
    client: 'Inversiones Altamira SpA',
    clientId: 900004,
    concept: 'Gastos notariales y receptor judicial',
    amount: 145000,
    date: formatISODate(0),
    status: 'pending',
  },
  {
    id: 'test-pay-09',
    client: 'Ignacio Tapia Sepúlveda',
    clientId: 900008,
    concept: 'Tramitación posesión efectiva',
    amount: 390000,
    date: formatISODate(-18),
    status: 'completed',
  },
  {
    id: 'test-pay-10',
    client: 'Camila Valenzuela Soto',
    clientId: 900001,
    concept: 'Consulta inicial y estudio de antecedentes',
    amount: 95000,
    date: formatISODate(-25),
    status: 'completed',
  },
];

export const TEST_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'test-evt-01',
    title: 'Revisión de prueba documental',
    date: formatISODate(0),
    startTime: '09:00',
    endTime: '10:15',
    colorId: 'blue',
    alarmMinutes: 15,
    clientId: 900001,
    details: 'Preparar minuta de objeción de documentos antes de la audiencia.',
  },
  {
    id: 'test-evt-02',
    title: 'Reunión con gerente legal Altamira',
    date: formatISODate(0),
    startTime: '13:30',
    endTime: '14:30',
    colorId: 'lavender',
    alarmMinutes: 30,
    clientId: 900004,
    details: 'Revisar estrategia de cobro de pagarés vencidos.',
  },
  {
    id: 'test-evt-03',
    title: 'Llamada de seguimiento — Arancibia',
    date: formatISODate(0),
    startTime: '16:00',
    endTime: '16:45',
    colorId: 'rose',
    alarmMinutes: 15,
    clientId: 900003,
    details: 'Confirmar asistencia de testigos y actualización de antecedentes.',
  },
  {
    id: 'test-evt-04',
    title: 'Preparación alegatos laborales',
    date: formatISODate(1),
    startTime: '11:30',
    endTime: '13:00',
    colorId: 'mint',
    alarmMinutes: 30,
    clientId: 900002,
    details: 'Ordenar pliego de posiciones y cálculo de indemnizaciones.',
  },
  {
    id: 'test-evt-05',
    title: 'Firma de escritura en notaría',
    date: formatISODate(1),
    startTime: '15:30',
    endTime: '16:30',
    colorId: 'peach',
    alarmMinutes: 60,
    clientId: 900008,
    details: 'Notaría Huérfanos 940, llevar copias autorizadas.',
  },
  {
    id: 'test-evt-06',
    title: 'Redacción contestación tutela',
    date: formatISODate(2),
    startTime: '09:30',
    endTime: '11:30',
    colorId: 'lavender',
    alarmMinutes: 15,
    clientId: 900007,
    details: 'Revisar correos internos y reglamento interno adjunto.',
  },
  {
    id: 'test-evt-07',
    title: 'Coordinación con receptor judicial',
    date: formatISODate(3),
    startTime: '12:00',
    endTime: '12:45',
    colorId: 'blue',
    alarmMinutes: 15,
    clientId: 900006,
    details: 'Verificar certificación de notificación personal subsidiaria.',
  },
  {
    id: 'test-evt-08',
    title: 'Cierre contable mensual del estudio',
    date: formatISODate(4),
    startTime: '17:00',
    endTime: '18:00',
    colorId: 'mint',
    alarmMinutes: 0,
    clientId: null,
    details: 'Conciliar boletas emitidas, pagos pendientes y vencidos.',
  },
  {
    id: 'test-evt-09',
    title: 'Control de plazos procesales',
    date: formatISODate(-1),
    startTime: '10:00',
    endTime: '11:00',
    colorId: 'peach',
    alarmMinutes: 15,
    clientId: 900001,
    details: 'Revisión semanal de causas activas en Oficina Judicial Virtual.',
  },
];

export function isTestClient(client: Client): boolean {
  return client.id >= TEST_CLIENT_ID_MIN;
}

export function isTestPayment(payment: Payment): boolean {
  return payment.id.startsWith(TEST_ID_PREFIX);
}

export function isTestCalendarEvent(event: CalendarEvent): boolean {
  return event.id.startsWith(TEST_ID_PREFIX);
}

export function mergeTestItems<T>(
  baseItems: T[],
  testItems: T[],
  getId: (item: T) => string | number
): T[] {
  if (!ENABLE_TEST_DATA) return baseItems;
  const existingIds = new Set(baseItems.map(getId));
  return [...baseItems, ...testItems.filter((item) => !existingIds.has(getId(item)))];
}
