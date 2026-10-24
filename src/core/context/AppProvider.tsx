import React, { useState, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Client, ClientCase, ClientDocument, ClientPaymentInfo } from '../../features/clients/types';
import type { Payment } from '../../features/payments/types';
import { MOCK_CLIENTS } from '../../features/clients/data/clientData';
import { loadCalendarEvents, saveCalendarEvents } from '../../features/calendar/data/calendarEventStorage';
import { AppContext } from './useApp';
import type { AppContextType, HearingEvent } from './types';
import type { CalendarEvent } from '../../features/calendar/types';

const MONTH_MAP: Record<string, number> = {
  ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
  jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
};

const CLIENTS_STORAGE_KEY = 'contact_library_clients';
const REGISTERED_PAYMENTS_STORAGE_KEY = 'contact_library_registered_payments';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isClientCase(value: unknown): value is ClientCase {
  if (!isRecord(value)) return false;
  return typeof value.expediente === 'string'
    && typeof value.juzgado === 'string'
    && typeof value.materia === 'string'
    && typeof value.estado === 'string'
    && (value.proximaAudiencia === undefined || typeof value.proximaAudiencia === 'string');
}

function isClientPayment(value: unknown): value is ClientPaymentInfo {
  if (!isRecord(value)) return false;
  return typeof value.monto === 'number'
    && typeof value.concepto === 'string'
    && typeof value.fecha === 'string'
    && ['completed', 'pending', 'overdue'].includes(String(value.estado));
}

function isClientDocument(value: unknown): value is ClientDocument {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string'
    && typeof value.name === 'string'
    && typeof value.dataUrl === 'string'
    && typeof value.size === 'number'
    && typeof value.uploadedAt === 'string';
}

function isClient(value: unknown): value is Client {
  if (!isRecord(value)) return false;
  const client = value;
  const validStatus = client.status === undefined
    || (
      typeof client.status === 'string'
      && ['activo', 'en_proceso', 'completado'].includes(client.status)
    );

  return Number.isSafeInteger(client.id)
    && typeof client.name === 'string'
    && typeof client.phone === 'string'
    && (client.email === undefined || typeof client.email === 'string')
    && (client.rut === undefined || typeof client.rut === 'string')
    && validStatus
    && (client.caso === undefined || isClientCase(client.caso))
    && (client.pago === undefined || isClientPayment(client.pago))
    && (client.documentos === undefined
      || (Array.isArray(client.documentos) && client.documentos.every(isClientDocument)));
}

function loadClients(): Client[] {
  try {
    const stored = localStorage.getItem(CLIENTS_STORAGE_KEY);
    if (!stored) return MOCK_CLIENTS;
    const parsed: unknown = JSON.parse(stored);
    if (
      !Array.isArray(parsed)
      || !parsed.every(isClient)
      || new Set(parsed.map((client) => client.id)).size !== parsed.length
    ) {
      throw new Error('Los datos guardados de clientes no son válidos.');
    }
    return parsed;
  } catch (error) {
    console.error('No se pudieron cargar los clientes guardados.', error);
    return MOCK_CLIENTS;
  }
}

function loadRegisteredPayments(clients: Client[]): Payment[] {
  try {
    const stored = localStorage.getItem(REGISTERED_PAYMENTS_STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error('El contenido guardado no es una lista.');
    const validPayments = parsed.filter(
      (payment): payment is Payment =>
        typeof payment?.id === 'string' &&
        typeof payment?.client === 'string' &&
        (payment?.clientId === undefined || Number.isSafeInteger(payment.clientId)) &&
        typeof payment?.concept === 'string' &&
        typeof payment?.amount === 'number' &&
        typeof payment?.date === 'string' &&
        ['completed', 'pending', 'overdue'].includes(payment?.status)
    );
    const linkedPayments = validPayments.filter((payment) => (
      payment.clientId !== undefined
        ? clients.some((client) => client.id === payment.clientId)
        : clients.some((client) => client.name === payment.client)
    ));
    if (linkedPayments.length !== validPayments.length) {
      console.info('Se eliminaron pagos registrados que no pertenecen a ningún cliente.');
    }
    return linkedPayments;
  } catch (error) {
    console.error('No se pudieron cargar los pagos registrados.', error);
    return [];
  }
}

function parseHearing(client: Client): HearingEvent | null {
  if (!client.caso?.proximaAudiencia) return null;
  const raw = client.caso.proximaAudiencia;
  const match = raw.match(/(\d{1,2})\s+([A-Za-z]{3}),\s+(\d{4})\s*-\s*(.+)/);
  if (!match) return null;

  const day = parseInt(match[1], 10);
  const monthKey = match[2].toLowerCase();
  const monthIndex = MONTH_MAP[monthKey] ?? 9;
  const year = parseInt(match[3], 10);
  const timeStr = match[4].trim();

  return {
    id: `hearing-${client.id}`,
    clientId: client.id,
    clientName: client.name,
    expediente: client.caso.expediente,
    materia: client.caso.materia,
    juzgado: client.caso.juzgado,
    dateStr: raw,
    day,
    monthIndex,
    year,
    timeStr,
  };
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(loadClients);
  const [registeredPayments, setRegisteredPayments] = useState<Payment[]>(
    () => loadRegisteredPayments(clients)
  );
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(loadCalendarEvents);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<AppContextType['activeTab']>('inicio');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('contact_library_dark_mode') === 'true';
  });

  useEffect(() => {
    try {
      localStorage.setItem('contact_library_dark_mode', String(darkMode));
    } catch {
      // fallback
    }
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    saveCalendarEvents(calendarEvents);
  }, [calendarEvents]);

  useEffect(() => {
    try {
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
    } catch (error) {
      console.error('No se pudieron guardar los clientes.', error);
    }
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem(REGISTERED_PAYMENTS_STORAGE_KEY, JSON.stringify(registeredPayments));
    } catch (error) {
      console.error('No se pudieron guardar los pagos registrados.', error);
    }
  }, [registeredPayments]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Cliente actualmente seleccionado (null si no hay ninguno elegido)
  const selectedClient = useMemo(() => {
    if (selectedClientId === null) return null;
    return clients.find((c) => c.id === selectedClientId) ?? null;
  }, [clients, selectedClientId]);

  // Lista de pagos sincronizada de forma reactiva a partir de la fuente de clientes
  const payments: Payment[] = useMemo(
    () => [
      ...clients
        .filter((client) => client.pago !== undefined)
        .map((client) => ({
          id: String(client.id),
          client: client.name,
          clientId: client.id,
          concept: client.pago!.concepto,
          amount: client.pago!.monto,
          date: client.pago!.fecha,
          status: client.pago!.estado,
        })),
      ...registeredPayments,
    ],
    [clients, registeredPayments]
  );

  // Audiencias programadas derivadas directamente de los casos de los clientes
  const hearings: HearingEvent[] = useMemo(() => {
    return clients
      .map((c) => parseHearing(c))
      .filter((h): h is HearingEvent => h !== null);
  }, [clients]);

  // Actualizar datos de un cliente
  const updateClient = (id: number, data: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
  };

  // Cambiar estado de pago (sincroniza Pagos y Clientes)
  const updatePaymentStatus = (
    clientIdOrPaymentId: string | number,
    status: 'completed' | 'pending' | 'overdue'
  ) => {
    const paymentId = String(clientIdOrPaymentId);
    setRegisteredPayments((previous) =>
      previous.map((payment) => (payment.id === paymentId ? { ...payment, status } : payment))
    );
    const idNum = Number(clientIdOrPaymentId);
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === idNum && c.pago) {
          return {
            ...c,
            pago: {
              ...c.pago,
              estado: status,
            },
          };
        }
        return c;
      })
    );
  };

  // Modificar información del cobro de un cliente
  const updateClientPayment = (clientId: number, pago: ClientPaymentInfo) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, pago } : c))
    );
  };

  const updatePayment = (
    payment: Payment,
    data: Omit<Payment, 'id' | 'client' | 'clientId'>
  ) => {
    setRegisteredPayments((previous) => previous.map((item) => (
      item.id === payment.id ? { ...item, ...data } : item
    )));
    const clientId = payment.clientId ?? Number(payment.id);
    setClients((previous) => previous.map((client) => (
      client.id === clientId && client.pago
        ? {
            ...client,
            pago: {
              ...client.pago,
              monto: data.amount,
              concepto: data.concept,
              fecha: data.date,
              estado: data.status,
            },
          }
        : client
    )));
  };

  const deletePayment = (payment: Payment) => {
    setRegisteredPayments((previous) => previous.filter((item) => item.id !== payment.id));
    const clientId = payment.clientId ?? Number(payment.id);
    setClients((previous) => previous.map((client) => (
      client.id === clientId && client.pago
        ? { ...client, pago: undefined }
        : client
    )));
  };

  const addClientDocument = (clientId: number, document: ClientDocument) => {
    setClients((previous) => previous.map((client) => (
      client.id === clientId
        ? { ...client, documentos: [...(client.documentos ?? []), document] }
        : client
    )));
  };

  const deleteClientDocument = (clientId: number, documentId: string) => {
    setClients((previous) => previous.map((client) => (
      client.id === clientId
        ? { ...client, documentos: (client.documentos ?? []).filter((document) => document.id !== documentId) }
        : client
    )));
  };

  const registerPayment = (payment: Omit<Payment, 'id'>) => {
    setRegisteredPayments((previous) => [
      ...previous,
      {
        ...payment,
        id: `payment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      },
    ]);
  };

  // Agregar nuevo cliente
  const addClient = (newClientData: Omit<Client, 'id'>) => {
    setClients((prev) => {
      const nextId = prev.length > 0 ? Math.max(...prev.map((c) => c.id)) + 1 : 1;
      const created: Client = { ...newClientData, id: nextId };
      return [...prev, created];
    });
  };

  const deleteClient = (id: number) => {
    const deletedClient = clients.find((client) => client.id === id);
    if (!deletedClient) return;

    setClients((previous) => previous.filter((client) => client.id !== id));
    setRegisteredPayments((previous) => previous.filter((payment) => (
      payment.clientId !== id
      && (payment.clientId !== undefined || payment.client !== deletedClient.name)
    )));
    setCalendarEvents((previous) => previous.map((event) => (
      event.clientId === id ? { ...event, clientId: null } : event
    )));
    setSelectedClientId((previous) => (previous === id ? null : previous));
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    setCalendarEvents((prev) => [
      ...prev,
      { ...event, id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` },
    ]);
  };

  const updateCalendarEvent = (event: CalendarEvent) => {
    setCalendarEvents((prev) => prev.map((item) => (item.id === event.id ? event : item)));
  };

  const removeCalendarEvent = (id: string) => {
    const removed = calendarEvents.find((event) => event.id === id);
    if (removed) {
      setCalendarEvents((prev) => prev.filter((event) => event.id !== id));
    }
    return removed;
  };

  const restoreCalendarEvent = (event: CalendarEvent) => {
    setCalendarEvents((prev) => (
      prev.some((item) => item.id === event.id) ? prev : [...prev, event]
    ));
  };

  const value: AppContextType = {
    clients,
    selectedClientId,
    selectedClient,
    payments,
    hearings,
    calendarEvents,
    activeTab,
    setActiveTab,
    setSelectedClientId,
    updateClient,
    updatePaymentStatus,
    updateClientPayment,
    updatePayment,
    deletePayment,
    addClientDocument,
    deleteClientDocument,
    registerPayment,
    addClient,
    deleteClient,
    addCalendarEvent,
    updateCalendarEvent,
    removeCalendarEvent,
    restoreCalendarEvent,
    darkMode,
    setDarkMode,
    toggleDarkMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
