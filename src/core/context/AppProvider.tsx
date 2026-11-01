import React, { useState, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import { loadCalendarEvents, saveCalendarEvents } from './calendarEventStorage';
import { AppContext } from './useApp';
import type {
  AppContextType,
  CalendarEvent,
  Client,
  ClientDocument,
  ClientPaymentInfo,
  HearingEvent,
  Payment,
} from './types';
import {
  loadClients,
  loadRegisteredPayments,
  saveClients,
  saveRegisteredPayments,
} from './appStorage';
import { parseHearing } from './hearingUtils';
import {
  DEFAULT_SETTINGS,
  MAC_ACCENT_COLORS,
  type AppSettings,
} from '../../features/settings/data/settingsData';
import { databaseService } from '../database/databaseService';

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
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('contact_library_settings');
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('contact_library_settings', JSON.stringify(settings));
    } catch {
      // fallback
    }
    const selected = MAC_ACCENT_COLORS.find((c) => c.id === settings.accentColor) ?? MAC_ACCENT_COLORS[0];
    const hex = selected.hex;
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const rgb = `${r}, ${g}, ${b}`;

    const root = document.documentElement;
    root.style.setProperty('--macos-accent-color', hex);
    root.style.setProperty('--macos-accent-color-rgb', rgb);
    root.style.setProperty('--macos-accent-tint', `rgba(${rgb}, 0.12)`);
    root.style.setProperty('--macos-accent-tint-subtle', `rgba(${rgb}, 0.08)`);
    root.style.setProperty('--macos-accent-tint-status', `rgba(${rgb}, 0.15)`);
    root.style.setProperty('--macos-accent-tint-hover', `rgba(${rgb}, 0.18)`);
    root.style.setProperty('--macos-accent-tint-active', `rgba(${rgb}, 0.26)`);
    root.style.setProperty('--f7-theme-color', hex);
    root.style.setProperty('--f7-theme-color-rgb', rgb);
    root.style.setProperty('--f7-theme-color-shade', hex);
    root.style.setProperty('--f7-toggle-active-color', hex);
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  useEffect(() => {
    try {
      localStorage.setItem('contact_library_dark_mode', String(darkMode));
    } catch {
      // fallback
    }
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
      root.style.setProperty('--f7-page-bg-color', '#1e1e20');
      root.style.setProperty('--f7-card-bg-color', 'rgba(38, 38, 42, 0.85)');
      root.style.setProperty('--macos-canvas-bg', '#1e1e20');
      root.style.setProperty('--macos-card-bg', 'rgba(38, 38, 42, 0.85)');
      root.style.setProperty('--macos-modal-bg', '#242426');
      root.style.setProperty('--macos-input-bg', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--macos-text', '#ffffff');
      root.style.setProperty('--macos-text-secondary', '#8e8e93');
      root.style.setProperty('--macos-card-border', 'rgba(255, 255, 255, 0.08)');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      root.style.setProperty('--f7-page-bg-color', '#f5f5f7');
      root.style.setProperty('--f7-card-bg-color', '#ffffff');
      root.style.setProperty('--macos-canvas-bg', '#f5f5f7');
      root.style.setProperty('--macos-card-bg', '#ffffff');
      root.style.setProperty('--macos-modal-bg', '#ffffff');
      root.style.setProperty('--macos-input-bg', '#ffffff');
      root.style.setProperty('--macos-text', '#1c1c1e');
      root.style.setProperty('--macos-text-secondary', '#8e8e93');
      root.style.setProperty('--macos-card-border', 'rgba(0, 0, 0, 0.08)');
      root.style.colorScheme = 'light';
    }
  }, [darkMode]);

  // Carga inicial sincronizada desde SQLite al iniciar en Electron
  useEffect(() => {
    let isMounted = true;

    async function loadFromSqlite() {
      if (!databaseService.isElectronDbAvailable()) return;

      try {
        const [dbClients, dbPayments, dbCalendar, dbSettings] = await Promise.all([
          databaseService.getClients(),
          databaseService.getPayments(),
          databaseService.getCalendarEvents(),
          databaseService.getSettings(),
        ]);

        if (!isMounted) return;

        if (dbClients && dbClients.length > 0) {
          setClients(dbClients);
        }
        if (dbPayments && dbPayments.length > 0) {
          setRegisteredPayments(dbPayments);
        }
        if (dbCalendar && dbCalendar.length > 0) {
          setCalendarEvents(dbCalendar);
        }
        if (dbSettings && Object.keys(dbSettings).length > 0) {
          setSettings((prev) => ({ ...prev, ...(dbSettings as unknown as Partial<AppSettings>) }));
        }
      } catch (err) {
        console.error('Error al sincronizar datos iniciales desde SQLite:', err);
      }
    }

    loadFromSqlite();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    saveCalendarEvents(calendarEvents);
    databaseService.saveCalendarEvents(calendarEvents);
  }, [calendarEvents]);

  useEffect(() => {
    saveClients(clients);
    databaseService.saveAllClients(clients);
  }, [clients]);

  useEffect(() => {
    saveRegisteredPayments(registeredPayments);
    databaseService.savePayments(registeredPayments);
  }, [registeredPayments]);

  useEffect(() => {
    databaseService.saveSettings(settings as unknown as Record<string, unknown>);
  }, [settings]);

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
    settings,
    updateSetting,
    updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
