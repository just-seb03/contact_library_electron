import { app, ipcMain, shell, BrowserWindow, Menu } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import sqlite3 from "sqlite3";
const rgba = (rgb, alpha) => `rgba(${rgb}, ${alpha})`;
const rgbToHex = (rgb) => `#${rgb.split(",").map((channel) => Number(channel.trim()).toString(16).padStart(2, "0")).join("")}`;
const APP_COLOR_RGB = {
  primary: "0, 122, 255",
  success: "52, 199, 89",
  warning: "255, 149, 0",
  danger: "255, 59, 48",
  neutral: "142, 142, 147"
};
const BLACK_RGB = "0, 0, 0";
const WHITE_RGB = "255, 255, 255";
const SURFACE_RGB = "245, 245, 247";
const APP_COLORS = {
  white: "#ffffff",
  black: "#000000",
  background: "#f5f5f7",
  surfaceMuted: "#f9f9fb",
  controlBackground: "#f2f2f7",
  sidebarText: "#1c1c1e",
  bodyText: "#3c3c43",
  secondaryText: "#8e8e93",
  border: "#d1d1d6",
  borderSubtle: "#e5e5ea",
  borderDanger: "#ffccc7",
  selection: "#e5e5ea",
  dangerSurface: "#fff1f0",
  iconMuted: "#c7c7cc",
  // Overlays y bordes translúcidos
  cardBorder: rgba(BLACK_RGB, 0.05),
  glassBorder: rgba(BLACK_RGB, 0.06),
  glassSurface: rgba(SURFACE_RGB, 0.65),
  whiteOverlay: rgba(WHITE_RGB, 0.2),
  whiteTextMuted: rgba(WHITE_RGB, 0.9),
  whiteTextFaint: rgba(WHITE_RGB, 0.6),
  // Tints derivados de APP_COLOR_RGB
  primaryTint: "var(--macos-accent-tint-subtle, rgba(0, 122, 255, 0.08))",
  primaryStatusTint: "var(--macos-accent-tint-status, rgba(0, 122, 255, 0.1))",
  neutralTint: rgba(APP_COLOR_RGB.neutral, 0.1),
  successTint: rgba(APP_COLOR_RGB.success, 0.1),
  warningTint: rgba(APP_COLOR_RGB.warning, 0.1),
  // Colores semánticos derivados del RGB base
  primary: "var(--macos-accent-color, #007aff)",
  success: rgbToHex(APP_COLOR_RGB.success),
  warning: rgbToHex(APP_COLOR_RGB.warning),
  danger: rgbToHex(APP_COLOR_RGB.danger),
  neutral: rgbToHex(APP_COLOR_RGB.neutral),
  // Variantes del primario
  primaryStrong: "var(--macos-accent-color, #0a84ff)",
  primaryLight: "var(--macos-accent-color, #30b0ff)"
};
const FRAMEWORK_PAGE_VARIABLES = {
  "--f7-page-bg-color": "var(--macos-canvas-bg, #f5f5f7)",
  "--f7-bars-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-navbar-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-toolbar-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-card-bg-color": "transparent",
  "--f7-list-strong-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-list-bg-color": "var(--macos-card-bg, #ffffff)"
};
const buildCssVariables = () => {
  const variables = {
    "--f7-theme-color": APP_COLORS.primary,
    "--f7-theme-color-rgb": APP_COLOR_RGB.primary
  };
  for (const [name, value] of Object.entries(APP_COLORS)) {
    variables[`--app-color-${name}`] = value;
  }
  for (const [name, value] of Object.entries(APP_COLOR_RGB)) {
    variables[`--app-color-${name}-rgb`] = value;
  }
  const f7Aliases = {
    blue: "primary",
    green: "success",
    orange: "warning",
    red: "danger",
    gray: "neutral"
  };
  for (const [f7Name, appName] of Object.entries(f7Aliases)) {
    variables[`--f7-color-${f7Name}`] = `var(--app-color-${appName})`;
    variables[`--f7-color-${f7Name}-rgb`] = `var(--app-color-${appName}-rgb)`;
  }
  for (const [name, value] of Object.entries(FRAMEWORK_PAGE_VARIABLES)) {
    variables[name] = String(value);
  }
  return variables;
};
buildCssVariables();
const TABLES_SQL = `
CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  rut TEXT,
  status TEXT NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'en_proceso', 'completado')),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL UNIQUE,
  expediente TEXT NOT NULL,
  juzgado TEXT NOT NULL,
  materia TEXT NOT NULL,
  estado TEXT NOT NULL,
  proxima_audiencia TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  client_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  relative_path TEXT NOT NULL,
  size INTEGER NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'application/pdf',
  uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  client_id INTEGER,
  client_name TEXT NOT NULL,
  concept TEXT NOT NULL,
  amount REAL NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'overdue')),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  color_id TEXT NOT NULL DEFAULT 'blue',
  alarm_minutes INTEGER NOT NULL DEFAULT 15,
  client_id INTEGER,
  details TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_cases_client_id ON cases(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_calendar_date ON calendar_events(date);
CREATE INDEX IF NOT EXISTS idx_calendar_client_id ON calendar_events(client_id);
`;
const SEED_SQL = `
INSERT OR IGNORE INTO clients (id, name, phone, email, rut, status) VALUES
(1, 'El manzano', '+56 9 8765 4321', 'contacto@elmanzano.cl', '76.123.456-7', 'activo'),
(2, 'Sebastian Bastian', '+56 9 9123 4567', 'sebastian.bastian@empresa.com', '18.987.654-3', 'en_proceso'),
(3, 'MaxiMaxi', '+56 9 6543 2109', 'administracion@maximaxi.com', '77.890.123-k', 'en_proceso'),
(6, 'Carlos Mendoza', '+56 9 5555 2222', 'carlos.mendoza@legales.cl', '15.432.876-5', 'en_proceso');

INSERT OR IGNORE INTO cases (client_id, expediente, juzgado, materia, estado, proxima_audiencia) VALUES
(1, 'EXP-2026-042', '1° Juzgado Civil de Santiago', 'Asesoría Mensual Corporativa', 'Contrato vigente al día', '28 Oct, 2026 - 10:00 AM'),
(2, 'EXP-2026-118', '2° Juzgado de Letras del Trabajo', 'Desarrollo de Módulo y Propiedad Intelectual', 'Revisión de entregables y cobro pendiente', '14 Oct, 2026 - 11:30 AM'),
(3, 'EXP-2026-077', 'Juzgado de Cobranza Judicial', 'Mantenimiento de Agenda y Soporte Legal', 'Notificación de cobro vencido', '05 Nov, 2026 - 09:30 AM'),
(6, 'EXP-2026-155', '3° Juzgado Civil de Santiago', 'Revisión de contrato comercial', 'Pendiente de firma', '22 Oct, 2026 - 02:00 PM');

INSERT OR IGNORE INTO payments (id, client_id, client_name, concept, amount, date, status) VALUES
('pay-seed-1', 1, 'El manzano', 'Asesoría Mensual', 450000, '10 Oct, 2026', 'completed'),
('pay-seed-2', 2, 'Sebastian Bastian', 'Desarrollo de Modulo', 1200000, '14 Oct, 2026', 'pending'),
('pay-seed-3', 3, 'MaxiMaxi', 'Mantenimiento de Agenda', 300000, '05 Oct, 2026', 'overdue'),
('pay-seed-4', 6, 'Carlos Mendoza', 'Revisión Contractual', 600000, '22 Oct, 2026', 'pending');

INSERT OR IGNORE INTO calendar_events (id, title, date, start_time, end_time, color_id, alarm_minutes, client_id, details) VALUES
('cal-seed-1', 'Audiencia: El manzano', '2026-10-28', '10:00', '11:00', 'blue', 15, 1, '1° Juzgado Civil de Santiago - EXP-2026-042'),
('cal-seed-2', 'Audiencia: Sebastian Bastian', '2026-10-14', '11:30', '12:30', 'mint', 30, 2, '2° Juzgado de Letras del Trabajo - EXP-2026-118'),
('cal-seed-3', 'Audiencia: MaxiMaxi', '2026-11-05', '09:30', '10:30', 'rose', 60, 3, 'Juzgado de Cobranza Judicial - EXP-2026-077'),
('cal-seed-4', 'Audiencia: Carlos Mendoza', '2026-10-22', '14:00', '15:00', 'lavender', 15, 6, '3° Juzgado Civil de Santiago - EXP-2026-155');

INSERT OR IGNORE INTO settings (key, value) VALUES
('hearingAlerts', 'true'),
('paymentReminders', 'true'),
('soundEffects', 'true'),
('accentColor', '"blue"'),
('lawyerName', '"Sebastián Contreras"'),
('lawyerEmail', '"s.contreras@estudiojuridico.cl"'),
('lawyerFirm', '"Contreras & Asociados • Derecho Civil y Litigios"');
`;
async function runDatabaseMigrations(db) {
  const versionRow = await db.prepare("PRAGMA user_version;").get();
  const currentVersion = (versionRow == null ? void 0 : versionRow.user_version) ?? 0;
  if (currentVersion === 0) {
    console.log("[SQLite Migrator] Detectada base de datos sin versión (versión 0). Verificando esquema...");
    const tableCheck = await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='clients'").get();
    if (tableCheck) {
      const columns = await db.prepare("PRAGMA table_info(clients)").all();
      const hasOldCasoColumn = columns.some((col) => col.name === "caso");
      if (hasOldCasoColumn) {
        console.log("[SQLite Migrator] Migrando base de datos antigua (con columnas JSON) al esquema normalizado v1...");
        await db.transaction(async () => {
          const oldClients = await db.prepare("SELECT * FROM clients").all();
          await db.exec(TABLES_SQL);
          await db.exec(`
            CREATE TABLE IF NOT EXISTS clients_new (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              phone TEXT NOT NULL,
              email TEXT,
              rut TEXT,
              status TEXT NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'en_proceso', 'completado')),
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
          `);
          for (const oldClient of oldClients) {
            await db.prepare(`
              INSERT INTO clients_new (id, name, phone, email, rut, status)
              VALUES (?, ?, ?, ?, ?, ?)
            `).run(
              oldClient.id,
              oldClient.name,
              oldClient.phone,
              oldClient.email || null,
              oldClient.rut || null,
              oldClient.status || "activo"
            );
            if (oldClient.caso) {
              try {
                const casoObj = JSON.parse(oldClient.caso);
                if (casoObj && typeof casoObj === "object") {
                  await db.prepare(`
                    INSERT OR REPLACE INTO cases (client_id, expediente, juzgado, materia, estado, proxima_audiencia)
                    VALUES (?, ?, ?, ?, ?, ?)
                  `).run(
                    oldClient.id,
                    casoObj.expediente || "Sin Expediente",
                    casoObj.juzgado || "Sin Juzgado",
                    casoObj.materia || "General",
                    casoObj.estado || "Activo",
                    casoObj.proximaAudiencia || null
                  );
                }
              } catch {
              }
            }
            if (oldClient.documentos) {
              try {
                const docs = JSON.parse(oldClient.documentos);
                if (Array.isArray(docs)) {
                  for (const doc of docs) {
                    if (doc && doc.name) {
                      await db.prepare(`
                        INSERT OR IGNORE INTO documents (id, client_id, name, file_name, relative_path, size, mime_type, uploaded_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                      `).run(
                        doc.id || `migrated-${Date.now()}-${Math.random()}`,
                        oldClient.id,
                        doc.name,
                        doc.name,
                        `${oldClient.id}/${doc.name}`,
                        Number(doc.size) || 0,
                        "application/pdf",
                        doc.uploadedAt || (/* @__PURE__ */ new Date()).toISOString()
                      );
                    }
                  }
                }
              } catch {
              }
            }
          }
          await db.exec("DROP TABLE clients;");
          await db.exec("ALTER TABLE clients_new RENAME TO clients;");
          await db.exec(TABLES_SQL);
          await db.pragma("user_version = 1");
        });
        console.log("[SQLite Migrator] Migración a v1 completada exitosamente.");
        return;
      }
    }
    console.log("[SQLite Migrator] Creando base de datos inicial v1...");
    await db.exec(TABLES_SQL);
    const clientCount = await db.prepare("SELECT count(*) as count FROM clients").get();
    if (!clientCount || clientCount.count === 0) {
      console.log("[SQLite Migrator] Población inicial con seed data...");
      await db.exec(SEED_SQL);
    }
    await db.pragma("user_version = 1");
    console.log("[SQLite Migrator] Esquema inicial v1 aplicado con éxito.");
  }
}
let dbInstance = null;
function getDatabasePath() {
  var _a;
  try {
    const userDataPath = ((_a = app) == null ? void 0 : _a.getPath) ? app.getPath("userData") : process.cwd();
    return path.join(userDataPath, "contact_library.db");
  } catch {
    return path.join(process.cwd(), "contact_library.db");
  }
}
function getDocumentsStoragePath() {
  var _a;
  try {
    const userDataPath = ((_a = app) == null ? void 0 : _a.getPath) ? app.getPath("userData") : process.cwd();
    const docsPath = path.join(userDataPath, "documents");
    if (!fs.existsSync(docsPath)) {
      fs.mkdirSync(docsPath, { recursive: true });
    }
    return docsPath;
  } catch {
    const docsPath = path.join(process.cwd(), "storage", "documents");
    if (!fs.existsSync(docsPath)) {
      fs.mkdirSync(docsPath, { recursive: true });
    }
    return docsPath;
  }
}
function normalizeParams(args) {
  return args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
}
function openDatabase(targetPath) {
  return new Promise((resolve, reject) => {
    const database = new sqlite3.Database(targetPath, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(database);
      }
    });
  });
}
function createWrapper(rawDb) {
  let transactionTail = Promise.resolve();
  const exec = (sql) => new Promise((resolve, reject) => {
    rawDb.exec(sql, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
  return {
    prepare(sql) {
      return {
        all(...args) {
          const params = normalizeParams(args);
          return new Promise((resolve, reject) => {
            const statement = rawDb.prepare(sql, (prepareError) => {
              if (prepareError) {
                reject(prepareError);
                return;
              }
              statement.all(params, (error, rows) => {
                statement.finalize((finalizeError) => {
                  if (error || finalizeError) {
                    reject(error || finalizeError);
                  } else {
                    resolve(rows);
                  }
                });
              });
            });
          });
        },
        get(...args) {
          const params = normalizeParams(args);
          return new Promise((resolve, reject) => {
            const statement = rawDb.prepare(sql, (prepareError) => {
              if (prepareError) {
                reject(prepareError);
                return;
              }
              statement.get(params, (error, row) => {
                statement.finalize((finalizeError) => {
                  if (error || finalizeError) {
                    reject(error || finalizeError);
                  } else {
                    resolve(row);
                  }
                });
              });
            });
          });
        },
        run(...args) {
          const params = normalizeParams(args);
          return new Promise((resolve, reject) => {
            const statement = rawDb.prepare(sql, (prepareError) => {
              if (prepareError) {
                reject(prepareError);
                return;
              }
              statement.run(params, function(error) {
                statement.finalize((finalizeError) => {
                  if (error || finalizeError) {
                    reject(error || finalizeError);
                  } else {
                    resolve({ lastInsertRowid: this.lastID, changes: this.changes });
                  }
                });
              });
            });
          });
        }
      };
    },
    exec,
    pragma(sql) {
      return exec(`PRAGMA ${sql};`);
    },
    async transaction(fn) {
      let releaseTransaction;
      const previousTransaction = transactionTail;
      transactionTail = new Promise((resolve) => {
        releaseTransaction = resolve;
      });
      await previousTransaction;
      try {
        await exec("BEGIN TRANSACTION;");
        const result = await fn();
        await exec("COMMIT;");
        return result;
      } catch (error) {
        try {
          await exec("ROLLBACK;");
        } catch (rollbackError) {
          console.error("[SQLite] Error revirtiendo transacción:", rollbackError);
        }
        throw error;
      } finally {
        releaseTransaction();
      }
    },
    close() {
      rawDb.close((error) => {
        if (error) {
          console.error("[SQLite] Error cerrando la base de datos:", error);
        }
      });
    }
  };
}
async function initDatabase(dbPath) {
  if (dbInstance) return dbInstance;
  const targetPath = getDatabasePath();
  const dbDir = path.dirname(targetPath);
  fs.mkdirSync(dbDir, { recursive: true });
  const rawDb = await openDatabase(targetPath);
  const wrapper = createWrapper(rawDb);
  try {
    await wrapper.pragma("foreign_keys = ON");
    await runDatabaseMigrations(wrapper);
  } catch (error) {
    wrapper.close();
    throw error;
  }
  console.log("[SQLite] Base de datos inicializada y conectada en:", targetPath);
  dbInstance = wrapper;
  return dbInstance;
}
function getDatabase() {
  if (!dbInstance) {
    throw new Error("[SQLite] La base de datos no ha sido inicializada. Asegúrate de llamar a initDatabase() primero.");
  }
  return dbInstance;
}
function closeDatabase() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
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
function createIpcSuccess(data) {
  return { success: true, data };
}
function createIpcError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return { success: false, error: message };
}
function parseCalendarRow(row) {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    startTime: row.startTime,
    endTime: row.endTime,
    colorId: row.colorId || "blue",
    alarmMinutes: row.alarmMinutes ?? 15,
    clientId: row.clientId ?? null,
    details: row.details || ""
  };
}
function registerCalendarController() {
  ipcMain.handle(
    IPC_CHANNELS.CALENDAR_LIST,
    async () => {
      try {
        const db = getDatabase();
        const rows = await db.prepare("SELECT * FROM calendar_events ORDER BY date ASC, startTime ASC").all();
        return createIpcSuccess(rows.map(parseCalendarRow));
      } catch (error) {
        return createIpcError(error);
      }
    }
  );
  ipcMain.handle(
    IPC_CHANNELS.CALENDAR_SAVE_ALL,
    async (_event, events) => {
      try {
        if (!Array.isArray(events)) {
          return createIpcError("Se esperaba una lista de eventos de calendario.");
        }
        const db = getDatabase();
        await db.transaction(async () => {
          await db.prepare("DELETE FROM calendar_events").run();
          const statement = db.prepare(`
            INSERT INTO calendar_events (id, title, date, startTime, endTime, colorId, alarmMinutes, clientId, details)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          for (const event of events) {
            await statement.run(
              event.id,
              event.title,
              event.date,
              event.startTime,
              event.endTime,
              event.colorId || "blue",
              event.alarmMinutes ?? 15,
              event.clientId || null,
              event.details || ""
            );
          }
        });
        return createIpcSuccess(true);
      } catch (error) {
        return createIpcError(error);
      }
    }
  );
  ipcMain.handle("db:calendar:getAll", async () => {
    const db = getDatabase();
    return db.prepare("SELECT * FROM calendar_events ORDER BY date ASC, startTime ASC").all();
  });
  ipcMain.handle("db:calendar:saveAll", async (_event, events) => {
    const db = getDatabase();
    await db.transaction(async () => {
      await db.prepare("DELETE FROM calendar_events").run();
      const statement = db.prepare(`
        INSERT INTO calendar_events (id, title, date, startTime, endTime, colorId, alarmMinutes, clientId, details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const event of events) {
        await statement.run(
          event.id,
          event.title,
          event.date,
          event.startTime,
          event.endTime,
          event.colorId || "blue",
          event.alarmMinutes ?? 15,
          event.clientId || null,
          event.details || ""
        );
      }
    });
    return true;
  });
}
class CaseRepository {
  toEntity(row) {
    return {
      id: row.id,
      clientId: row.client_id,
      expediente: row.expediente,
      juzgado: row.juzgado,
      materia: row.materia,
      estado: row.estado,
      proximaAudiencia: row.proxima_audiencia ?? void 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
  async getByClientId(clientId) {
    const db = getDatabase();
    const row = await db.prepare("SELECT * FROM cases WHERE client_id = ?").get(clientId);
    return row ? this.toEntity(row) : null;
  }
  async upsert(clientId, data) {
    const db = getDatabase();
    const existing = await this.getByClientId(clientId);
    if (existing) {
      await db.prepare(`
        UPDATE cases
        SET expediente = ?, juzgado = ?, materia = ?, estado = ?, proxima_audiencia = ?, updated_at = CURRENT_TIMESTAMP
        WHERE client_id = ?
      `).run(
        data.expediente,
        data.juzgado,
        data.materia,
        data.estado,
        data.proximaAudiencia ?? null,
        clientId
      );
    } else {
      await db.prepare(`
        INSERT INTO cases (client_id, expediente, juzgado, materia, estado, proxima_audiencia)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        clientId,
        data.expediente,
        data.juzgado,
        data.materia,
        data.estado,
        data.proximaAudiencia ?? null
      );
    }
    const updated = await this.getByClientId(clientId);
    if (!updated) {
      throw new Error(`Error al persistir expediente judicial para el cliente ${clientId}`);
    }
    return updated;
  }
  async updateStatus(clientId, estado) {
    const db = getDatabase();
    const res = await db.prepare(`
      UPDATE cases
      SET estado = ?, updated_at = CURRENT_TIMESTAMP
      WHERE client_id = ?
    `).run(estado, clientId);
    return res.changes > 0;
  }
  async deleteByClientId(clientId) {
    const db = getDatabase();
    const res = await db.prepare("DELETE FROM cases WHERE client_id = ?").run(clientId);
    return res.changes > 0;
  }
}
const caseRepository = new CaseRepository();
function sanitizeFileName(fileName) {
  return fileName.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").replace(/\s+/g, "_").trim();
}
const documentStorage = {
  getStorageDir() {
    return getDocumentsStoragePath();
  },
  getAbsolutePath(relativePath) {
    return path.join(this.getStorageDir(), relativePath);
  },
  async saveDocumentFile(clientId, originalName, fileBuffer) {
    const storageDir = this.getStorageDir();
    const clientDir = path.join(storageDir, String(clientId));
    if (!fs.existsSync(clientDir)) {
      await fs.promises.mkdir(clientDir, { recursive: true });
    }
    const safeName = sanitizeFileName(originalName) || "documento.pdf";
    const id = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fileName = `${id}_${safeName}`;
    const fullPath = path.join(clientDir, fileName);
    const relativePath = `${clientId}/${fileName}`;
    await fs.promises.writeFile(fullPath, fileBuffer);
    const stats = await fs.promises.stat(fullPath);
    return {
      id,
      clientId,
      name: originalName,
      fileName,
      relativePath,
      size: stats.size,
      mimeType: originalName.toLowerCase().endsWith(".pdf") ? "application/pdf" : "application/octet-stream",
      uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  },
  async deleteDocumentFile(relativePath) {
    try {
      const fullPath = this.getAbsolutePath(relativePath);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error("[DocumentStorage] Error al eliminar archivo físico:", error);
      return false;
    }
  },
  /**
   * Abre el documento con la aplicación predeterminada del sistema operativo.
   * En macOS abre Vista Previa (Preview).
   */
  async openDocumentWithSystem(relativePath) {
    try {
      const fullPath = this.getAbsolutePath(relativePath);
      if (!fs.existsSync(fullPath)) {
        return { success: false, error: "El archivo no existe en el disco." };
      }
      const errorMessage = await shell.openPath(fullPath);
      if (errorMessage) {
        return { success: false, error: errorMessage };
      }
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido al abrir documento";
      return { success: false, error: message };
    }
  },
  /**
   * Revela y resalta el archivo directamente en el Finder de macOS (o Explorador de archivos).
   */
  async showInFinder(relativePath) {
    try {
      const fullPath = this.getAbsolutePath(relativePath);
      if (fs.existsSync(fullPath)) {
        shell.showItemInFolder(fullPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error("[DocumentStorage] Error al mostrar archivo en Finder:", error);
      return false;
    }
  },
  /**
   * Lee el archivo y lo devuelve como dataUrl base64 si el visor web lo requiere.
   */
  async readAsBase64(relativePath) {
    try {
      const fullPath = this.getAbsolutePath(relativePath);
      if (!fs.existsSync(fullPath)) return null;
      const buffer = await fs.promises.readFile(fullPath);
      return `data:application/pdf;base64,${buffer.toString("base64")}`;
    } catch (error) {
      console.error("[DocumentStorage] Error al leer archivo en base64:", error);
      return null;
    }
  }
};
class DocumentRepository {
  toEntity(row) {
    return {
      id: row.id,
      clientId: row.client_id,
      name: row.name,
      fileName: row.file_name,
      relativePath: row.relative_path,
      size: row.size,
      mimeType: row.mime_type,
      uploadedAt: row.uploaded_at
    };
  }
  async getByClientId(clientId) {
    const db = getDatabase();
    const rows = await db.prepare("SELECT * FROM documents WHERE client_id = ? ORDER BY uploaded_at DESC").all(clientId);
    return rows.map((r) => this.toEntity(r));
  }
  async getById(id) {
    const db = getDatabase();
    const row = await db.prepare("SELECT * FROM documents WHERE id = ?").get(id);
    return row ? this.toEntity(row) : null;
  }
  /**
   * Guarda físicamente el archivo en disco (userData/documents/{clientId}) y registra sus metadatos en SQLite.
   * Si la inserción en la base de datos falla, elimina el archivo físico para evitar residuos.
   */
  async saveDocument(clientId, originalName, fileBuffer) {
    const db = getDatabase();
    const stored = await documentStorage.saveDocumentFile(clientId, originalName, fileBuffer);
    try {
      await db.prepare(`
        INSERT INTO documents (id, client_id, name, file_name, relative_path, size, mime_type, uploaded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        stored.id,
        clientId,
        stored.name,
        stored.fileName,
        stored.relativePath,
        stored.size,
        stored.mimeType,
        stored.uploadedAt
      );
      return {
        id: stored.id,
        clientId,
        name: stored.name,
        fileName: stored.fileName,
        relativePath: stored.relativePath,
        size: stored.size,
        mimeType: stored.mimeType,
        uploadedAt: stored.uploadedAt
      };
    } catch (dbError) {
      await documentStorage.deleteDocumentFile(stored.relativePath);
      throw dbError;
    }
  }
  /**
   * Registra metadata de un documento que ya fue guardado o importado físicamente
   */
  async registerDocumentMetadata(id, clientId, name, fileName, relativePath, size, mimeType = "application/pdf", uploadedAt = (/* @__PURE__ */ new Date()).toISOString()) {
    const db = getDatabase();
    await db.prepare(`
      INSERT OR REPLACE INTO documents (id, client_id, name, file_name, relative_path, size, mime_type, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, clientId, name, fileName, relativePath, size, mimeType, uploadedAt);
    return {
      id,
      clientId,
      name,
      fileName,
      relativePath,
      size,
      mimeType,
      uploadedAt
    };
  }
  /**
   * Elimina el documento de la base de datos y borra físicamente el archivo del disco.
   */
  async deleteDocument(id) {
    const db = getDatabase();
    const doc = await this.getById(id);
    if (!doc) return false;
    await db.prepare("DELETE FROM documents WHERE id = ?").run(id);
    await documentStorage.deleteDocumentFile(doc.relativePath);
    return true;
  }
  /**
   * Limpia todos los archivos físicos de un cliente en disco.
   * Utilizado cuando se elimina un cliente o su carpeta.
   */
  async cleanClientStorageFolder(clientId) {
    try {
      const storageDir = documentStorage.getStorageDir();
      const clientDir = path.join(storageDir, String(clientId));
      if (fs.existsSync(clientDir)) {
        await fs.promises.rm(clientDir, { recursive: true, force: true });
      }
    } catch (error) {
      console.error(`[DocumentRepository] Error al limpiar directorio del cliente ${clientId}:`, error);
    }
  }
  /**
   * Abre el archivo con Vista Previa (o la app predeterminada en macOS).
   */
  async openDocument(id) {
    const doc = await this.getById(id);
    if (!doc) {
      return { success: false, error: "Documento no encontrado" };
    }
    return documentStorage.openDocumentWithSystem(doc.relativePath);
  }
  /**
   * Revela el archivo en Finder.
   */
  async showInFinder(id) {
    const doc = await this.getById(id);
    if (!doc) return false;
    return documentStorage.showInFinder(doc.relativePath);
  }
  /**
   * Obtiene contenido en base64 para previsualización web.
   */
  async getBase64(id) {
    const doc = await this.getById(id);
    if (!doc) return null;
    return documentStorage.readAsBase64(doc.relativePath);
  }
}
const documentRepository = new DocumentRepository();
class ClientRepository {
  formatClient(clientRow, caseData, docs, paymentInfo) {
    return {
      id: clientRow.id,
      name: clientRow.name,
      phone: clientRow.phone,
      email: clientRow.email ?? void 0,
      rut: clientRow.rut ?? void 0,
      status: clientRow.status,
      caso: caseData ? {
        expediente: caseData.expediente,
        juzgado: caseData.juzgado,
        materia: caseData.materia,
        estado: caseData.estado,
        proximaAudiencia: caseData.proximaAudiencia
      } : void 0,
      documentos: (docs || []).map((doc) => ({
        id: doc.id,
        name: doc.name,
        dataUrl: "",
        size: doc.size,
        uploadedAt: doc.uploadedAt
      })),
      pago: paymentInfo ?? void 0
    };
  }
  async getAll(filters) {
    const db = getDatabase();
    const conditions = [];
    const params = [];
    if ((filters == null ? void 0 : filters.search) && filters.search.trim() !== "") {
      const term = `%${filters.search.trim().toLowerCase()}%`;
      conditions.push("(LOWER(name) LIKE ? OR LOWER(rut) LIKE ? OR phone LIKE ?)");
      params.push(term, term, term);
    }
    if (filters == null ? void 0 : filters.status) {
      conditions.push("status = ?");
      params.push(filters.status);
    }
    let query = "SELECT * FROM clients";
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }
    query += " ORDER BY id ASC";
    if (filters == null ? void 0 : filters.limit) {
      query += ` LIMIT ${Number(filters.limit)}`;
      if (filters == null ? void 0 : filters.offset) {
        query += ` OFFSET ${Number(filters.offset)}`;
      }
    }
    const clientRows = await db.prepare(query).all(...params);
    const clients = [];
    for (const row of clientRows) {
      const [caseData, docs, latestPayment] = await Promise.all([
        caseRepository.getByClientId(row.id),
        documentRepository.getByClientId(row.id),
        this.getLatestPaymentInfo(row.id)
      ]);
      clients.push(this.formatClient(row, caseData, docs, latestPayment));
    }
    return clients;
  }
  async getById(id) {
    const db = getDatabase();
    const clientRow = await db.prepare("SELECT * FROM clients WHERE id = ?").get(id);
    if (!clientRow) return null;
    const [caseData, docs, latestPayment] = await Promise.all([
      caseRepository.getByClientId(id),
      documentRepository.getByClientId(id),
      this.getLatestPaymentInfo(id)
    ]);
    return this.formatClient(clientRow, caseData, docs, latestPayment);
  }
  async create(data) {
    const db = getDatabase();
    return db.transaction(async () => {
      const info = await db.prepare(`
        INSERT INTO clients (name, phone, email, rut, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).run(
        data.name,
        data.phone,
        data.email || null,
        data.rut || null,
        data.status || "activo"
      );
      const clientId = Number(info.lastInsertRowid);
      let createdCase = null;
      if (data.caso) {
        createdCase = await caseRepository.upsert(clientId, {
          expediente: data.caso.expediente,
          juzgado: data.caso.juzgado,
          materia: data.caso.materia,
          estado: data.caso.estado,
          proximaAudiencia: data.caso.proximaAudiencia
        });
      }
      return {
        id: clientId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        rut: data.rut,
        status: data.status || "activo",
        caso: createdCase ? {
          expediente: createdCase.expediente,
          juzgado: createdCase.juzgado,
          materia: createdCase.materia,
          estado: createdCase.estado,
          proximaAudiencia: createdCase.proximaAudiencia
        } : void 0,
        documentos: []
      };
    });
  }
  async update(id, data) {
    const db = getDatabase();
    const existing = await db.prepare("SELECT * FROM clients WHERE id = ?").get(id);
    if (!existing) {
      throw new Error(`Cliente con id ${id} no encontrado`);
    }
    await db.transaction(async () => {
      const updatedName = data.name !== void 0 ? data.name : existing.name;
      const updatedPhone = data.phone !== void 0 ? data.phone : existing.phone;
      const updatedEmail = data.email !== void 0 ? data.email : existing.email;
      const updatedRut = data.rut !== void 0 ? data.rut : existing.rut;
      const updatedStatus = data.status !== void 0 ? data.status : existing.status;
      await db.prepare(`
        UPDATE clients
        SET name = ?, phone = ?, email = ?, rut = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        updatedName,
        updatedPhone,
        updatedEmail || null,
        updatedRut || null,
        updatedStatus,
        id
      );
      if (data.caso) {
        await caseRepository.upsert(id, {
          expediente: data.caso.expediente,
          juzgado: data.caso.juzgado,
          materia: data.caso.materia,
          estado: data.caso.estado,
          proximaAudiencia: data.caso.proximaAudiencia
        });
      }
    });
    const updated = await this.getById(id);
    if (!updated) {
      throw new Error(`Error al recuperar cliente actualizado con id ${id}`);
    }
    return updated;
  }
  async delete(id) {
    const db = getDatabase();
    await db.transaction(async () => {
      await db.prepare("DELETE FROM clients WHERE id = ?").run(id);
    });
    await documentRepository.cleanClientStorageFolder(id);
    return true;
  }
  async getLatestPaymentInfo(clientId) {
    const db = getDatabase();
    const paymentRow = await db.prepare("SELECT amount, concept, date, status FROM payments WHERE client_id = ? ORDER BY date DESC LIMIT 1").get(clientId);
    if (!paymentRow) return null;
    return {
      monto: paymentRow.amount,
      concepto: paymentRow.concept,
      fecha: paymentRow.date,
      estado: paymentRow.status
    };
  }
}
const clientRepository = new ClientRepository();
function registerClientController() {
  ipcMain.handle(
    IPC_CHANNELS.CLIENTS_LIST,
    async (_event, filters) => {
      try {
        const clients = await clientRepository.getAll(filters);
        return createIpcSuccess(clients);
      } catch (error) {
        return createIpcError(error);
      }
    }
  );
  ipcMain.handle(
    IPC_CHANNELS.CLIENTS_GET_BY_ID,
    async (_event, id) => {
      try {
        if (typeof id !== "number" || isNaN(id) || id <= 0) {
          return createIpcError("ID de cliente inválido.");
        }
        const client = await clientRepository.getById(id);
        return createIpcSuccess(client);
      } catch (error) {
        return createIpcError(error);
      }
    }
  );
  ipcMain.handle(
    IPC_CHANNELS.CLIENTS_CREATE,
    async (_event, clientData) => {
      var _a, _b;
      try {
        if (!clientData || typeof clientData !== "object") {
          return createIpcError("Los datos del cliente son requeridos.");
        }
        if (!clientData.name || typeof clientData.name !== "string" || clientData.name.trim() === "") {
          return createIpcError("El nombre del cliente es obligatorio.");
        }
        if (!clientData.phone || typeof clientData.phone !== "string" || clientData.phone.trim() === "") {
          return createIpcError("El teléfono del cliente es obligatorio.");
        }
        const created = await clientRepository.create({
          name: clientData.name.trim(),
          phone: clientData.phone.trim(),
          email: ((_a = clientData.email) == null ? void 0 : _a.trim()) || void 0,
          rut: ((_b = clientData.rut) == null ? void 0 : _b.trim()) || void 0,
          status: clientData.status || "activo",
          caso: clientData.caso
        });
        return createIpcSuccess(created);
      } catch (error) {
        return createIpcError(error);
      }
    }
  );
  ipcMain.handle(
    IPC_CHANNELS.CLIENTS_UPDATE,
    async (_event, id, clientData) => {
      try {
        if (typeof id !== "number" || isNaN(id) || id <= 0) {
          return createIpcError("ID de cliente inválido para actualización.");
        }
        if (!clientData || typeof clientData !== "object") {
          return createIpcError("Datos de actualización no proporcionados.");
        }
        const updated = await clientRepository.update(id, clientData);
        return createIpcSuccess(updated);
      } catch (error) {
        return createIpcError(error);
      }
    }
  );
  ipcMain.handle(
    IPC_CHANNELS.CLIENTS_DELETE,
    async (_event, id) => {
      try {
        if (typeof id !== "number" || isNaN(id) || id <= 0) {
          return createIpcError("ID de cliente inválido para eliminación.");
        }
        const success = await clientRepository.delete(id);
        return createIpcSuccess(success);
      } catch (error) {
        return createIpcError(error);
      }
    }
  );
  ipcMain.handle(
    IPC_CHANNELS.CLIENTS_SAVE_ALL,
    async (_event, clients) => {
      try {
        if (!Array.isArray(clients)) {
          return createIpcError("Se esperaba una lista de clientes.");
        }
        for (const client of clients) {
          if (client.id) {
            const existing = await clientRepository.getById(client.id);
            if (existing) {
              await clientRepository.update(client.id, client);
            } else {
              await clientRepository.create(client);
            }
          } else {
            await clientRepository.create(client);
          }
        }
        return createIpcSuccess(true);
      } catch (error) {
        return createIpcError(error);
      }
    }
  );
  ipcMain.handle(
    IPC_CHANNELS.CASES_GET_BY_CLIENT_ID,
    async (_event, clientId) => {
      try {
        if (typeof clientId !== "number" || isNaN(clientId) || clientId <= 0) {
          return createIpcError("ID de cliente inválido.");
        }
        const caseData = await caseRepository.getByClientId(clientId);
        return createIpcSuccess(caseData);
      } catch (error) {
        return createIpcError(error);
      }
    }
  );
  ipcMain.handle(
    IPC_CHANNELS.CASES_UPSERT,
    async (_event, clientId, caseData) => {
      try {
        if (typeof clientId !== "number" || isNaN(clientId) || clientId <= 0) {
          return createIpcError("ID de cliente inválido.");
        }
        if (!caseData || typeof caseData !== "object") {
          return createIpcError("Datos de expediente requeridos.");
        }
        const result = await caseRepository.upsert(clientId, caseData);
        return createIpcSuccess(result);
      } catch (error) {
        return createIpcError(error);
      }
    }
  );
  ipcMain.handle("db:clients:getAll", async (_event, filters) => {
    return clientRepository.getAll(filters);
  });
  ipcMain.handle("db:clients:getById", async (_event, id) => {
    return clientRepository.getById(id);
  });
  ipcMain.handle("db:clients:create", async (_event, clientData) => {
    return clientRepository.create({
      name: clientData.name,
      phone: clientData.phone,
      email: clientData.email,
      rut: clientData.rut,
      status: clientData.status,
      caso: clientData.caso
    });
  });
  ipcMain.handle("db:clients:update", async (_event, id, clientData) => {
    return clientRepository.update(id, clientData);
  });
  ipcMain.handle("db:clients:delete", async (_event, id) => {
    return clientRepository.delete(id);
  });
  ipcMain.handle("db:clients:saveAll", async (_event, clients) => {
    for (const client of clients) {
      if (client.id) {
        const existing = await clientRepository.getById(client.id);
        if (existing) {
          await clientRepository.update(client.id, client);
        } else {
          await clientRepository.create(client);
        }
      } else {
        await clientRepository.create(client);
      }
    }
    return true;
  });
  ipcMain.handle("db:cases:getByClientId", async (_event, clientId) => {
    return caseRepository.getByClientId(clientId);
  });
  ipcMain.handle("db:cases:upsert", async (_event, clientId, caseData) => {
    return caseRepository.upsert(clientId, caseData);
  });
}
function dataUrlToBuffer(dataUrl) {
  const base64Index = dataUrl.indexOf(";base64,");
  if (base64Index !== -1) {
    const base64Data = dataUrl.substring(base64Index + 8);
    return Buffer.from(base64Data, "base64");
  }
  return Buffer.from(dataUrl);
}
function registerDocumentController() {
  ipcMain.handle(
    IPC_CHANNELS.DOCUMENTS_GET_BY_CLIENT_ID,
    async (_event, clientId) => {
      try {
        if (typeof clientId !== "number" || isNaN(clientId)) {
          return createIpcError("El ID del cliente debe ser un número válido.");
        }
        const docs = await documentRepository.getByClientId(clientId);
        const mapped = docs.map((d) => ({
          id: d.id,
          name: d.name,
          dataUrl: "",
          size: d.size,
          uploadedAt: d.uploadedAt
        }));
        return createIpcSuccess(mapped);
      } catch (error) {
        return createIpcError(error);
      }
    }
  );
  ipcMain.handle(
    IPC_CHANNELS.DOCUMENTS_UPLOAD,
    async (_event, dto) => {
      try {
        if (!dto || typeof dto.clientId !== "number" || isNaN(dto.clientId)) {
          return createIpcError("ID de cliente inválido para la subida de documento.");
        }
        if (!dto.name || typeof dto.name !== "string" || dto.name.trim() === "") {
          return createIpcError("El nombre del documento es obligatorio.");
        }
        let buffer;
        if (dto.fileBuffer) {
          buffer = Buffer.from(dto.fileBuffer);
        } else if (dto.dataUrl) {
          buffer = dataUrlToBuffer(dto.dataUrl);
        } else {
          return createIpcError("Se debe proporcionar fileBuffer o dataUrl para el documento.");
        }
        const saved = await documentRepository.saveDocument(dto.clientId, dto.name.trim(), buffer);
        const clientDoc = {
          id: saved.id,
          name: saved.name,
          dataUrl: dto.dataUrl || "",
          size: saved.size,
          uploadedAt: saved.uploadedAt
        };
        return createIpcSuccess(clientDoc);
      } catch (error) {
        return createIpcError(error);
      }
    }
  );
  ipcMain.handle(
    IPC_CHANNELS.DOCUMENTS_DELETE,
    async (_event, id) => {
      try {
        if (!id || typeof id !== "string") {
          return createIpcError("ID de documento no válido.");
        }
        const success = await documentRepository.deleteDocument(id);
        return createIpcSuccess(success);
      } catch (error) {
        return createIpcError(error);
      }
    }
  );
  ipcMain.handle(
    IPC_CHANNELS.DOCUMENTS_OPEN,
    async (_event, param) => {
      try {
        const id = typeof param === "string" ? param : param == null ? void 0 : param.id;
        if (!id) {
          return createIpcError("ID de documento requerido para abrirlo.");
        }
        const result = await documentRepository.openDocument(id);
        if (!result.success) {
          return createIpcError(result.error ?? "No se pudo abrir el documento.");
        }
        return createIpcSuccess(true);
      } catch (error) {
        return createIpcError(error);
      }
    }
  );
  ipcMain.handle(
    IPC_CHANNELS.DOCUMENTS_SHOW_IN_FINDER,
    async (_event, id) => {
      try {
        if (!id || typeof id !== "string") {
          return createIpcError("ID de documento requerido.");
        }
        const success = await documentRepository.showInFinder(id);
        return createIpcSuccess(success);
      } catch (error) {
        return createIpcError(error);
      }
    }
  );
  ipcMain.handle("db:documents:getByClientId", async (_event, clientId) => {
    return documentRepository.getByClientId(clientId);
  });
  ipcMain.handle(
    "db:documents:upload",
    async (_event, { clientId, originalName, fileBuffer }) => {
      const buffer = Buffer.from(fileBuffer);
      return documentRepository.saveDocument(clientId, originalName, buffer);
    }
  );
  ipcMain.handle("db:documents:delete", async (_event, id) => {
    return documentRepository.deleteDocument(id);
  });
  ipcMain.handle("db:documents:open", async (_event, id) => {
    return documentRepository.openDocument(id);
  });
  ipcMain.handle("db:documents:showInFinder", async (_event, id) => {
    return documentRepository.showInFinder(id);
  });
}
function parsePaymentRow(row) {
  return {
    id: row.id,
    client: row.client,
    clientId: row.client_id ?? void 0,
    concept: row.concept,
    amount: row.amount,
    date: row.date,
    status: row.status
  };
}
function registerPaymentController() {
  ipcMain.handle(
    IPC_CHANNELS.PAYMENTS_LIST,
    async () => {
      try {
        const db = getDatabase();
        const rows = await db.prepare("SELECT * FROM payments ORDER BY date DESC").all();
        return createIpcSuccess(rows.map(parsePaymentRow));
      } catch (error) {
        return createIpcError(error);
      }
    }
  );
  ipcMain.handle(
    IPC_CHANNELS.PAYMENTS_SAVE_ALL,
    async (_event, payments) => {
      try {
        if (!Array.isArray(payments)) {
          return createIpcError("Se esperaba una lista de pagos.");
        }
        const db = getDatabase();
        await db.transaction(async () => {
          await db.prepare("DELETE FROM payments").run();
          const statement = db.prepare(`
            INSERT INTO payments (id, client, client_id, concept, amount, date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `);
          for (const payment of payments) {
            await statement.run(
              payment.id,
              payment.client,
              payment.clientId || null,
              payment.concept,
              payment.amount,
              payment.date,
              payment.status
            );
          }
        });
        return createIpcSuccess(true);
      } catch (error) {
        return createIpcError(error);
      }
    }
  );
  ipcMain.handle("db:payments:getAll", async () => {
    const db = getDatabase();
    return db.prepare("SELECT * FROM payments ORDER BY date DESC").all();
  });
  ipcMain.handle("db:payments:saveAll", async (_event, payments) => {
    const db = getDatabase();
    await db.transaction(async () => {
      await db.prepare("DELETE FROM payments").run();
      const statement = db.prepare(`
        INSERT INTO payments (id, client, client_id, concept, amount, date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const payment of payments) {
        await statement.run(
          payment.id,
          payment.client,
          payment.clientId || null,
          payment.concept,
          payment.amount,
          payment.date,
          payment.status
        );
      }
    });
    return true;
  });
}
function registerSettingsController() {
  ipcMain.handle(
    IPC_CHANNELS.SETTINGS_GET,
    async () => {
      try {
        const db = getDatabase();
        const rows = await db.prepare("SELECT key, value FROM settings").all();
        const settings = {};
        for (const row of rows) {
          try {
            settings[row.key] = JSON.parse(row.value);
          } catch {
            settings[row.key] = row.value;
          }
        }
        return createIpcSuccess(settings);
      } catch (error) {
        return createIpcError(error);
      }
    }
  );
  ipcMain.handle(
    IPC_CHANNELS.SETTINGS_SAVE_ALL,
    async (_event, settings) => {
      try {
        if (!settings || typeof settings !== "object") {
          return createIpcError("Se esperaba un objeto de configuración válido.");
        }
        const db = getDatabase();
        await db.transaction(async () => {
          const statement = db.prepare(`
            INSERT INTO settings (key, value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
          `);
          for (const [key, value] of Object.entries(settings)) {
            await statement.run(key, JSON.stringify(value));
          }
        });
        return createIpcSuccess(true);
      } catch (error) {
        return createIpcError(error);
      }
    }
  );
  ipcMain.handle("db:settings:getAll", async () => {
    const db = getDatabase();
    const rows = await db.prepare("SELECT key, value FROM settings").all();
    const settings = {};
    for (const row of rows) {
      try {
        settings[row.key] = JSON.parse(row.value);
      } catch {
        settings[row.key] = row.value;
      }
    }
    return settings;
  });
  ipcMain.handle("db:settings:saveAll", async (_event, settings) => {
    const db = getDatabase();
    await db.transaction(async () => {
      const statement = db.prepare(`
        INSERT INTO settings (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `);
      for (const [key, value] of Object.entries(settings)) {
        await statement.run(key, JSON.stringify(value));
      }
    });
    return true;
  });
}
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
const handleMinimize = () => win == null ? void 0 : win.minimize();
const handleMaximize = () => {
  if (win == null ? void 0 : win.isMaximized()) {
    win == null ? void 0 : win.restore();
  } else {
    win == null ? void 0 : win.maximize();
  }
};
const handleClose = () => win == null ? void 0 : win.close();
ipcMain.on(IPC_CHANNELS.WINDOW_MINIMIZE, handleMinimize);
ipcMain.on(IPC_CHANNELS.WINDOW_MAXIMIZE, handleMaximize);
ipcMain.on(IPC_CHANNELS.WINDOW_CLOSE, handleClose);
ipcMain.handle(IPC_CHANNELS.APP_GET_PLATFORM, () => createIpcSuccess(process.platform));
ipcMain.on("window-minimize", handleMinimize);
ipcMain.on("window-maximize", handleMaximize);
ipcMain.on("window-close", handleClose);
ipcMain.handle("get-platform", () => process.platform);
function createWindow() {
  const isMac = process.platform === "darwin";
  Menu.setApplicationMenu(null);
  win = new BrowserWindow({
    width: 1320,
    height: 820,
    minWidth: 1e3,
    minHeight: 640,
    frame: false,
    autoHideMenuBar: true,
    titleBarStyle: isMac ? "hidden" : "default",
    trafficLightPosition: isMac ? { x: 18, y: 18 } : void 0,
    vibrancy: isMac ? "sidebar" : void 0,
    visualEffectState: isMac ? "active" : void 0,
    show: false,
    backgroundColor: APP_COLORS.background,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.setMenu(null);
  win.once("ready-to-show", () => {
    win == null ? void 0 : win.show();
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  closeDatabase();
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("before-quit", () => {
  closeDatabase();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(async () => {
  await initDatabase();
  registerClientController();
  registerDocumentController();
  registerPaymentController();
  registerCalendarController();
  registerSettingsController();
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
