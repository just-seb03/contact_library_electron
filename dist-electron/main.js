import { app as S, ipcMain as d, shell as F, BrowserWindow as z, Menu as H } from "electron";
import { fileURLToPath as G } from "node:url";
import T from "node:path";
import m from "node:fs";
import V from "sqlite3";
const R = (n, e) => `rgba(${n}, ${e})`, w = (n) => `#${n.split(",").map((e) => Number(e.trim()).toString(16).padStart(2, "0")).join("")}`, I = {
  primary: "0, 122, 255",
  success: "52, 199, 89",
  warning: "255, 149, 0",
  danger: "255, 59, 48",
  neutral: "142, 142, 147"
}, B = "0, 0, 0", M = "255, 255, 255", k = "245, 245, 247", U = {
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
  cardBorder: R(B, 0.05),
  glassBorder: R(B, 0.06),
  glassSurface: R(k, 0.65),
  whiteOverlay: R(M, 0.2),
  whiteTextMuted: R(M, 0.9),
  whiteTextFaint: R(M, 0.6),
  // Tints derivados de APP_COLOR_RGB
  primaryTint: "var(--macos-accent-tint-subtle, rgba(0, 122, 255, 0.08))",
  primaryStatusTint: "var(--macos-accent-tint-status, rgba(0, 122, 255, 0.1))",
  neutralTint: R(I.neutral, 0.1),
  successTint: R(I.success, 0.1),
  warningTint: R(I.warning, 0.1),
  // Colores semánticos derivados del RGB base
  primary: "var(--macos-accent-color, #007aff)",
  success: w(I.success),
  warning: w(I.warning),
  danger: w(I.danger),
  neutral: w(I.neutral),
  // Variantes del primario
  primaryStrong: "var(--macos-accent-color, #0a84ff)",
  primaryLight: "var(--macos-accent-color, #30b0ff)"
}, K = {
  "--f7-page-bg-color": "var(--macos-canvas-bg, #f5f5f7)",
  "--f7-bars-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-navbar-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-toolbar-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-card-bg-color": "transparent",
  "--f7-list-strong-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-list-bg-color": "var(--macos-card-bg, #ffffff)"
}, Y = () => {
  const n = {
    "--f7-theme-color": U.primary,
    "--f7-theme-color-rgb": I.primary
  };
  for (const [t, a] of Object.entries(U))
    n[`--app-color-${t}`] = a;
  for (const [t, a] of Object.entries(I))
    n[`--app-color-${t}-rgb`] = a;
  const e = {
    blue: "primary",
    green: "success",
    orange: "warning",
    red: "danger",
    gray: "neutral"
  };
  for (const [t, a] of Object.entries(e))
    n[`--f7-color-${t}`] = `var(--app-color-${a})`, n[`--f7-color-${t}-rgb`] = `var(--app-color-${a}-rgb)`;
  for (const [t, a] of Object.entries(K))
    n[t] = String(a);
  return n;
};
Y();
const D = `
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
`, J = `
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
async function Q(n) {
  const e = await n.prepare("PRAGMA user_version;").get();
  if (((e == null ? void 0 : e.user_version) ?? 0) === 0) {
    if (console.log("[SQLite Migrator] Detectada base de datos sin versión (versión 0). Verificando esquema..."), await n.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='clients'").get() && (await n.prepare("PRAGMA table_info(clients)").all()).some((o) => o.name === "caso")) {
      console.log("[SQLite Migrator] Migrando base de datos antigua (con columnas JSON) al esquema normalizado v1..."), await n.transaction(async () => {
        const o = await n.prepare("SELECT * FROM clients").all();
        await n.exec(D), await n.exec(`
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
        for (const s of o) {
          if (await n.prepare(`
              INSERT INTO clients_new (id, name, phone, email, rut, status)
              VALUES (?, ?, ?, ?, ?, ?)
            `).run(
            s.id,
            s.name,
            s.phone,
            s.email || null,
            s.rut || null,
            s.status || "activo"
          ), s.caso)
            try {
              const l = JSON.parse(s.caso);
              l && typeof l == "object" && await n.prepare(`
                    INSERT OR REPLACE INTO cases (client_id, expediente, juzgado, materia, estado, proxima_audiencia)
                    VALUES (?, ?, ?, ?, ?, ?)
                  `).run(
                s.id,
                l.expediente || "Sin Expediente",
                l.juzgado || "Sin Juzgado",
                l.materia || "General",
                l.estado || "Activo",
                l.proximaAudiencia || null
              );
            } catch {
            }
          if (s.documentos)
            try {
              const l = JSON.parse(s.documentos);
              if (Array.isArray(l))
                for (const E of l)
                  E && E.name && await n.prepare(`
                        INSERT OR IGNORE INTO documents (id, client_id, name, file_name, relative_path, size, mime_type, uploaded_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                      `).run(
                    E.id || `migrated-${Date.now()}-${Math.random()}`,
                    s.id,
                    E.name,
                    E.name,
                    `${s.id}/${E.name}`,
                    Number(E.size) || 0,
                    "application/pdf",
                    E.uploadedAt || (/* @__PURE__ */ new Date()).toISOString()
                  );
            } catch {
            }
        }
        await n.exec("DROP TABLE clients;"), await n.exec("ALTER TABLE clients_new RENAME TO clients;"), await n.exec(D), await n.pragma("user_version = 1");
      }), console.log("[SQLite Migrator] Migración a v1 completada exitosamente.");
      return;
    }
    console.log("[SQLite Migrator] Creando base de datos inicial v1..."), await n.exec(D);
    const i = await n.prepare("SELECT count(*) as count FROM clients").get();
    (!i || i.count === 0) && (console.log("[SQLite Migrator] Población inicial con seed data..."), await n.exec(J)), await n.pragma("user_version = 1"), console.log("[SQLite Migrator] Esquema inicial v1 aplicado con éxito.");
  }
}
let A = null;
function q() {
  var n;
  try {
    const e = (n = S) != null && n.getPath ? S.getPath("userData") : process.cwd();
    return T.join(e, "contact_library.db");
  } catch {
    return T.join(process.cwd(), "contact_library.db");
  }
}
function Z() {
  var n;
  try {
    const e = (n = S) != null && n.getPath ? S.getPath("userData") : process.cwd(), t = T.join(e, "documents");
    return m.existsSync(t) || m.mkdirSync(t, { recursive: !0 }), t;
  } catch {
    const e = T.join(process.cwd(), "storage", "documents");
    return m.existsSync(e) || m.mkdirSync(e, { recursive: !0 }), e;
  }
}
function P(n) {
  return n.length === 1 && Array.isArray(n[0]) ? n[0] : n;
}
function ee(n) {
  return new Promise((e, t) => {
    const a = new V.Database(n, (i) => {
      i ? t(i) : e(a);
    });
  });
}
function te(n) {
  let e = Promise.resolve();
  const t = (a) => new Promise((i, r) => {
    n.exec(a, (c) => {
      c ? r(c) : i();
    });
  });
  return {
    prepare(a) {
      return {
        all(...i) {
          const r = P(i);
          return new Promise((c, o) => {
            const s = n.prepare(a, (l) => {
              if (l) {
                o(l);
                return;
              }
              s.all(r, (E, g) => {
                s.finalize((y) => {
                  E || y ? o(E || y) : c(g);
                });
              });
            });
          });
        },
        get(...i) {
          const r = P(i);
          return new Promise((c, o) => {
            const s = n.prepare(a, (l) => {
              if (l) {
                o(l);
                return;
              }
              s.get(r, (E, g) => {
                s.finalize((y) => {
                  E || y ? o(E || y) : c(g);
                });
              });
            });
          });
        },
        run(...i) {
          const r = P(i);
          return new Promise((c, o) => {
            const s = n.prepare(a, (l) => {
              if (l) {
                o(l);
                return;
              }
              s.run(r, function(E) {
                s.finalize((g) => {
                  E || g ? o(E || g) : c({ lastInsertRowid: this.lastID, changes: this.changes });
                });
              });
            });
          });
        }
      };
    },
    exec: t,
    pragma(a) {
      return t(`PRAGMA ${a};`);
    },
    async transaction(a) {
      let i;
      const r = e;
      e = new Promise((c) => {
        i = c;
      }), await r;
      try {
        await t("BEGIN TRANSACTION;");
        const c = await a();
        return await t("COMMIT;"), c;
      } catch (c) {
        try {
          await t("ROLLBACK;");
        } catch (o) {
          console.error("[SQLite] Error revirtiendo transacción:", o);
        }
        throw c;
      } finally {
        i();
      }
    },
    close() {
      n.close((a) => {
        a && console.error("[SQLite] Error cerrando la base de datos:", a);
      });
    }
  };
}
async function ae(n) {
  if (A) return A;
  const e = q(), t = T.dirname(e);
  m.mkdirSync(t, { recursive: !0 });
  const a = await ee(e), i = te(a);
  try {
    await i.pragma("foreign_keys = ON"), await Q(i);
  } catch (r) {
    throw i.close(), r;
  }
  return console.log("[SQLite] Base de datos inicializada y conectada en:", e), A = i, A;
}
function u() {
  if (!A)
    throw new Error("[SQLite] La base de datos no ha sido inicializada. Asegúrate de llamar a initDatabase() primero.");
  return A;
}
function X() {
  A && (A.close(), A = null);
}
class ne {
  toEntity(e) {
    return {
      id: e.id,
      title: e.title,
      date: e.date,
      startTime: e.start_time,
      endTime: e.end_time,
      colorId: e.color_id || "blue",
      alarmMinutes: Number(e.alarm_minutes) || 15,
      clientId: e.client_id,
      details: e.details || ""
    };
  }
  async getAll(e) {
    const t = u(), a = [], i = [];
    if (e != null && e.startDate && (a.push("date >= ?"), i.push(e.startDate)), e != null && e.endDate && (a.push("date <= ?"), i.push(e.endDate)), e != null && e.clientId && (a.push("client_id = ?"), i.push(e.clientId)), e != null && e.search && e.search.trim() !== "") {
      const o = `%${e.search.trim().toLowerCase()}%`;
      a.push("(LOWER(title) LIKE ? OR LOWER(details) LIKE ?)"), i.push(o, o);
    }
    let r = "SELECT * FROM calendar_events";
    return a.length > 0 && (r += ` WHERE ${a.join(" AND ")}`), r += " ORDER BY date ASC, start_time ASC", (await t.prepare(r).all(...i)).map((o) => this.toEntity(o));
  }
  async getByDateRange(e, t) {
    return this.getAll({ startDate: e, endDate: t });
  }
  async getById(e) {
    const a = await u().prepare("SELECT * FROM calendar_events WHERE id = ?").get(e);
    return a ? this.toEntity(a) : null;
  }
  async create(e) {
    const t = u(), a = e.id || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    await t.prepare(`
      INSERT INTO calendar_events (id, title, date, start_time, end_time, color_id, alarm_minutes, client_id, details, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(
      a,
      e.title,
      e.date,
      e.startTime,
      e.endTime,
      e.colorId || "blue",
      e.alarmMinutes ?? 15,
      e.clientId || null,
      e.details || ""
    );
    const i = await this.getById(a);
    if (!i)
      throw new Error(`Error al persistir evento de calendario con id ${a}`);
    return i;
  }
  async update(e, t) {
    const a = u(), i = await a.prepare("SELECT * FROM calendar_events WHERE id = ?").get(e);
    if (!i)
      throw new Error(`Evento con id ${e} no encontrado`);
    const r = t.title !== void 0 ? t.title : i.title, c = t.date !== void 0 ? t.date : i.date, o = t.startTime !== void 0 ? t.startTime : i.start_time, s = t.endTime !== void 0 ? t.endTime : i.end_time, l = t.colorId !== void 0 ? t.colorId : i.color_id, E = t.alarmMinutes !== void 0 ? t.alarmMinutes : i.alarm_minutes, g = t.clientId !== void 0 ? t.clientId : i.client_id, y = t.details !== void 0 ? t.details : i.details;
    await a.prepare(`
      UPDATE calendar_events
      SET title = ?, date = ?, start_time = ?, end_time = ?, color_id = ?, alarm_minutes = ?, client_id = ?, details = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      r,
      c,
      o,
      s,
      l,
      E,
      g,
      y,
      e
    );
    const f = await this.getById(e);
    if (!f)
      throw new Error(`Error al recuperar evento actualizado con id ${e}`);
    return f;
  }
  async delete(e) {
    return (await u().prepare("DELETE FROM calendar_events WHERE id = ?").run(e)).changes > 0;
  }
  /**
   * Obtiene eventos que ocurrirán en la fecha y hora indicadas con control de alarmas.
   */
  async getUpcomingAlerts(e, t) {
    return (await u().prepare(`
      SELECT * FROM calendar_events
      WHERE date = ? AND start_time >= ?
      ORDER BY start_time ASC
    `).all(e, t)).map((r) => this.toEntity(r));
  }
}
const _ = new ne();
function ie() {
  d.handle("db:calendar:getAll", async (n, e) => _.getAll(e)), d.handle("db:calendar:getByDateRange", async (n, e, t) => _.getByDateRange(e, t)), d.handle("db:calendar:getById", async (n, e) => _.getById(e)), d.handle("db:calendar:create", async (n, e) => _.create(e)), d.handle("db:calendar:update", async (n, e, t) => _.update(e, t)), d.handle("db:calendar:delete", async (n, e) => _.delete(e)), d.handle("db:calendar:saveAll", async (n, e) => {
    for (const t of e)
      await _.getById(t.id) ? await _.update(t.id, t) : await _.create(t);
    return !0;
  });
}
class re {
  toEntity(e) {
    return {
      id: e.id,
      clientId: e.client_id,
      expediente: e.expediente,
      juzgado: e.juzgado,
      materia: e.materia,
      estado: e.estado,
      proximaAudiencia: e.proxima_audiencia ?? void 0,
      createdAt: e.created_at,
      updatedAt: e.updated_at
    };
  }
  async getByClientId(e) {
    const a = await u().prepare("SELECT * FROM cases WHERE client_id = ?").get(e);
    return a ? this.toEntity(a) : null;
  }
  async upsert(e, t) {
    const a = u();
    await this.getByClientId(e) ? await a.prepare(`
        UPDATE cases
        SET expediente = ?, juzgado = ?, materia = ?, estado = ?, proxima_audiencia = ?, updated_at = CURRENT_TIMESTAMP
        WHERE client_id = ?
      `).run(
      t.expediente,
      t.juzgado,
      t.materia,
      t.estado,
      t.proximaAudiencia ?? null,
      e
    ) : await a.prepare(`
        INSERT INTO cases (client_id, expediente, juzgado, materia, estado, proxima_audiencia)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
      e,
      t.expediente,
      t.juzgado,
      t.materia,
      t.estado,
      t.proximaAudiencia ?? null
    );
    const r = await this.getByClientId(e);
    if (!r)
      throw new Error(`Error al persistir expediente judicial para el cliente ${e}`);
    return r;
  }
  async updateStatus(e, t) {
    return (await u().prepare(`
      UPDATE cases
      SET estado = ?, updated_at = CURRENT_TIMESTAMP
      WHERE client_id = ?
    `).run(t, e)).changes > 0;
  }
  async deleteByClientId(e) {
    return (await u().prepare("DELETE FROM cases WHERE client_id = ?").run(e)).changes > 0;
  }
}
const v = new re();
function se(n) {
  return n.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").replace(/\s+/g, "_").trim();
}
const O = {
  getStorageDir() {
    return Z();
  },
  getAbsolutePath(n) {
    return T.join(this.getStorageDir(), n);
  },
  async saveDocumentFile(n, e, t) {
    const a = this.getStorageDir(), i = T.join(a, String(n));
    m.existsSync(i) || await m.promises.mkdir(i, { recursive: !0 });
    const r = se(e) || "documento.pdf", c = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, o = `${c}_${r}`, s = T.join(i, o), l = `${n}/${o}`;
    await m.promises.writeFile(s, t);
    const E = await m.promises.stat(s);
    return {
      id: c,
      clientId: n,
      name: e,
      fileName: o,
      relativePath: l,
      size: E.size,
      mimeType: e.toLowerCase().endsWith(".pdf") ? "application/pdf" : "application/octet-stream",
      uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  },
  async deleteDocumentFile(n) {
    try {
      const e = this.getAbsolutePath(n);
      return m.existsSync(e) ? (await m.promises.unlink(e), !0) : !1;
    } catch (e) {
      return console.error("[DocumentStorage] Error al eliminar archivo físico:", e), !1;
    }
  },
  /**
   * Abre el documento con la aplicación predeterminada del sistema operativo.
   * En macOS abre Vista Previa (Preview).
   */
  async openDocumentWithSystem(n) {
    try {
      const e = this.getAbsolutePath(n);
      if (!m.existsSync(e))
        return { success: !1, error: "El archivo no existe en el disco." };
      const t = await F.openPath(e);
      return t ? { success: !1, error: t } : { success: !0 };
    } catch (e) {
      return { success: !1, error: e instanceof Error ? e.message : "Error desconocido al abrir documento" };
    }
  },
  /**
   * Revela y resalta el archivo directamente en el Finder de macOS (o Explorador de archivos).
   */
  async showInFinder(n) {
    try {
      const e = this.getAbsolutePath(n);
      return m.existsSync(e) ? (F.showItemInFolder(e), !0) : !1;
    } catch (e) {
      return console.error("[DocumentStorage] Error al mostrar archivo en Finder:", e), !1;
    }
  },
  /**
   * Lee el archivo y lo devuelve como dataUrl base64 si el visor web lo requiere.
   */
  async readAsBase64(n) {
    try {
      const e = this.getAbsolutePath(n);
      return m.existsSync(e) ? `data:application/pdf;base64,${(await m.promises.readFile(e)).toString("base64")}` : null;
    } catch (e) {
      return console.error("[DocumentStorage] Error al leer archivo en base64:", e), null;
    }
  }
};
class oe {
  toEntity(e) {
    return {
      id: e.id,
      clientId: e.client_id,
      name: e.name,
      fileName: e.file_name,
      relativePath: e.relative_path,
      size: e.size,
      mimeType: e.mime_type,
      uploadedAt: e.uploaded_at
    };
  }
  async getByClientId(e) {
    return (await u().prepare("SELECT * FROM documents WHERE client_id = ? ORDER BY uploaded_at DESC").all(e)).map((i) => this.toEntity(i));
  }
  async getById(e) {
    const a = await u().prepare("SELECT * FROM documents WHERE id = ?").get(e);
    return a ? this.toEntity(a) : null;
  }
  /**
   * Guarda físicamente el archivo en disco (userData/documents/{clientId}) y registra sus metadatos en SQLite.
   * Si la inserción en la base de datos falla, elimina el archivo físico para evitar residuos.
   */
  async saveDocument(e, t, a) {
    const i = u(), r = await O.saveDocumentFile(e, t, a);
    try {
      return await i.prepare(`
        INSERT INTO documents (id, client_id, name, file_name, relative_path, size, mime_type, uploaded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        r.id,
        e,
        r.name,
        r.fileName,
        r.relativePath,
        r.size,
        r.mimeType,
        r.uploadedAt
      ), {
        id: r.id,
        clientId: e,
        name: r.name,
        fileName: r.fileName,
        relativePath: r.relativePath,
        size: r.size,
        mimeType: r.mimeType,
        uploadedAt: r.uploadedAt
      };
    } catch (c) {
      throw await O.deleteDocumentFile(r.relativePath), c;
    }
  }
  /**
   * Registra metadata de un documento que ya fue guardado o importado físicamente
   */
  async registerDocumentMetadata(e, t, a, i, r, c, o = "application/pdf", s = (/* @__PURE__ */ new Date()).toISOString()) {
    return await u().prepare(`
      INSERT OR REPLACE INTO documents (id, client_id, name, file_name, relative_path, size, mime_type, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(e, t, a, i, r, c, o, s), {
      id: e,
      clientId: t,
      name: a,
      fileName: i,
      relativePath: r,
      size: c,
      mimeType: o,
      uploadedAt: s
    };
  }
  /**
   * Elimina el documento de la base de datos y borra físicamente el archivo del disco.
   */
  async deleteDocument(e) {
    const t = u(), a = await this.getById(e);
    return a ? (await t.prepare("DELETE FROM documents WHERE id = ?").run(e), await O.deleteDocumentFile(a.relativePath), !0) : !1;
  }
  /**
   * Limpia todos los archivos físicos de un cliente en disco.
   * Utilizado cuando se elimina un cliente o su carpeta.
   */
  async cleanClientStorageFolder(e) {
    try {
      const t = O.getStorageDir(), a = T.join(t, String(e));
      m.existsSync(a) && await m.promises.rm(a, { recursive: !0, force: !0 });
    } catch (t) {
      console.error(`[DocumentRepository] Error al limpiar directorio del cliente ${e}:`, t);
    }
  }
  /**
   * Abre el archivo con Vista Previa (o la app predeterminada en macOS).
   */
  async openDocument(e) {
    const t = await this.getById(e);
    return t ? O.openDocumentWithSystem(t.relativePath) : { success: !1, error: "Documento no encontrado" };
  }
  /**
   * Revela el archivo en Finder.
   */
  async showInFinder(e) {
    const t = await this.getById(e);
    return t ? O.showInFinder(t.relativePath) : !1;
  }
  /**
   * Obtiene contenido en base64 para previsualización web.
   */
  async getBase64(e) {
    const t = await this.getById(e);
    return t ? O.readAsBase64(t.relativePath) : null;
  }
}
const L = new oe();
class ce {
  formatClient(e, t, a, i) {
    return {
      id: e.id,
      name: e.name,
      phone: e.phone,
      email: e.email ?? void 0,
      rut: e.rut ?? void 0,
      status: e.status,
      caso: t ? {
        expediente: t.expediente,
        juzgado: t.juzgado,
        materia: t.materia,
        estado: t.estado,
        proximaAudiencia: t.proximaAudiencia
      } : void 0,
      documentos: (a || []).map((r) => ({
        id: r.id,
        name: r.name,
        dataUrl: "",
        size: r.size,
        uploadedAt: r.uploadedAt
      })),
      pago: i ?? void 0
    };
  }
  async getAll(e) {
    const t = u(), a = [], i = [];
    if (e != null && e.search && e.search.trim() !== "") {
      const s = `%${e.search.trim().toLowerCase()}%`;
      a.push("(LOWER(name) LIKE ? OR LOWER(rut) LIKE ? OR phone LIKE ?)"), i.push(s, s, s);
    }
    e != null && e.status && (a.push("status = ?"), i.push(e.status));
    let r = "SELECT * FROM clients";
    a.length > 0 && (r += ` WHERE ${a.join(" AND ")}`), r += " ORDER BY id ASC", e != null && e.limit && (r += ` LIMIT ${Number(e.limit)}`, e != null && e.offset && (r += ` OFFSET ${Number(e.offset)}`));
    const c = await t.prepare(r).all(...i), o = [];
    for (const s of c) {
      const [l, E, g] = await Promise.all([
        v.getByClientId(s.id),
        L.getByClientId(s.id),
        this.getLatestPaymentInfo(s.id)
      ]);
      o.push(this.formatClient(s, l, E, g));
    }
    return o;
  }
  async getById(e) {
    const a = await u().prepare("SELECT * FROM clients WHERE id = ?").get(e);
    if (!a) return null;
    const [i, r, c] = await Promise.all([
      v.getByClientId(e),
      L.getByClientId(e),
      this.getLatestPaymentInfo(e)
    ]);
    return this.formatClient(a, i, r, c);
  }
  async create(e) {
    const t = u();
    return t.transaction(async () => {
      const a = await t.prepare(`
        INSERT INTO clients (name, phone, email, rut, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).run(
        e.name,
        e.phone,
        e.email || null,
        e.rut || null,
        e.status || "activo"
      ), i = Number(a.lastInsertRowid);
      let r = null;
      return e.caso && (r = await v.upsert(i, {
        expediente: e.caso.expediente,
        juzgado: e.caso.juzgado,
        materia: e.caso.materia,
        estado: e.caso.estado,
        proximaAudiencia: e.caso.proximaAudiencia
      })), {
        id: i,
        name: e.name,
        phone: e.phone,
        email: e.email,
        rut: e.rut,
        status: e.status || "activo",
        caso: r ? {
          expediente: r.expediente,
          juzgado: r.juzgado,
          materia: r.materia,
          estado: r.estado,
          proximaAudiencia: r.proximaAudiencia
        } : void 0,
        documentos: []
      };
    });
  }
  async update(e, t) {
    const a = u(), i = await a.prepare("SELECT * FROM clients WHERE id = ?").get(e);
    if (!i)
      throw new Error(`Cliente con id ${e} no encontrado`);
    await a.transaction(async () => {
      const c = t.name !== void 0 ? t.name : i.name, o = t.phone !== void 0 ? t.phone : i.phone, s = t.email !== void 0 ? t.email : i.email, l = t.rut !== void 0 ? t.rut : i.rut, E = t.status !== void 0 ? t.status : i.status;
      await a.prepare(`
        UPDATE clients
        SET name = ?, phone = ?, email = ?, rut = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        c,
        o,
        s || null,
        l || null,
        E,
        e
      ), t.caso && await v.upsert(e, {
        expediente: t.caso.expediente,
        juzgado: t.caso.juzgado,
        materia: t.caso.materia,
        estado: t.caso.estado,
        proximaAudiencia: t.caso.proximaAudiencia
      });
    });
    const r = await this.getById(e);
    if (!r)
      throw new Error(`Error al recuperar cliente actualizado con id ${e}`);
    return r;
  }
  async delete(e) {
    const t = u();
    return await t.transaction(async () => {
      await t.prepare("DELETE FROM clients WHERE id = ?").run(e);
    }), await L.cleanClientStorageFolder(e), !0;
  }
  async getLatestPaymentInfo(e) {
    const a = await u().prepare("SELECT amount, concept, date, status FROM payments WHERE client_id = ? ORDER BY date DESC LIMIT 1").get(e);
    return a ? {
      monto: a.amount,
      concepto: a.concept,
      fecha: a.date,
      estado: a.status
    } : null;
  }
}
const N = new ce();
function de() {
  d.handle("db:clients:getAll", async (n, e) => N.getAll(e)), d.handle("db:clients:getById", async (n, e) => N.getById(e)), d.handle("db:clients:create", async (n, e) => N.create({
    name: e.name,
    phone: e.phone,
    email: e.email,
    rut: e.rut,
    status: e.status,
    caso: e.caso
  })), d.handle("db:clients:update", async (n, e, t) => N.update(e, t)), d.handle("db:clients:delete", async (n, e) => N.delete(e)), d.handle("db:clients:saveAll", async (n, e) => {
    for (const t of e)
      t.id ? await N.getById(t.id) ? await N.update(t.id, t) : await N.create(t) : await N.create(t);
    return !0;
  }), d.handle("db:cases:getByClientId", async (n, e) => v.getByClientId(e)), d.handle("db:cases:upsert", async (n, e, t) => v.upsert(e, t)), d.handle("db:documents:getByClientId", async (n, e) => L.getByClientId(e)), d.handle(
    "db:documents:upload",
    async (n, { clientId: e, originalName: t, fileBuffer: a }) => {
      const i = Buffer.from(a);
      return L.saveDocument(e, t, i);
    }
  ), d.handle("db:documents:delete", async (n, e) => L.deleteDocument(e)), d.handle("db:documents:open", async (n, e) => L.openDocument(e)), d.handle("db:documents:showInFinder", async (n, e) => L.showInFinder(e));
}
class le {
  toEntity(e) {
    return {
      id: e.id,
      client: e.client_name,
      clientId: e.client_id ?? void 0,
      concept: e.concept,
      amount: e.amount,
      date: e.date,
      status: e.status
    };
  }
  async getAll(e) {
    const t = u(), a = [], i = [];
    if (e != null && e.clientId && (a.push("client_id = ?"), i.push(e.clientId)), e != null && e.status && (a.push("status = ?"), i.push(e.status)), e != null && e.startDate && (a.push("date >= ?"), i.push(e.startDate)), e != null && e.endDate && (a.push("date <= ?"), i.push(e.endDate)), e != null && e.search && e.search.trim() !== "") {
      const o = `%${e.search.trim().toLowerCase()}%`;
      a.push("(LOWER(client_name) LIKE ? OR LOWER(concept) LIKE ?)"), i.push(o, o);
    }
    let r = "SELECT * FROM payments";
    return a.length > 0 && (r += ` WHERE ${a.join(" AND ")}`), r += " ORDER BY date DESC, created_at DESC", (await t.prepare(r).all(...i)).map((o) => this.toEntity(o));
  }
  async getById(e) {
    const a = await u().prepare("SELECT * FROM payments WHERE id = ?").get(e);
    return a ? this.toEntity(a) : null;
  }
  async create(e) {
    const t = u(), a = e.id || `pay-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    await t.prepare(`
      INSERT INTO payments (id, client_id, client_name, concept, amount, date, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(
      a,
      e.clientId || null,
      e.client,
      e.concept,
      Number(e.amount),
      e.date,
      e.status
    );
    const i = await this.getById(a);
    if (!i)
      throw new Error(`Error al persistir pago ${a}`);
    return i;
  }
  async update(e, t) {
    const a = u(), i = await a.prepare("SELECT * FROM payments WHERE id = ?").get(e);
    if (!i)
      throw new Error(`Pago con id ${e} no encontrado`);
    const r = t.clientId !== void 0 ? t.clientId : i.client_id, c = t.client !== void 0 ? t.client : i.client_name, o = t.concept !== void 0 ? t.concept : i.concept, s = t.amount !== void 0 ? Number(t.amount) : i.amount, l = t.date !== void 0 ? t.date : i.date, E = t.status !== void 0 ? t.status : i.status;
    await a.prepare(`
      UPDATE payments
      SET client_id = ?, client_name = ?, concept = ?, amount = ?, date = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      r,
      c,
      o,
      s,
      l,
      E,
      e
    );
    const g = await this.getById(e);
    if (!g)
      throw new Error(`Error al recuperar pago actualizado con id ${e}`);
    return g;
  }
  async delete(e) {
    return (await u().prepare("DELETE FROM payments WHERE id = ?").run(e)).changes > 0;
  }
  /**
   * Cálculo de balance y resumen automático de pagos
   */
  async getSummary(e) {
    const t = u();
    let a = "SELECT amount, status FROM payments";
    const i = [];
    e && (a += " WHERE client_id = ?", i.push(e));
    const r = await t.prepare(a).all(...i);
    let c = 0, o = 0, s = 0, l = 0, E = 0, g = 0, y = 0;
    for (const f of r) {
      const b = Number(f.amount) || 0;
      c += b, f.status === "completed" ? (o += b, E++) : f.status === "pending" ? (s += b, g++) : f.status === "overdue" && (l += b, y++);
    }
    return {
      totalAmount: c,
      completedAmount: o,
      pendingAmount: s,
      overdueAmount: l,
      totalCount: r.length,
      completedCount: E,
      pendingCount: g,
      overdueCount: y
    };
  }
}
const h = new le();
function ue() {
  d.handle("db:payments:getAll", async (n, e) => h.getAll(e)), d.handle("db:payments:getById", async (n, e) => h.getById(e)), d.handle("db:payments:create", async (n, e) => h.create(e)), d.handle("db:payments:update", async (n, e, t) => h.update(e, t)), d.handle("db:payments:delete", async (n, e) => h.delete(e)), d.handle("db:payments:getSummary", async (n, e) => h.getSummary(e)), d.handle("db:payments:saveAll", async (n, e) => {
    for (const t of e)
      await h.getById(t.id) ? await h.update(t.id, t) : await h.create(t);
    return !0;
  });
}
class Ee {
  async getAll() {
    const t = await u().prepare("SELECT key, value FROM settings").all(), a = {};
    for (const i of t)
      try {
        a[i.key] = JSON.parse(i.value);
      } catch {
        a[i.key] = i.value;
      }
    return a;
  }
  async get(e) {
    const a = await u().prepare("SELECT value FROM settings WHERE key = ?").get(e);
    if (!a) return null;
    try {
      return JSON.parse(a.value);
    } catch {
      return a.value;
    }
  }
  async set(e, t) {
    const a = u(), i = JSON.stringify(t);
    await a.prepare(`
      INSERT INTO settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `).run(e, i);
  }
  async setMultiple(e) {
    const t = u();
    await t.transaction(async () => {
      const a = t.prepare(`
        INSERT INTO settings (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `);
      for (const [i, r] of Object.entries(e))
        await a.run(i, JSON.stringify(r));
    });
  }
  async delete(e) {
    return (await u().prepare("DELETE FROM settings WHERE key = ?").run(e)).changes > 0;
  }
}
const C = new Ee();
function pe() {
  d.handle("db:settings:getAll", async () => C.getAll()), d.handle("db:settings:get", async (n, e) => C.get(e)), d.handle("db:settings:set", async (n, e, t) => (await C.set(e, t), !0)), d.handle("db:settings:saveAll", async (n, e) => (await C.setMultiple(e), !0));
}
const j = T.dirname(G(import.meta.url));
process.env.APP_ROOT = T.join(j, "..");
const x = process.env.VITE_DEV_SERVER_URL, _e = T.join(process.env.APP_ROOT, "dist-electron"), W = T.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = x ? T.join(process.env.APP_ROOT, "public") : W;
let p;
d.on("window-minimize", () => p == null ? void 0 : p.minimize());
d.on("window-maximize", () => {
  p != null && p.isMaximized() ? p == null || p.restore() : p == null || p.maximize();
});
d.on("window-close", () => p == null ? void 0 : p.close());
d.handle("get-platform", () => process.platform);
function $() {
  const n = process.platform === "darwin";
  H.setApplicationMenu(null), p = new z({
    width: 1320,
    height: 820,
    minWidth: 1e3,
    minHeight: 640,
    frame: !1,
    autoHideMenuBar: !0,
    titleBarStyle: n ? "hidden" : "default",
    trafficLightPosition: n ? { x: 18, y: 18 } : void 0,
    vibrancy: n ? "sidebar" : void 0,
    visualEffectState: n ? "active" : void 0,
    show: !1,
    backgroundColor: U.background,
    icon: T.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: T.join(j, "preload.mjs")
    }
  }), p.setMenu(null), p.once("ready-to-show", () => {
    p == null || p.show();
  }), p.webContents.on("did-finish-load", () => {
    p == null || p.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), x ? p.loadURL(x) : p.loadFile(T.join(W, "index.html"));
}
S.on("window-all-closed", () => {
  X(), process.platform !== "darwin" && (S.quit(), p = null);
});
S.on("before-quit", () => {
  X();
});
S.on("activate", () => {
  z.getAllWindows().length === 0 && $();
});
S.whenReady().then(async () => {
  await ae(), de(), ue(), ie(), pe(), $();
});
export {
  _e as MAIN_DIST,
  W as RENDERER_DIST,
  x as VITE_DEV_SERVER_URL
};
