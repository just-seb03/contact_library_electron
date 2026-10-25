export type ClientStatus = 'activo' | 'en_proceso' | 'completado';

export interface ClientCase {
  expediente: string;
  juzgado: string;
  materia: string;
  estado: string;
  proximaAudiencia?: string;
}

export interface ClientPaymentInfo {
  monto: number;
  concepto: string;
  fecha: string;
  estado: 'completed' | 'pending' | 'overdue';
}

export interface ClientDocument {
  id: string;
  name: string;
  dataUrl: string;
  size: number;
  uploadedAt: string;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  email?: string;
  rut?: string;
  status?: ClientStatus;
  caso?: ClientCase;
  pago?: ClientPaymentInfo;
  documentos?: ClientDocument[];
}

export interface Payment {
  id: string;
  client: string;
  clientId?: number;
  concept: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'overdue';
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  colorId: CalendarEventColorId;
  alarmMinutes: number;
  clientId: number | null;
  details: string;
}

export type CalendarEventColorId =
  | 'lavender'
  | 'blue'
  | 'mint'
  | 'peach'
  | 'rose';

export interface HearingEvent {
  id: string;
  clientId: number;
  clientName: string;
  expediente: string;
  materia: string;
  juzgado: string;
  dateStr: string;
  day: number;
  monthIndex: number;
  year: number;
  timeStr: string;
}

import type { AppSettings } from '../../features/settings/data/settingsData';

export type AppTab = 'inicio' | 'calendar' | 'cliente' | 'pagos' | 'config';

export interface AppContextType {
  clients: Client[];
  selectedClientId: number | null;
  selectedClient: Client | null;
  payments: Payment[];
  hearings: HearingEvent[];
  calendarEvents: CalendarEvent[];
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  setSelectedClientId: (id: number | null) => void;
  updateClient: (id: number, data: Partial<Client>) => void;
  updatePaymentStatus: (clientIdOrPaymentId: string | number, status: 'completed' | 'pending' | 'overdue') => void;
  updatePayment: (payment: Payment, data: Omit<Payment, 'id' | 'client' | 'clientId'>) => void;
  deletePayment: (payment: Payment) => void;
  addClientDocument: (clientId: number, document: ClientDocument) => void;
  deleteClientDocument: (clientId: number, documentId: string) => void;
  updateClientPayment: (clientId: number, pago: ClientPaymentInfo) => void;
  registerPayment: (payment: Omit<Payment, 'id'>) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  deleteClient: (id: number) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (event: CalendarEvent) => void;
  removeCalendarEvent: (id: string) => CalendarEvent | undefined;
  restoreCalendarEvent: (event: CalendarEvent) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

