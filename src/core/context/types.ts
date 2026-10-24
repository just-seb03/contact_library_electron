import type { Client, ClientDocument, ClientPaymentInfo } from '../../features/clients/types';
import type { Payment } from '../../features/payments/types';
import type { CalendarEvent } from '../../features/calendar/types';

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
}
