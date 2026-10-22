import type { Client, ClientPaymentInfo } from '../../features/clients/types';
import type { Payment } from '../../features/payments/types';

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
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  setSelectedClientId: (id: number | null) => void;
  updateClient: (id: number, data: Partial<Client>) => void;
  updatePaymentStatus: (clientIdOrPaymentId: string | number, status: 'completed' | 'pending' | 'overdue') => void;
  updateClientPayment: (clientId: number, pago: ClientPaymentInfo) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
}
