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
  resolveAccentTokens,
  type AppSettings,
} from '../../features/settings/data/settingsData';
import { databaseService } from '../database/databaseService';
import { getThemeTokens, themeTokensToCssVars } from '../theme/themes';
import type { NavigationTarget } from '../../shared/types/navigation';

/** Si ninguna página consume el foco en este tiempo (elemento borrado, etc.), se descarta. */
const NAVIGATION_FOCUS_TTL_MS = 5000;

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(loadClients);
  const [registeredPayments, setRegisteredPayments] = useState<Payment[]>(
    () => loadRegisteredPayments(clients)
  );
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(loadCalendarEvents);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [navigationFocus, setNavigationFocus] = useState<NavigationTarget | null>(null);
  /** Tablas de SQLite ya leídas al arrancar; hasta entonces no se escribe en ellas. */
  const [dbHydrated, setDbHydrated] = useState({
    clients: false,
    payments: false,
    calendar: false,
    settings: false,
  });

  useEffect(() => {
    if (!navigationFocus) return;
    const timer = setTimeout(() => setNavigationFocus(null), NAVIGATION_FOCUS_TTL_MS);
    return () => clearTimeout(timer);
  }, [navigationFocus]);
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
    const { cssVars } = resolveAccentTokens(settings.accentColor, darkMode);
    const root = document.documentElement;
    for (const [key, value] of Object.entries(cssVars)) {
      root.style.setProperty(key, value);
    }
  }, [settings, darkMode]);

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
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    const tokens = getThemeTokens(settings.themeId, darkMode);
    const cssVars = themeTokensToCssVars(tokens);
    for (const [key, value] of Object.entries(cssVars)) {
      root.style.setProperty(key, value);
    }
    try {
      localStorage.setItem(
        'contact_library_boot_palette',
        JSON.stringify({
          canvas: tokens.canvasBg,
          card: tokens.cardBg,
          sidebar: tokens.sidebarGlass,
          input: tokens.inputBg,
          text: tokens.text,
        })
      );
    } catch {
      // fallback
    }
    root.style.colorScheme = darkMode ? 'dark' : 'light';
    window.electronAPI?.setTheme?.({
      isDark: darkMode,
      backgroundColor: tokens.canvasBg,
    });
  }, [darkMode, settings.themeId]);

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

        // Solo se habilita la escritura de las tablas que se pudieron leer (null = error de lectura).
        // Si SQLite está vacío pero localStorage tiene datos, el siguiente guardado los migra a SQLite.
        setDbHydrated({
          clients: dbClients !== null,
          payments: dbPayments !== null,
          calendar: dbCalendar !== null,
          settings: dbSettings !== null,
        });

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

  // Los guardados en SQLite esperan a que termine la carga inicial de cada tabla.
  // Sin esto, el primer render guardaba el estado inicial (localStorage, posiblemente vacío)
  // y `saveAll` reemplazaba la tabla completa antes de haberla leído.
  useEffect(() => {
    saveCalendarEvents(calendarEvents);
    if (dbHydrated.calendar) databaseService.saveCalendarEvents(calendarEvents);
  }, [calendarEvents, dbHydrated.calendar]);

  useEffect(() => {
    saveClients(clients);
    if (dbHydrated.clients) databaseService.saveAllClients(clients);
  }, [clients, dbHydrated.clients]);

  useEffect(() => {
    saveRegisteredPayments(registeredPayments);
    if (dbHydrated.payments) databaseService.savePayments(registeredPayments);
  }, [registeredPayments, dbHydrated.payments]);

  useEffect(() => {
    if (dbHydrated.settings) {
      databaseService.saveSettings(settings as unknown as Record<string, unknown>);
    }
  }, [settings, dbHydrated.settings]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Cliente actualmente seleccionado (null si no hay ninguno elegido)
  const selectedClient = useMemo(() => {
    if (selectedClientId === null) return null;
    return clients.find((c) => c.id === selectedClientId) ?? null;
  }, [clients, selectedClientId]);

  // Lista de pagos: pagos registrados + el pago asociado a cada cliente (`client.pago`).
  // Con SQLite, `client.pago` es el último pago de la tabla `payments`, es decir, uno que ya
  // está en `registeredPayments`: se omite para no mostrarlo duplicado.
  const payments: Payment[] = useMemo(
    () => {
      const isRegistered = (clientId: number, pago: ClientPaymentInfo) =>
        registeredPayments.some((payment) => (
          payment.clientId === clientId &&
          payment.concept === pago.concepto &&
          payment.amount === pago.monto &&
          payment.date === pago.fecha
        ));

      return [
        ...clients
          .filter((client) => client.pago !== undefined && !isRegistered(client.id, client.pago))
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
      ];
    },
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
    navigationFocus,
    setNavigationFocus,
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
