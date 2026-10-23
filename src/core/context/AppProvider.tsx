import React, { useState, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Client, ClientPaymentInfo } from '../../features/clients/types';
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
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
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

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Cliente actualmente seleccionado (null si no hay ninguno elegido)
  const selectedClient = useMemo(() => {
    if (selectedClientId === null) return null;
    return clients.find((c) => c.id === selectedClientId) ?? null;
  }, [clients, selectedClientId]);

  // Lista de pagos sincronizada de forma reactiva a partir de la fuente de clientes
  const payments: Payment[] = useMemo(() => {
    return clients
      .filter((c) => c.pago !== undefined)
      .map((c) => ({
        id: String(c.id),
        client: c.name,
        concept: c.pago!.concepto,
        amount: c.pago!.monto,
        date: c.pago!.fecha,
        status: c.pago!.estado,
      }));
  }, [clients]);

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

  // Agregar nuevo cliente
  const addClient = (newClientData: Omit<Client, 'id'>) => {
    setClients((prev) => {
      const nextId = prev.length > 0 ? Math.max(...prev.map((c) => c.id)) + 1 : 1;
      const created: Client = { ...newClientData, id: nextId };
      return [...prev, created];
    });
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    setCalendarEvents((prev) => [
      ...prev,
      { ...event, id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` },
    ]);
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
    addClient,
    addCalendarEvent,
    darkMode,
    setDarkMode,
    toggleDarkMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
