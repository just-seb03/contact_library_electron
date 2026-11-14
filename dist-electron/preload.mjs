"use strict";
const electron = require("electron");
const IPC_CHANNELS = {
  // Clientes
  CLIENTS_LIST: "clients:list",
  CLIENTS_GET_BY_ID: "clients:getById",
  CLIENTS_CREATE: "clients:create",
  CLIENTS_UPDATE: "clients:update",
  CLIENTS_DELETE: "clients:delete",
  CLIENTS_SAVE_ALL: "clients:saveAll",
  // Casos judiciales
  CASES_GET_BY_CLIENT_ID: "cases:getByClientId",
  CASES_UPSERT: "cases:upsert",
  // Documentos
  DOCUMENTS_GET_BY_CLIENT_ID: "documents:getByClientId",
  DOCUMENTS_UPLOAD: "documents:upload",
  DOCUMENTS_DELETE: "documents:delete",
  DOCUMENTS_OPEN: "documents:open",
  DOCUMENTS_SHOW_IN_FINDER: "documents:showInFinder",
  // Pagos
  PAYMENTS_LIST: "payments:list",
  PAYMENTS_SAVE_ALL: "payments:saveAll",
  // Calendario
  CALENDAR_LIST: "calendar:list",
  CALENDAR_SAVE_ALL: "calendar:saveAll",
  // Configuración
  SETTINGS_GET: "settings:get",
  SETTINGS_SAVE_ALL: "settings:saveAll",
  // Ventana y Sistema
  WINDOW_MINIMIZE: "window:minimize",
  WINDOW_MAXIMIZE: "window:maximize",
  WINDOW_CLOSE: "window:close",
  APP_GET_PLATFORM: "app:getPlatform"
};
const electronAPI = {
  // Controles de ventana
  minimize: () => {
    electron.ipcRenderer.send(IPC_CHANNELS.WINDOW_MINIMIZE);
  },
  maximize: () => {
    electron.ipcRenderer.send(IPC_CHANNELS.WINDOW_MAXIMIZE);
  },
  close: () => {
    electron.ipcRenderer.send(IPC_CHANNELS.WINDOW_CLOSE);
  },
  getPlatform: async () => {
    const res = await electron.ipcRenderer.invoke(IPC_CHANNELS.APP_GET_PLATFORM);
    return res.data ?? process.platform;
  },
  // Namespace: Ventana
  window: {
    minimize: () => {
      electron.ipcRenderer.send(IPC_CHANNELS.WINDOW_MINIMIZE);
    },
    maximize: () => {
      electron.ipcRenderer.send(IPC_CHANNELS.WINDOW_MAXIMIZE);
    },
    close: () => {
      electron.ipcRenderer.send(IPC_CHANNELS.WINDOW_CLOSE);
    },
    getPlatform: () => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.APP_GET_PLATFORM);
    }
  },
  // Namespace: Clientes
  clients: {
    list: (filters) => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_LIST, filters);
    },
    getById: (id) => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_GET_BY_ID, id);
    },
    create: (client) => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_CREATE, client);
    },
    update: (id, data) => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_UPDATE, id, data);
    },
    delete: (id) => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_DELETE, id);
    },
    saveAll: (clients) => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_SAVE_ALL, clients);
    }
  },
  // Namespace: Casos Judiciales
  cases: {
    getByClientId: (clientId) => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.CASES_GET_BY_CLIENT_ID, clientId);
    },
    upsert: (clientId, data) => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.CASES_UPSERT, clientId, data);
    }
  },
  // Namespace: Documentos
  documents: {
    getByClientId: (clientId) => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS_GET_BY_CLIENT_ID, clientId);
    },
    upload: (dto) => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS_UPLOAD, dto);
    },
    delete: (id) => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS_DELETE, id);
    },
    open: (param) => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS_OPEN, param);
    },
    showInFinder: (id) => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS_SHOW_IN_FINDER, id);
    }
  },
  // Namespace: Pagos
  payments: {
    list: () => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.PAYMENTS_LIST);
    },
    saveAll: (payments) => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.PAYMENTS_SAVE_ALL, payments);
    }
  },
  // Namespace: Calendario
  calendar: {
    list: () => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.CALENDAR_LIST);
    },
    saveAll: (events) => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.CALENDAR_SAVE_ALL, events);
    }
  },
  // Namespace: Configuración
  settings: {
    get: () => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET);
    },
    saveAll: (settings) => {
      return electron.ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SAVE_ALL, settings);
    }
  },
  // Namespace: Base de Datos (Compatibilidad de transición con databaseService)
  db: {
    getClients: async () => {
      const res = await electron.ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_LIST);
      if (!res.success) throw new Error(res.error ?? "Error al obtener clientes");
      return res.data ?? [];
    },
    createClient: async (client) => {
      const res = await electron.ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_CREATE, client);
      if (!res.success || !res.data) throw new Error(res.error ?? "Error al crear cliente");
      return res.data;
    },
    updateClient: async (id, data) => {
      const res = await electron.ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_UPDATE, id, data);
      if (!res.success || !res.data) throw new Error(res.error ?? "Error al actualizar cliente");
      return res.data;
    },
    deleteClient: async (id) => {
      const res = await electron.ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_DELETE, id);
      if (!res.success) throw new Error(res.error ?? "Error al eliminar cliente");
      return res.data ?? true;
    },
    saveAllClients: async (clients) => {
      const res = await electron.ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_SAVE_ALL, clients);
      if (!res.success) throw new Error(res.error ?? "Error al guardar clientes");
      return res.data ?? true;
    },
    getPayments: async () => {
      const res = await electron.ipcRenderer.invoke(IPC_CHANNELS.PAYMENTS_LIST);
      if (!res.success) throw new Error(res.error ?? "Error al obtener pagos");
      return res.data ?? [];
    },
    savePayments: async (payments) => {
      const res = await electron.ipcRenderer.invoke(IPC_CHANNELS.PAYMENTS_SAVE_ALL, payments);
      if (!res.success) throw new Error(res.error ?? "Error al guardar pagos");
      return res.data ?? true;
    },
    getCalendarEvents: async () => {
      const res = await electron.ipcRenderer.invoke(IPC_CHANNELS.CALENDAR_LIST);
      if (!res.success) throw new Error(res.error ?? "Error al obtener eventos de calendario");
      return res.data ?? [];
    },
    saveCalendarEvents: async (events) => {
      const res = await electron.ipcRenderer.invoke(IPC_CHANNELS.CALENDAR_SAVE_ALL, events);
      if (!res.success) throw new Error(res.error ?? "Error al guardar eventos de calendario");
      return res.data ?? true;
    },
    getSettings: async () => {
      const res = await electron.ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET);
      if (!res.success) throw new Error(res.error ?? "Error al obtener configuraciones");
      return res.data ?? {};
    },
    saveSettings: async (settings) => {
      const res = await electron.ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SAVE_ALL, settings);
      if (!res.success) throw new Error(res.error ?? "Error al guardar configuraciones");
      return res.data ?? true;
    }
  }
};
electron.contextBridge.exposeInMainWorld("electronAPI", electronAPI);
