var Me = Object.defineProperty;
var Pe = (n, e, t) => e in n ? Me(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var j = (n, e, t) => Pe(n, typeof e != "symbol" ? e + "" : e, t);
import { app as E, Menu as P, Notification as ue, Tray as Ue, nativeImage as de, ipcMain as l, nativeTheme as Fe, BrowserWindow as xe, shell as pe, powerMonitor as me } from "electron";
import { fileURLToPath as Be } from "node:url";
import m from "node:path";
import g from "node:fs";
import $e from "sqlite3";
const V = `
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
`, ke = `
CREATE TABLE IF NOT EXISTS notification_log (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_notification_log_sent_at ON notification_log (sent_at);
`;
async function je(n) {
  await Xe(n), await We(n);
}
async function ze(n) {
  const e = await n.prepare("PRAGMA user_version;").get();
  return (e == null ? void 0 : e.user_version) ?? 0;
}
async function We(n) {
  await ze(n) >= 2 || (await n.transaction(async () => {
    await n.exec(ke), await n.pragma("user_version = 2");
  }), console.log("[SQLite Migrator] Esquema v2 (registro de notificaciones) aplicado con éxito."));
}
async function Xe(n) {
  const e = await n.prepare("PRAGMA user_version;").get();
  if (((e == null ? void 0 : e.user_version) ?? 0) === 0) {
    if (console.log("[SQLite Migrator] Detectada base de datos sin versión (versión 0). Verificando esquema..."), await n.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='clients'").get() && (await n.prepare("PRAGMA table_info(clients)").all()).some((c) => c.name === "caso")) {
      console.log("[SQLite Migrator] Migrando base de datos antigua (con columnas JSON) al esquema normalizado v1..."), await n.transaction(async () => {
        const c = await n.prepare("SELECT * FROM clients").all();
        await n.exec(V), await n.exec(`
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
        for (const i of c) {
          if (await n.prepare(`
              INSERT INTO clients_new (id, name, phone, email, rut, status)
              VALUES (?, ?, ?, ?, ?, ?)
            `).run(
            i.id,
            i.name,
            i.phone,
            i.email || null,
            i.rut || null,
            i.status || "activo"
          ), i.caso)
            try {
              const s = JSON.parse(i.caso);
              s && typeof s == "object" && await n.prepare(`
                    INSERT OR REPLACE INTO cases (client_id, expediente, juzgado, materia, estado, proxima_audiencia)
                    VALUES (?, ?, ?, ?, ?, ?)
                  `).run(
                i.id,
                s.expediente || "Sin Expediente",
                s.juzgado || "Sin Juzgado",
                s.materia || "General",
                s.estado || "Activo",
                s.proximaAudiencia || null
              );
            } catch {
            }
          if (i.documentos)
            try {
              const s = JSON.parse(i.documentos);
              if (Array.isArray(s))
                for (const p of s)
                  p && p.name && await n.prepare(`
                        INSERT OR IGNORE INTO documents (id, client_id, name, file_name, relative_path, size, mime_type, uploaded_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                      `).run(
                    p.id || `migrated-${Date.now()}-${Math.random()}`,
                    i.id,
                    p.name,
                    p.name,
                    `${i.id}/${p.name}`,
                    Number(p.size) || 0,
                    "application/pdf",
                    p.uploadedAt || (/* @__PURE__ */ new Date()).toISOString()
                  );
            } catch {
            }
        }
        await n.exec("DROP TABLE clients;"), await n.exec("ALTER TABLE clients_new RENAME TO clients;"), await n.exec(V), await n.pragma("user_version = 1");
      }), console.log("[SQLite Migrator] Migración a v1 completada exitosamente.");
      return;
    }
    console.log("[SQLite Migrator] Creando base de datos inicial v1..."), await n.exec(V), await n.pragma("user_version = 1"), console.log("[SQLite Migrator] Esquema inicial v1 aplicado con éxito.");
  }
}
let v = null;
function He() {
  var n;
  try {
    const e = (n = E) != null && n.getPath ? E.getPath("userData") : process.cwd();
    return m.join(e, "contact_library.db");
  } catch {
    return m.join(process.cwd(), "contact_library.db");
  }
}
function Ve() {
  var n;
  try {
    const e = (n = E) != null && n.getPath ? E.getPath("userData") : process.cwd(), t = m.join(e, "documents");
    return g.existsSync(t) || g.mkdirSync(t, { recursive: !0 }), t;
  } catch {
    const e = m.join(process.cwd(), "storage", "documents");
    return g.existsSync(e) || g.mkdirSync(e, { recursive: !0 }), e;
  }
}
function G(n) {
  return n.length === 1 && Array.isArray(n[0]) ? n[0] : n;
}
function Ge(n) {
  return new Promise((e, t) => {
    const a = new $e.Database(n, (r) => {
      r ? t(r) : e(a);
    });
  });
}
function Ye(n) {
  let e = Promise.resolve();
  const t = (a) => new Promise((r, o) => {
    n.exec(a, (c) => {
      c ? o(c) : r();
    });
  });
  return {
    prepare(a) {
      return {
        all(...r) {
          const o = G(r);
          return new Promise((c, i) => {
            const s = n.prepare(a, (p) => {
              if (p) {
                i(p);
                return;
              }
              s.all(o, (y, h) => {
                s.finalize((L) => {
                  y || L ? i(y || L) : c(h);
                });
              });
            });
          });
        },
        get(...r) {
          const o = G(r);
          return new Promise((c, i) => {
            const s = n.prepare(a, (p) => {
              if (p) {
                i(p);
                return;
              }
              s.get(o, (y, h) => {
                s.finalize((L) => {
                  y || L ? i(y || L) : c(h);
                });
              });
            });
          });
        },
        run(...r) {
          const o = G(r);
          return new Promise((c, i) => {
            const s = n.prepare(a, (p) => {
              if (p) {
                i(p);
                return;
              }
              s.run(o, function(y) {
                s.finalize((h) => {
                  y || h ? i(y || h) : c({ lastInsertRowid: this.lastID, changes: this.changes });
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
      let r;
      const o = e;
      e = new Promise((c) => {
        r = c;
      }), await o;
      try {
        await t("BEGIN TRANSACTION;");
        const c = await a();
        return await t("COMMIT;"), c;
      } catch (c) {
        try {
          await t("ROLLBACK;");
        } catch (i) {
          console.error("[SQLite] Error revirtiendo transacción:", i);
        }
        throw c;
      } finally {
        r();
      }
    },
    async close() {
      await e, await new Promise((a) => {
        n.close((r) => {
          r && console.error("[SQLite] Error cerrando la base de datos:", r), a();
        });
      });
    }
  };
}
async function Ke(n) {
  if (v) return v;
  const e = He(), t = m.dirname(e);
  g.mkdirSync(t, { recursive: !0 });
  const a = await Ge(e), r = Ye(a);
  try {
    await r.pragma("foreign_keys = ON"), await je(r);
  } catch (o) {
    throw await r.close(), o;
  }
  return console.log("[SQLite] Base de datos inicializada y conectada en:", e), v = r, v;
}
function d() {
  if (!v)
    throw new Error("[SQLite] La base de datos no ha sido inicializada. Asegúrate de llamar a initDatabase() primero.");
  return v;
}
async function qe() {
  if (!v) return;
  const n = v;
  v = null, await n.close();
}
function Qe(n, e) {
  const t = !E.isPackaged || !!process.env.VITE_DEV_SERVER_URL;
  return [
    // 1. Menú de la Aplicación (App Menu)
    {
      label: E.name || "Contact Library",
      submenu: [
        {
          role: "about",
          label: `Acerca de ${E.name || "Contact Library"}`
        },
        { type: "separator" },
        {
          label: "Ajustes del Sistema...",
          accelerator: "CmdOrCtrl+,",
          click: () => {
            const a = n();
            a && !a.isDestroyed() && a.webContents.send("app:navigate", "/settings/");
          }
        },
        { type: "separator" },
        {
          role: "services",
          label: "Servicios"
        },
        { type: "separator" },
        {
          role: "hide",
          label: `Ocultar ${E.name || "Contact Library"}`
        },
        {
          role: "hideOthers",
          label: "Ocultar otros"
        },
        {
          role: "unhide",
          label: "Mostrar todo"
        },
        { type: "separator" },
        {
          role: "quit",
          label: `Salir de ${E.name || "Contact Library"}`
        }
      ]
    },
    // 2. Menú de Edición (Edit Menu) - Fundamental para que funcionen los atajos en inputs
    {
      label: "Edición",
      submenu: [
        { role: "undo", label: "Deshacer" },
        { role: "redo", label: "Rehacer" },
        { type: "separator" },
        { role: "cut", label: "Cortar" },
        { role: "copy", label: "Copiar" },
        { role: "paste", label: "Pegar" },
        { role: "selectAll", label: "Seleccionar todo" }
      ]
    },
    // 3. Menú de Visualización (View Menu)
    {
      label: "Visualización",
      submenu: [
        { role: "reload", label: "Recargar" },
        { role: "forceReload", label: "Forzar recarga" },
        ...t ? [
          {
            role: "toggleDevTools",
            label: "Herramientas de Desarrollador"
          }
        ] : [],
        { type: "separator" },
        { role: "resetZoom", label: "Tamaño real" },
        { role: "zoomIn", label: "Acercar" },
        { role: "zoomOut", label: "Alejar" },
        { type: "separator" },
        { role: "togglefullscreen", label: "Pantalla completa" }
      ]
    },
    // 4. Menú de Ventana (Window Menu)
    {
      label: "Ventana",
      submenu: [
        { role: "minimize", label: "Minimizar" },
        { role: "zoom", label: "Zoom" },
        { type: "separator" },
        { role: "front", label: "Traer todo al frente" }
      ]
    }
  ];
}
function Je(n, e) {
  if (process.platform === "darwin") {
    const t = Qe(n), a = P.buildFromTemplate(t);
    P.setApplicationMenu(a);
  } else
    P.setApplicationMenu(null);
}
const Ze = {
  calendar: "/calendar/",
  hearing: "/calendar/",
  payment: "/pagos/",
  system: "/"
};
function re(n, ...e) {
  return [n, ...e.map((t) => String(t).replace(/:/g, "_"))].join(":");
}
const et = {
  calendarEvent: "/calendar/",
  hearing: "/calendar/",
  client: "/cliente/",
  payment: "/pagos/"
}, tt = {
  calendarAlerts: !0,
  hearingAlerts: !0,
  paymentReminders: !0,
  sound: !0
};
function nt(n) {
  const { target: e } = n, t = n.route ?? (e ? et[e.type] : Ze[n.kind]);
  return e ? { route: t, target: e } : { route: t };
}
let I = null;
function at(n) {
  I = n;
}
function Ae() {
  var n;
  return ((n = I == null ? void 0 : I.getPreferences) == null ? void 0 : n.call(I)) ?? tt;
}
function rt(n) {
  if (!I)
    return console.warn("[Notifications] Servicio no inicializado; se descarta:", n.id), !1;
  const { adapter: e, onOpen: t, navigate: a } = I;
  if (!e.isSupported()) return !1;
  const r = nt(n);
  return e.show(n, {
    silent: !Ae().sound,
    onClick: () => {
      t(), a(r);
    }
  }), !0;
}
function ot() {
  I == null || I.adapter.dispose(), I = null;
}
const it = 30;
async function st(n) {
  if (n.length === 0) return /* @__PURE__ */ new Set();
  const e = n.map(() => "?").join(", "), t = await d().prepare(`SELECT id FROM notification_log WHERE id IN (${e})`).all(...n);
  return new Set(t.map((a) => a.id));
}
async function ct(n) {
  await d().prepare("INSERT OR IGNORE INTO notification_log (id, kind) VALUES (?, ?)").run(n.id, n.kind);
}
async function lt(n = it) {
  return (await d().prepare("DELETE FROM notification_log WHERE sent_at < datetime('now', ?)").run(`-${n} days`)).changes;
}
const ut = 6e4, dt = 15, Se = /* @__PURE__ */ new Map();
let B = null, Q = null, C = null, U = null, Y = !1;
function K(n) {
  Se.set(n.kind, n);
}
function pt(n = {}) {
  B || (C = {
    intervalMs: n.intervalMs ?? ut,
    catchUpMinutes: n.catchUpMinutes ?? dt,
    now: n.now ?? (() => /* @__PURE__ */ new Date())
  }, Q = null, lt().catch((e) => {
    console.error("[Notifications] No se pudo limpiar el registro de notificaciones:", e);
  }), J(), B = setInterval(() => void J(), C.intervalMs));
}
function mt() {
  B && clearInterval(B), B = null, C = null;
}
function J() {
  return C ? U ? (Y = !0, U) : (U = (async () => {
    do
      Y = !1, await Et();
    while (Y && C);
  })().finally(() => {
    U = null;
  }), U) : Promise.resolve();
}
async function Et() {
  if (!C) return;
  const n = C.now(), e = Tt(n, Q, C.catchUpMinutes);
  if (Q = n, !e) return;
  const t = await ft(e);
  if (t.length === 0) return;
  let a;
  try {
    a = await st(t.map((r) => r.id));
  } catch (r) {
    console.error("[Notifications] No se pudo leer el registro de enviados:", r);
    return;
  }
  for (const r of t)
    if (!a.has(r.id) && rt(r))
      try {
        await ct(r);
      } catch (o) {
        console.error(`[Notifications] No se pudo registrar "${r.id}":`, o);
      }
}
function Tt(n, e, t) {
  const a = new Date(n.getTime() - t * 6e4);
  return e && e.getTime() > n.getTime() ? null : { from: e && e > a ? e : a, to: n };
}
async function ft(n) {
  const e = Ae(), t = [...Se.values()].filter((o) => o.isEnabled(e)), a = await Promise.all(
    t.map(async (o) => {
      try {
        return await o.getDue(n);
      } catch (c) {
        return console.error(`[Notifications] Error en el proveedor "${o.kind}":`, c), [];
      }
    })
  ), r = /* @__PURE__ */ new Map();
  for (const o of a.flat()) r.set(o.id, o);
  return [...r.values()];
}
const gt = 50;
class oe {
  constructor(e = process.platform) {
    j(this, "platform");
    /** Notificaciones vivas, en orden de creación (la más antigua primero). */
    j(this, "tracked", /* @__PURE__ */ new Set());
    this.platform = e;
  }
  isSupported() {
    return ue.isSupported();
  }
  show(e, t) {
    if (!this.isSupported()) return;
    const a = new ue(this.buildOptions(e, t));
    this.track(a), a.on("click", () => {
      this.release(a), t.onClick();
    }), a.on("failed", (r, o) => {
      this.release(a), console.error(`[Notifications] No se pudo mostrar "${e.id}":`, o);
    }), a.show();
  }
  dispose() {
    for (const e of this.tracked)
      e.removeAllListeners(), e.close();
    this.tracked.clear();
  }
  /**
   * Traduce la notificación genérica a opciones de Electron.
   * Las subclases llaman a `super.buildOptions()` y añaden sus particularidades.
   */
  buildOptions(e, t) {
    return {
      title: e.title,
      body: e.body,
      silent: t.silent,
      // Windows/Linux: 'never' mantiene el aviso en pantalla hasta que el usuario lo cierre.
      timeoutType: e.urgent ? "never" : "default"
    };
  }
  // No se libera en el evento 'close': en Windows se emite cuando el aviso pasa al
  // Centro de actividades, y desde ahí el usuario todavía puede hacer clic.
  track(e) {
    if (this.tracked.add(e), this.tracked.size > gt) {
      const t = this.tracked.values().next().value;
      t && this.release(t);
    }
  }
  release(e) {
    e.removeAllListeners(), this.tracked.delete(e);
  }
}
class yt extends oe {
  constructor() {
    super("darwin");
  }
}
class _t extends oe {
  constructor(t = {}) {
    super("win32");
    j(this, "iconPath");
    this.iconPath = t.iconPath;
  }
  buildOptions(t, a) {
    return {
      ...super.buildOptions(t, a),
      icon: this.iconPath
    };
  }
}
function Nt(n = {}) {
  const { platform: e = process.platform, iconPath: t } = n;
  switch (e) {
    case "win32":
      return new _t({ iconPath: t });
    case "darwin":
      return new yt();
    default:
      return new oe(e);
  }
}
const X = "Contact Library", ht = "cl.contactlibrary.desktop", At = ["YourAppName", "contact_library_electron"], $ = "contact_library.db", St = [
  $,
  `${$}-wal`,
  `${$}-shm`,
  "documents",
  "Local Storage"
];
function It() {
  try {
    const n = E.getPath("userData");
    if (g.existsSync(m.join(n, $))) return null;
    const e = E.getPath("appData");
    for (const t of At) {
      const a = m.join(e, t);
      if (m.resolve(a) !== m.resolve(n) && g.existsSync(m.join(a, $))) {
        g.mkdirSync(n, { recursive: !0 });
        for (const r of St) {
          const o = m.join(a, r);
          g.existsSync(o) && g.cpSync(o, m.join(n, r), { recursive: !0, force: !0 });
        }
        return console.log(`[UserData] Datos migrados desde "${a}" a "${n}"`), a;
      }
    }
  } catch (n) {
    console.error("[UserData] No se pudieron migrar los datos de la carpeta anterior:", n);
  }
  return null;
}
const ie = {
  minimizeToTray: !0,
  calendarAlerts: !0,
  hearingAlerts: !0,
  paymentReminders: !0,
  soundEffects: !0
}, Z = Object.keys(ie);
function Ie() {
  return ie;
}
function ee(n) {
  for (const e of Z) {
    const t = n[e];
    typeof t == "boolean" && (ie[e] = t);
  }
}
async function Lt() {
  try {
    const n = Z.map(() => "?").join(", "), e = await d().prepare(`SELECT key, value FROM settings WHERE key IN (${n})`).all(...Z), t = {};
    for (const a of e)
      try {
        t[a.key] = JSON.parse(a.value);
      } catch {
        t[a.key] = a.value;
      }
    ee(t);
  } catch (n) {
    console.error("[System] No se pudieron cargar las preferencias del sistema:", n);
  }
}
let A = null, Ee = !1;
function Rt(n) {
  const e = m.join(n, "tray");
  if (process.platform === "darwin") {
    const a = de.createFromPath(m.join(e, "trayTemplate.png"));
    return a.setTemplateImage(!0), a;
  }
  const t = process.platform === "win32" ? "tray.ico" : "tray.png";
  return de.createFromPath(m.join(e, t));
}
function bt({ publicDir: n, onOpen: e, onQuit: t }) {
  if (A) return A;
  const a = Rt(n);
  return a.isEmpty() ? (console.error("[Tray] No se encontró el icono de bandeja en", m.join(n, "tray")), null) : (A = new Ue(a), A.setToolTip(X), A.setContextMenu(
    P.buildFromTemplate([
      { label: `Abrir ${X}`, click: e },
      { type: "separator" },
      { label: "Salir", click: t }
    ])
  ), process.platform !== "darwin" && A.on("click", e), A);
}
function Le() {
  return A !== null && !A.isDestroyed();
}
function wt() {
  process.platform !== "win32" || Ee || !Le() || (Ee = !0, A == null || A.displayBalloon({
    title: X,
    content: "La aplicación sigue ejecutándose en segundo plano. Haz clic en el icono para abrirla.",
    iconType: "info"
  }));
}
function vt() {
  A && !A.isDestroyed() && A.destroy(), A = null;
}
const b = (n, e) => `rgba(${n}, ${e})`, z = (n) => `#${n.split(",").map((e) => Number(e.trim()).toString(16).padStart(2, "0")).join("")}`, w = {
  primary: "0, 122, 255",
  success: "52, 199, 89",
  warning: "255, 149, 0",
  danger: "255, 59, 48",
  neutral: "142, 142, 147"
}, Te = "0, 0, 0", q = "255, 255, 255", Ot = "245, 245, 247", te = {
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
  borderDanger: "var(--macos-danger-border, rgba(255, 59, 48, 0.25))",
  selection: "var(--macos-hover-bg, rgba(0, 0, 0, 0.04))",
  dangerSurface: "var(--macos-danger-surface, rgba(255, 59, 48, 0.10))",
  iconMuted: "#c7c7cc",
  // Overlays y bordes translúcidos
  cardBorder: b(Te, 0.05),
  glassBorder: b(Te, 0.06),
  glassSurface: b(Ot, 0.65),
  whiteOverlay: b(q, 0.2),
  whiteTextMuted: b(q, 0.9),
  whiteTextFaint: b(q, 0.6),
  // Tints derivados de APP_COLOR_RGB
  primaryTint: "var(--macos-accent-tint-subtle, rgba(0, 122, 255, 0.08))",
  primaryStatusTint: "var(--macos-accent-tint-status, rgba(0, 122, 255, 0.1))",
  neutralTint: b(w.neutral, 0.1),
  successTint: b(w.success, 0.1),
  warningTint: b(w.warning, 0.1),
  // Colores semánticos derivados del RGB base
  primary: "var(--macos-accent-color, #0056b8)",
  onPrimary: "var(--macos-on-accent, #ffffff)",
  success: z(w.success),
  warning: z(w.warning),
  danger: z(w.danger),
  neutral: z(w.neutral),
  // Variantes del primario
  primaryStrong: "var(--macos-accent-color, #0a84ff)",
  primaryLight: "var(--macos-accent-color, #30b0ff)"
}, Ct = {
  "--f7-page-bg-color": "var(--macos-canvas-bg, #f5f5f7)",
  "--f7-bars-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-navbar-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-toolbar-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-card-bg-color": "transparent",
  "--f7-list-strong-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-list-bg-color": "var(--macos-card-bg, #ffffff)"
}, Dt = () => {
  const n = {
    "--f7-theme-color": te.primary,
    "--f7-theme-color-rgb": w.primary
  };
  for (const [t, a] of Object.entries(te))
    n[`--app-color-${t}`] = a;
  for (const [t, a] of Object.entries(w))
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
  for (const [t, a] of Object.entries(Ct))
    n[t] = String(a);
  return n;
};
Dt();
const T = {
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
  APP_GET_PLATFORM: "app:getPlatform",
  APP_SET_THEME: "app:setTheme",
  /** Main → Renderer: abrir una sección o un elemento concreto (payload: NavigationRequest). */
  APP_NAVIGATE: "app:navigate"
};
function _(n) {
  return { success: !0, data: n };
}
function u(n) {
  return { success: !1, error: n instanceof Error ? n.message : String(n) };
}
function Mt(n) {
  n.webContents.on("context-menu", (e, t) => {
    const { isEditable: a, selectionText: r } = t;
    a ? P.buildFromTemplate([
      { role: "undo", label: "Deshacer" },
      { role: "redo", label: "Rehacer" },
      { type: "separator" },
      { role: "cut", label: "Cortar" },
      { role: "copy", label: "Copiar" },
      { role: "paste", label: "Pegar" },
      { type: "separator" },
      { role: "selectAll", label: "Seleccionar todo" }
    ]).popup({ window: n }) : r && r.trim().length > 0 && P.buildFromTemplate([
      { role: "copy", label: "Copiar" },
      { role: "selectAll", label: "Seleccionar todo" }
    ]).popup({ window: n });
  });
}
let f = null, Re = !1;
function se() {
  Re = !0;
}
function R() {
  return f && !f.isDestroyed() ? f : null;
}
function ne() {
  const n = R();
  n && (n.isMinimized() && n.restore(), n.isVisible() || n.show(), n.focus());
}
function Pt(n) {
  const e = R();
  if (!e) return;
  const t = () => e.webContents.send(T.APP_NAVIGATE, n);
  e.webContents.isLoading() ? e.webContents.once("did-finish-load", t) : t();
}
function Ut(n) {
  const e = process.platform === "darwin";
  return f = new xe({
    width: 1320,
    height: 820,
    minWidth: 1e3,
    minHeight: 640,
    frame: !1,
    autoHideMenuBar: !0,
    titleBarStyle: e ? "hidden" : "default",
    trafficLightPosition: e ? { x: 18, y: 18 } : void 0,
    vibrancy: e ? "sidebar" : void 0,
    visualEffectState: e ? "active" : void 0,
    show: !1,
    backgroundColor: te.background,
    // En macOS el icono lo define el bundle (.icns); este se usa en Windows/Linux.
    icon: m.join(n.publicDir, "icon.png"),
    webPreferences: {
      preload: n.preloadPath
    }
  }), e || f.setMenu(null), Mt(f), f.once("ready-to-show", () => {
    f == null || f.show();
  }), f.on("close", (t) => {
    var a;
    Re || Ie().minimizeToTray && n.canHideToBackground() && (t.preventDefault(), f == null || f.hide(), (a = n.onHiddenToBackground) == null || a.call(n));
  }), f.on("session-end", () => {
    se();
  }), f.on("closed", () => {
    f = null;
  }), f.webContents.on("did-finish-load", () => {
    f == null || f.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), n.devServerUrl ? f.loadURL(n.devServerUrl) : f.loadFile(m.join(n.rendererDist, "index.html")), f;
}
function Ft() {
  const n = () => {
    var a;
    return (a = R()) == null ? void 0 : a.minimize();
  }, e = () => {
    const a = R();
    a && (a.isMaximized() ? a.restore() : a.maximize());
  }, t = () => {
    var a;
    return (a = R()) == null ? void 0 : a.close();
  };
  l.on(T.WINDOW_MINIMIZE, n), l.on(T.WINDOW_MAXIMIZE, e), l.on(T.WINDOW_CLOSE, t), l.handle(T.APP_GET_PLATFORM, () => _(process.platform)), l.on(T.APP_SET_THEME, (a, r) => {
    Fe.themeSource = r != null && r.isDark ? "dark" : "light";
    const o = R();
    o && (r != null && r.backgroundColor) && /^#[0-9a-fA-F]{6}$/.test(r.backgroundColor) && o.setBackgroundColor(r.backgroundColor);
  }), l.on("window-minimize", n), l.on("window-maximize", e), l.on("window-close", t), l.handle("get-platform", () => process.platform);
}
class xt {
  toEntity(e) {
    return {
      id: e.id,
      title: e.title,
      date: e.date,
      startTime: e.start_time,
      endTime: e.end_time,
      colorId: e.color_id || "blue",
      // 0 significa "Sin aviso": no debe reemplazarse por el valor por defecto (antes se usaba `|| 15`).
      alarmMinutes: Number.isFinite(Number(e.alarm_minutes)) ? Number(e.alarm_minutes) : 15,
      clientId: e.client_id,
      details: e.details || ""
    };
  }
  async getAll(e) {
    const t = d(), a = [], r = [];
    if (e != null && e.startDate && (a.push("date >= ?"), r.push(e.startDate)), e != null && e.endDate && (a.push("date <= ?"), r.push(e.endDate)), e != null && e.clientId && (a.push("client_id = ?"), r.push(e.clientId)), e != null && e.search && e.search.trim() !== "") {
      const i = `%${e.search.trim().toLowerCase()}%`;
      a.push("(LOWER(title) LIKE ? OR LOWER(details) LIKE ?)"), r.push(i, i);
    }
    let o = "SELECT * FROM calendar_events";
    return a.length > 0 && (o += ` WHERE ${a.join(" AND ")}`), o += " ORDER BY date ASC, start_time ASC", (await t.prepare(o).all(...r)).map((i) => this.toEntity(i));
  }
  async getByDateRange(e, t) {
    return this.getAll({ startDate: e, endDate: t });
  }
  async getById(e) {
    const a = await d().prepare("SELECT * FROM calendar_events WHERE id = ?").get(e);
    return a ? this.toEntity(a) : null;
  }
  async create(e) {
    const t = d(), a = e.id || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
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
    const r = await this.getById(a);
    if (!r)
      throw new Error(`Error al persistir evento de calendario con id ${a}`);
    return r;
  }
  async update(e, t) {
    const a = d(), r = await a.prepare("SELECT * FROM calendar_events WHERE id = ?").get(e);
    if (!r)
      throw new Error(`Evento con id ${e} no encontrado`);
    const o = t.title !== void 0 ? t.title : r.title, c = t.date !== void 0 ? t.date : r.date, i = t.startTime !== void 0 ? t.startTime : r.start_time, s = t.endTime !== void 0 ? t.endTime : r.end_time, p = t.colorId !== void 0 ? t.colorId : r.color_id, y = t.alarmMinutes !== void 0 ? t.alarmMinutes : r.alarm_minutes, h = t.clientId !== void 0 ? t.clientId : r.client_id, L = t.details !== void 0 ? t.details : r.details;
    await a.prepare(`
      UPDATE calendar_events
      SET title = ?, date = ?, start_time = ?, end_time = ?, color_id = ?, alarm_minutes = ?, client_id = ?, details = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      o,
      c,
      i,
      s,
      p,
      y,
      h,
      L,
      e
    );
    const D = await this.getById(e);
    if (!D)
      throw new Error(`Error al recuperar evento actualizado con id ${e}`);
    return D;
  }
  async delete(e) {
    return (await d().prepare("DELETE FROM calendar_events WHERE id = ?").run(e)).changes > 0;
  }
  /**
   * Obtiene eventos que ocurrirán en la fecha y hora indicadas con control de alarmas.
   */
  async getUpcomingAlerts(e, t) {
    return (await d().prepare(`
      SELECT * FROM calendar_events
      WHERE date = ? AND start_time >= ?
      ORDER BY start_time ASC
    `).all(e, t)).map((o) => this.toEntity(o));
  }
  /**
   * Reemplaza todos los eventos en una sola transacción (sincronización completa desde la UI).
   * Si cualquier inserción falla, se revierte también el borrado.
   */
  async replaceAll(e) {
    const t = d();
    await t.transaction(async () => {
      await t.prepare("DELETE FROM calendar_events").run();
      const a = t.prepare(`
        INSERT INTO calendar_events (id, title, date, start_time, end_time, color_id, alarm_minutes, client_id, details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const r of e)
        await a.run(
          r.id,
          r.title,
          r.date,
          r.startTime,
          r.endTime,
          r.colorId || "blue",
          r.alarmMinutes ?? 15,
          r.clientId ?? null,
          r.details || ""
        );
    });
  }
}
const F = new xt();
function Bt() {
  l.handle(
    T.CALENDAR_LIST,
    async () => {
      try {
        return _(await F.getAll());
      } catch (n) {
        return u(n);
      }
    }
  ), l.handle(
    T.CALENDAR_SAVE_ALL,
    async (n, e) => {
      try {
        return Array.isArray(e) ? (await F.replaceAll(e), _(!0)) : u("Se esperaba una lista de eventos de calendario.");
      } catch (t) {
        return u(t);
      }
    }
  ), l.handle("db:calendar:getAll", () => F.getAll()), l.handle("db:calendar:saveAll", async (n, e) => (await F.replaceAll(e), !0));
}
class $t {
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
  /** Casos con audiencia programada, junto al nombre del cliente (para notificaciones). */
  async getScheduledHearings() {
    return (await d().prepare(`
      SELECT c.client_id, cl.name AS client_name, c.expediente, c.juzgado, c.proxima_audiencia
      FROM cases c
      JOIN clients cl ON cl.id = c.client_id
      WHERE c.proxima_audiencia IS NOT NULL AND TRIM(c.proxima_audiencia) != ''
    `).all()).map((a) => ({
      clientId: a.client_id,
      clientName: a.client_name,
      expediente: a.expediente,
      juzgado: a.juzgado,
      proximaAudiencia: a.proxima_audiencia
    }));
  }
  async getByClientId(e) {
    const a = await d().prepare("SELECT * FROM cases WHERE client_id = ?").get(e);
    return a ? this.toEntity(a) : null;
  }
  async upsert(e, t) {
    const a = d();
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
    const o = await this.getByClientId(e);
    if (!o)
      throw new Error(`Error al persistir expediente judicial para el cliente ${e}`);
    return o;
  }
  async updateStatus(e, t) {
    return (await d().prepare(`
      UPDATE cases
      SET estado = ?, updated_at = CURRENT_TIMESTAMP
      WHERE client_id = ?
    `).run(t, e)).changes > 0;
  }
  async deleteByClientId(e) {
    return (await d().prepare("DELETE FROM cases WHERE client_id = ?").run(e)).changes > 0;
  }
}
const O = new $t();
function kt(n) {
  return n.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").replace(/\s+/g, "_").trim();
}
const M = {
  getStorageDir() {
    return Ve();
  },
  getAbsolutePath(n) {
    return m.join(this.getStorageDir(), n);
  },
  async saveDocumentFile(n, e, t) {
    const a = this.getStorageDir(), r = m.join(a, String(n));
    g.existsSync(r) || await g.promises.mkdir(r, { recursive: !0 });
    const o = kt(e) || "documento.pdf", c = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, i = `${c}_${o}`, s = m.join(r, i), p = `${n}/${i}`;
    await g.promises.writeFile(s, t);
    const y = await g.promises.stat(s);
    return {
      id: c,
      clientId: n,
      name: e,
      fileName: i,
      relativePath: p,
      size: y.size,
      mimeType: e.toLowerCase().endsWith(".pdf") ? "application/pdf" : "application/octet-stream",
      uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  },
  async deleteDocumentFile(n) {
    try {
      const e = this.getAbsolutePath(n);
      return g.existsSync(e) ? (await g.promises.unlink(e), !0) : !1;
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
      if (!g.existsSync(e))
        return { success: !1, error: "El archivo no existe en el disco." };
      const t = await pe.openPath(e);
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
      return g.existsSync(e) ? (pe.showItemInFolder(e), !0) : !1;
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
      return g.existsSync(e) ? `data:application/pdf;base64,${(await g.promises.readFile(e)).toString("base64")}` : null;
    } catch (e) {
      return console.error("[DocumentStorage] Error al leer archivo en base64:", e), null;
    }
  }
};
class jt {
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
    return (await d().prepare("SELECT * FROM documents WHERE client_id = ? ORDER BY uploaded_at DESC").all(e)).map((r) => this.toEntity(r));
  }
  async getById(e) {
    const a = await d().prepare("SELECT * FROM documents WHERE id = ?").get(e);
    return a ? this.toEntity(a) : null;
  }
  /**
   * Guarda físicamente el archivo en disco (userData/documents/{clientId}) y registra sus metadatos en SQLite.
   * Si la inserción en la base de datos falla, elimina el archivo físico para evitar residuos.
   */
  async saveDocument(e, t, a) {
    const r = d(), o = await M.saveDocumentFile(e, t, a);
    try {
      return await r.prepare(`
        INSERT INTO documents (id, client_id, name, file_name, relative_path, size, mime_type, uploaded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        o.id,
        e,
        o.name,
        o.fileName,
        o.relativePath,
        o.size,
        o.mimeType,
        o.uploadedAt
      ), {
        id: o.id,
        clientId: e,
        name: o.name,
        fileName: o.fileName,
        relativePath: o.relativePath,
        size: o.size,
        mimeType: o.mimeType,
        uploadedAt: o.uploadedAt
      };
    } catch (c) {
      throw await M.deleteDocumentFile(o.relativePath), c;
    }
  }
  /**
   * Registra metadata de un documento que ya fue guardado o importado físicamente
   */
  async registerDocumentMetadata(e, t, a, r, o, c, i = "application/pdf", s = (/* @__PURE__ */ new Date()).toISOString()) {
    return await d().prepare(`
      INSERT OR REPLACE INTO documents (id, client_id, name, file_name, relative_path, size, mime_type, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(e, t, a, r, o, c, i, s), {
      id: e,
      clientId: t,
      name: a,
      fileName: r,
      relativePath: o,
      size: c,
      mimeType: i,
      uploadedAt: s
    };
  }
  /**
   * Elimina el documento de la base de datos y borra físicamente el archivo del disco.
   */
  async deleteDocument(e) {
    const t = d(), a = await this.getById(e);
    return a ? (await t.prepare("DELETE FROM documents WHERE id = ?").run(e), await M.deleteDocumentFile(a.relativePath), !0) : !1;
  }
  /**
   * Limpia todos los archivos físicos de un cliente en disco.
   * Utilizado cuando se elimina un cliente o su carpeta.
   */
  async cleanClientStorageFolder(e) {
    try {
      const t = M.getStorageDir(), a = m.join(t, String(e));
      g.existsSync(a) && await g.promises.rm(a, { recursive: !0, force: !0 });
    } catch (t) {
      console.error(`[DocumentRepository] Error al limpiar directorio del cliente ${e}:`, t);
    }
  }
  /**
   * Abre el archivo con Vista Previa (o la app predeterminada en macOS).
   */
  async openDocument(e) {
    const t = await this.getById(e);
    return t ? M.openDocumentWithSystem(t.relativePath) : { success: !1, error: "Documento no encontrado" };
  }
  /**
   * Revela el archivo en Finder.
   */
  async showInFinder(e) {
    const t = await this.getById(e);
    return t ? M.showInFinder(t.relativePath) : !1;
  }
  /**
   * Obtiene contenido en base64 para previsualización web.
   */
  async getBase64(e) {
    const t = await this.getById(e);
    return t ? M.readAsBase64(t.relativePath) : null;
  }
}
const S = new jt();
class zt {
  formatClient(e, t, a, r) {
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
      documentos: (a || []).map((o) => ({
        id: o.id,
        name: o.name,
        dataUrl: "",
        size: o.size,
        uploadedAt: o.uploadedAt
      })),
      pago: r ?? void 0
    };
  }
  async getAll(e) {
    const t = d(), a = [], r = [];
    if (e != null && e.search && e.search.trim() !== "") {
      const s = `%${e.search.trim().toLowerCase()}%`;
      a.push("(LOWER(name) LIKE ? OR LOWER(rut) LIKE ? OR phone LIKE ?)"), r.push(s, s, s);
    }
    e != null && e.status && (a.push("status = ?"), r.push(e.status));
    let o = "SELECT * FROM clients";
    a.length > 0 && (o += ` WHERE ${a.join(" AND ")}`), o += " ORDER BY id ASC", e != null && e.limit && (o += ` LIMIT ${Number(e.limit)}`, e != null && e.offset && (o += ` OFFSET ${Number(e.offset)}`));
    const c = await t.prepare(o).all(...r), i = [];
    for (const s of c) {
      const [p, y, h] = await Promise.all([
        O.getByClientId(s.id),
        S.getByClientId(s.id),
        this.getLatestPaymentInfo(s.id)
      ]);
      i.push(this.formatClient(s, p, y, h));
    }
    return i;
  }
  async getById(e) {
    const a = await d().prepare("SELECT * FROM clients WHERE id = ?").get(e);
    if (!a) return null;
    const [r, o, c] = await Promise.all([
      O.getByClientId(e),
      S.getByClientId(e),
      this.getLatestPaymentInfo(e)
    ]);
    return this.formatClient(a, r, o, c);
  }
  async create(e) {
    const t = d();
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
      ), r = Number(a.lastInsertRowid);
      let o = null;
      return e.caso && (o = await O.upsert(r, {
        expediente: e.caso.expediente,
        juzgado: e.caso.juzgado,
        materia: e.caso.materia,
        estado: e.caso.estado,
        proximaAudiencia: e.caso.proximaAudiencia
      })), {
        id: r,
        name: e.name,
        phone: e.phone,
        email: e.email,
        rut: e.rut,
        status: e.status || "activo",
        caso: o ? {
          expediente: o.expediente,
          juzgado: o.juzgado,
          materia: o.materia,
          estado: o.estado,
          proximaAudiencia: o.proximaAudiencia
        } : void 0,
        documentos: []
      };
    });
  }
  async update(e, t) {
    const a = d(), r = await a.prepare("SELECT * FROM clients WHERE id = ?").get(e);
    if (!r)
      throw new Error(`Cliente con id ${e} no encontrado`);
    await a.transaction(async () => {
      const c = t.name !== void 0 ? t.name : r.name, i = t.phone !== void 0 ? t.phone : r.phone, s = t.email !== void 0 ? t.email : r.email, p = t.rut !== void 0 ? t.rut : r.rut, y = t.status !== void 0 ? t.status : r.status;
      await a.prepare(`
        UPDATE clients
        SET name = ?, phone = ?, email = ?, rut = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        c,
        i,
        s || null,
        p || null,
        y,
        e
      ), t.caso && await O.upsert(e, {
        expediente: t.caso.expediente,
        juzgado: t.caso.juzgado,
        materia: t.caso.materia,
        estado: t.caso.estado,
        proximaAudiencia: t.caso.proximaAudiencia
      });
    });
    const o = await this.getById(e);
    if (!o)
      throw new Error(`Error al recuperar cliente actualizado con id ${e}`);
    return o;
  }
  async delete(e) {
    const t = d();
    return await t.transaction(async () => {
      await t.prepare("DELETE FROM clients WHERE id = ?").run(e);
    }), await S.cleanClientStorageFolder(e), !0;
  }
  async getLatestPaymentInfo(e) {
    const a = await d().prepare("SELECT amount, concept, date, status FROM payments WHERE client_id = ? ORDER BY date DESC LIMIT 1").get(e);
    return a ? {
      monto: a.amount,
      concepto: a.concept,
      fecha: a.date,
      estado: a.status
    } : null;
  }
}
const N = new zt();
function Wt() {
  l.handle(
    T.CLIENTS_LIST,
    async (n, e) => {
      try {
        const t = await N.getAll(e);
        return _(t);
      } catch (t) {
        return u(t);
      }
    }
  ), l.handle(
    T.CLIENTS_GET_BY_ID,
    async (n, e) => {
      try {
        if (typeof e != "number" || isNaN(e) || e <= 0)
          return u("ID de cliente inválido.");
        const t = await N.getById(e);
        return _(t);
      } catch (t) {
        return u(t);
      }
    }
  ), l.handle(
    T.CLIENTS_CREATE,
    async (n, e) => {
      var t, a;
      try {
        if (!e || typeof e != "object")
          return u("Los datos del cliente son requeridos.");
        if (!e.name || typeof e.name != "string" || e.name.trim() === "")
          return u("El nombre del cliente es obligatorio.");
        if (!e.phone || typeof e.phone != "string" || e.phone.trim() === "")
          return u("El teléfono del cliente es obligatorio.");
        const r = await N.create({
          name: e.name.trim(),
          phone: e.phone.trim(),
          email: ((t = e.email) == null ? void 0 : t.trim()) || void 0,
          rut: ((a = e.rut) == null ? void 0 : a.trim()) || void 0,
          status: e.status || "activo",
          caso: e.caso
        });
        return _(r);
      } catch (r) {
        return u(r);
      }
    }
  ), l.handle(
    T.CLIENTS_UPDATE,
    async (n, e, t) => {
      try {
        if (typeof e != "number" || isNaN(e) || e <= 0)
          return u("ID de cliente inválido para actualización.");
        if (!t || typeof t != "object")
          return u("Datos de actualización no proporcionados.");
        const a = await N.update(e, t);
        return _(a);
      } catch (a) {
        return u(a);
      }
    }
  ), l.handle(
    T.CLIENTS_DELETE,
    async (n, e) => {
      try {
        if (typeof e != "number" || isNaN(e) || e <= 0)
          return u("ID de cliente inválido para eliminación.");
        const t = await N.delete(e);
        return _(t);
      } catch (t) {
        return u(t);
      }
    }
  ), l.handle(
    T.CLIENTS_SAVE_ALL,
    async (n, e) => {
      try {
        if (!Array.isArray(e))
          return u("Se esperaba una lista de clientes.");
        for (const t of e)
          t.id ? await N.getById(t.id) ? await N.update(t.id, t) : await N.create(t) : await N.create(t);
        return _(!0);
      } catch (t) {
        return u(t);
      }
    }
  ), l.handle(
    T.CASES_GET_BY_CLIENT_ID,
    async (n, e) => {
      try {
        if (typeof e != "number" || isNaN(e) || e <= 0)
          return u("ID de cliente inválido.");
        const t = await O.getByClientId(e);
        return _(t);
      } catch (t) {
        return u(t);
      }
    }
  ), l.handle(
    T.CASES_UPSERT,
    async (n, e, t) => {
      try {
        if (typeof e != "number" || isNaN(e) || e <= 0)
          return u("ID de cliente inválido.");
        if (!t || typeof t != "object")
          return u("Datos de expediente requeridos.");
        const a = await O.upsert(e, t);
        return _(a);
      } catch (a) {
        return u(a);
      }
    }
  ), l.handle("db:clients:getAll", async (n, e) => N.getAll(e)), l.handle("db:clients:getById", async (n, e) => N.getById(e)), l.handle("db:clients:create", async (n, e) => N.create({
    name: e.name,
    phone: e.phone,
    email: e.email,
    rut: e.rut,
    status: e.status,
    caso: e.caso
  })), l.handle("db:clients:update", async (n, e, t) => N.update(e, t)), l.handle("db:clients:delete", async (n, e) => N.delete(e)), l.handle("db:clients:saveAll", async (n, e) => {
    for (const t of e)
      t.id ? await N.getById(t.id) ? await N.update(t.id, t) : await N.create(t) : await N.create(t);
    return !0;
  }), l.handle("db:cases:getByClientId", async (n, e) => O.getByClientId(e)), l.handle("db:cases:upsert", async (n, e, t) => O.upsert(e, t));
}
function Xt(n) {
  const e = n.indexOf(";base64,");
  if (e !== -1) {
    const t = n.substring(e + 8);
    return Buffer.from(t, "base64");
  }
  return Buffer.from(n);
}
function Ht() {
  l.handle(
    T.DOCUMENTS_GET_BY_CLIENT_ID,
    async (n, e) => {
      try {
        if (typeof e != "number" || isNaN(e))
          return u("El ID del cliente debe ser un número válido.");
        const a = (await S.getByClientId(e)).map((r) => ({
          id: r.id,
          name: r.name,
          dataUrl: "",
          size: r.size,
          uploadedAt: r.uploadedAt
        }));
        return _(a);
      } catch (t) {
        return u(t);
      }
    }
  ), l.handle(
    T.DOCUMENTS_UPLOAD,
    async (n, e) => {
      try {
        if (!e || typeof e.clientId != "number" || isNaN(e.clientId))
          return u("ID de cliente inválido para la subida de documento.");
        if (!e.name || typeof e.name != "string" || e.name.trim() === "")
          return u("El nombre del documento es obligatorio.");
        let t;
        if (e.fileBuffer)
          t = Buffer.from(e.fileBuffer);
        else if (e.dataUrl)
          t = Xt(e.dataUrl);
        else
          return u("Se debe proporcionar fileBuffer o dataUrl para el documento.");
        const a = await S.saveDocument(e.clientId, e.name.trim(), t), r = {
          id: a.id,
          name: a.name,
          dataUrl: e.dataUrl || "",
          size: a.size,
          uploadedAt: a.uploadedAt
        };
        return _(r);
      } catch (t) {
        return u(t);
      }
    }
  ), l.handle(
    T.DOCUMENTS_DELETE,
    async (n, e) => {
      try {
        if (!e || typeof e != "string")
          return u("ID de documento no válido.");
        const t = await S.deleteDocument(e);
        return _(t);
      } catch (t) {
        return u(t);
      }
    }
  ), l.handle(
    T.DOCUMENTS_OPEN,
    async (n, e) => {
      try {
        const t = typeof e == "string" ? e : e == null ? void 0 : e.id;
        if (!t)
          return u("ID de documento requerido para abrirlo.");
        const a = await S.openDocument(t);
        return a.success ? _(!0) : u(a.error ?? "No se pudo abrir el documento.");
      } catch (t) {
        return u(t);
      }
    }
  ), l.handle(
    T.DOCUMENTS_SHOW_IN_FINDER,
    async (n, e) => {
      try {
        if (!e || typeof e != "string")
          return u("ID de documento requerido.");
        const t = await S.showInFinder(e);
        return _(t);
      } catch (t) {
        return u(t);
      }
    }
  ), l.handle("db:documents:getByClientId", async (n, e) => S.getByClientId(e)), l.handle(
    "db:documents:upload",
    async (n, { clientId: e, originalName: t, fileBuffer: a }) => {
      const r = Buffer.from(a);
      return S.saveDocument(e, t, r);
    }
  ), l.handle("db:documents:delete", async (n, e) => S.deleteDocument(e)), l.handle("db:documents:open", async (n, e) => S.openDocument(e)), l.handle("db:documents:showInFinder", async (n, e) => S.showInFinder(e));
}
class Vt {
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
    const t = d(), a = [], r = [];
    if (e != null && e.clientId && (a.push("client_id = ?"), r.push(e.clientId)), e != null && e.status && (a.push("status = ?"), r.push(e.status)), e != null && e.startDate && (a.push("date >= ?"), r.push(e.startDate)), e != null && e.endDate && (a.push("date <= ?"), r.push(e.endDate)), e != null && e.search && e.search.trim() !== "") {
      const i = `%${e.search.trim().toLowerCase()}%`;
      a.push("(LOWER(client_name) LIKE ? OR LOWER(concept) LIKE ?)"), r.push(i, i);
    }
    let o = "SELECT * FROM payments";
    return a.length > 0 && (o += ` WHERE ${a.join(" AND ")}`), o += " ORDER BY date DESC, created_at DESC", (await t.prepare(o).all(...r)).map((i) => this.toEntity(i));
  }
  async getById(e) {
    const a = await d().prepare("SELECT * FROM payments WHERE id = ?").get(e);
    return a ? this.toEntity(a) : null;
  }
  async create(e) {
    const t = d(), a = e.id || `pay-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
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
    const r = await this.getById(a);
    if (!r)
      throw new Error(`Error al persistir pago ${a}`);
    return r;
  }
  async update(e, t) {
    const a = d(), r = await a.prepare("SELECT * FROM payments WHERE id = ?").get(e);
    if (!r)
      throw new Error(`Pago con id ${e} no encontrado`);
    const o = t.clientId !== void 0 ? t.clientId : r.client_id, c = t.client !== void 0 ? t.client : r.client_name, i = t.concept !== void 0 ? t.concept : r.concept, s = t.amount !== void 0 ? Number(t.amount) : r.amount, p = t.date !== void 0 ? t.date : r.date, y = t.status !== void 0 ? t.status : r.status;
    await a.prepare(`
      UPDATE payments
      SET client_id = ?, client_name = ?, concept = ?, amount = ?, date = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      o,
      c,
      i,
      s,
      p,
      y,
      e
    );
    const h = await this.getById(e);
    if (!h)
      throw new Error(`Error al recuperar pago actualizado con id ${e}`);
    return h;
  }
  async delete(e) {
    return (await d().prepare("DELETE FROM payments WHERE id = ?").run(e)).changes > 0;
  }
  /**
   * Cálculo de balance y resumen automático de pagos
   */
  async getSummary(e) {
    const t = d();
    let a = "SELECT amount, status FROM payments";
    const r = [];
    e && (a += " WHERE client_id = ?", r.push(e));
    const o = await t.prepare(a).all(...r);
    let c = 0, i = 0, s = 0, p = 0, y = 0, h = 0, L = 0;
    for (const D of o) {
      const k = Number(D.amount) || 0;
      c += k, D.status === "completed" ? (i += k, y++) : D.status === "pending" ? (s += k, h++) : D.status === "overdue" && (p += k, L++);
    }
    return {
      totalAmount: c,
      completedAmount: i,
      pendingAmount: s,
      overdueAmount: p,
      totalCount: o.length,
      completedCount: y,
      pendingCount: h,
      overdueCount: L
    };
  }
  /**
   * Reemplaza todos los pagos en una sola transacción (sincronización completa desde la UI).
   * Si cualquier inserción falla, se revierte también el borrado.
   */
  async replaceAll(e) {
    const t = d();
    await t.transaction(async () => {
      await t.prepare("DELETE FROM payments").run();
      const a = t.prepare(`
        INSERT INTO payments (id, client_id, client_name, concept, amount, date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const r of e)
        await a.run(
          r.id,
          r.clientId ?? null,
          r.client,
          r.concept,
          Number(r.amount),
          r.date,
          r.status
        );
    });
  }
}
const x = new Vt();
function Gt() {
  l.handle(
    T.PAYMENTS_LIST,
    async () => {
      try {
        return _(await x.getAll());
      } catch (n) {
        return u(n);
      }
    }
  ), l.handle(
    T.PAYMENTS_SAVE_ALL,
    async (n, e) => {
      try {
        return Array.isArray(e) ? (await x.replaceAll(e), _(!0)) : u("Se esperaba una lista de pagos.");
      } catch (t) {
        return u(t);
      }
    }
  ), l.handle("db:payments:getAll", () => x.getAll()), l.handle("db:payments:saveAll", async (n, e) => (await x.replaceAll(e), !0));
}
function Yt() {
  l.handle(
    T.SETTINGS_GET,
    async () => {
      try {
        const e = await d().prepare("SELECT key, value FROM settings").all(), t = {};
        for (const a of e)
          try {
            t[a.key] = JSON.parse(a.value);
          } catch {
            t[a.key] = a.value;
          }
        return _(t);
      } catch (n) {
        return u(n);
      }
    }
  ), l.handle(
    T.SETTINGS_SAVE_ALL,
    async (n, e) => {
      try {
        if (!e || typeof e != "object")
          return u("Se esperaba un objeto de configuración válido.");
        const t = d();
        return await t.transaction(async () => {
          const a = t.prepare(`
            INSERT INTO settings (key, value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
          `);
          for (const [r, o] of Object.entries(e))
            await a.run(r, JSON.stringify(o));
        }), ee(e), _(!0);
      } catch (t) {
        return u(t);
      }
    }
  ), l.handle("db:settings:getAll", async () => {
    const e = await d().prepare("SELECT key, value FROM settings").all(), t = {};
    for (const a of e)
      try {
        t[a.key] = JSON.parse(a.value);
      } catch {
        t[a.key] = a.value;
      }
    return t;
  }), l.handle("db:settings:saveAll", async (n, e) => {
    const t = d();
    return await t.transaction(async () => {
      const a = t.prepare(`
        INSERT INTO settings (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `);
      for (const [r, o] of Object.entries(e))
        await a.run(r, JSON.stringify(o));
    }), ee(e), !0;
  });
}
const Kt = 6e4, qt = {
  jan: 0,
  ene: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  abr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  ago: 7,
  sep: 8,
  set: 8,
  oct: 9,
  nov: 10,
  dec: 11,
  dic: 11
};
function Qt(n) {
  var o;
  const e = n.trim().match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])?$/);
  if (!e) return null;
  let t = Number(e[1]);
  const a = Number(e[2]), r = (o = e[3]) == null ? void 0 : o.toUpperCase();
  if (a > 59) return null;
  if (r) {
    if (t < 1 || t > 12) return null;
    r === "PM" && t !== 12 && (t += 12), r === "AM" && t === 12 && (t = 0);
  } else if (t > 23)
    return null;
  return { hours: t, minutes: a };
}
function be(n) {
  const e = n.trim(), t = e.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (t)
    return fe(Number(t[1]), Number(t[2]) - 1, Number(t[3]));
  const a = e.match(/^(\d{1,2})\s+([A-Za-zÁÉÍÓÚáéíóú]{3,})\.?,?\s+(\d{4})$/);
  if (a) {
    const r = qt[a[2].slice(0, 3).toLowerCase()];
    return r === void 0 ? null : fe(Number(a[3]), r, Number(a[1]));
  }
  return null;
}
function we(n, e) {
  const t = be(n), a = Qt(e);
  return !t || !a ? null : (t.setHours(a.hours, a.minutes, 0, 0), t);
}
function Jt(n) {
  const e = n.lastIndexOf(" - ");
  return e === -1 ? null : we(n.slice(0, e), n.slice(e + 3));
}
function ae(n) {
  return `${n.getFullYear()}-${H(n.getMonth() + 1)}-${H(n.getDate())}`;
}
function Zt(n) {
  return `${H(n.getHours())}:${H(n.getMinutes())}`;
}
function ce(n, e) {
  return new Date(n.getTime() + e * Kt);
}
function ve(n, e) {
  const t = new Date(n);
  return t.setDate(t.getDate() + e), t;
}
function en(n) {
  const e = new Date(n);
  return e.setHours(0, 0, 0, 0), e;
}
function le(n, e, t) {
  const a = n.getTime();
  return a > e.getTime() && a <= t.getTime();
}
function fe(n, e, t) {
  const a = new Date(n, e, t);
  return a.getFullYear() === n && a.getMonth() === e && a.getDate() === t ? a : null;
}
function H(n) {
  return String(n).padStart(2, "0");
}
const tn = 24 * 60;
function nn(n, e) {
  const t = [];
  for (const a of n) {
    if (!(a.alarmMinutes > 0)) continue;
    const r = we(a.date, a.startTime);
    if (!r) continue;
    const o = ce(r, -a.alarmMinutes);
    le(o, e.from, e.to) && t.push({
      id: re("calendar", a.id, `${a.date}T${a.startTime}`),
      kind: "calendar",
      title: a.title,
      body: `Comienza ${an(a.alarmMinutes)} · ${a.startTime}–${a.endTime}`,
      target: { type: "calendarEvent", id: a.id }
    });
  }
  return t;
}
function an(n) {
  if (n % 60 === 0) {
    const e = n / 60;
    return e === 1 ? "en 1 hora" : `en ${e} horas`;
  }
  return n === 1 ? "en 1 minuto" : `en ${n} minutos`;
}
const rn = {
  kind: "calendar",
  isEnabled: (n) => n.calendarAlerts,
  async getDue(n) {
    const e = await F.getByDateRange(
      ae(n.from),
      ae(ce(n.to, tn))
    );
    return nn(e, n);
  }
};
function on(n, e) {
  const t = [];
  for (const a of n) {
    const r = Jt(a.proximaAudiencia);
    if (!r) continue;
    const o = ce(r, -24 * 60);
    if (!le(o, e.from, e.to)) continue;
    const c = [Zt(r), a.juzgado, a.expediente && `Exp. ${a.expediente}`].filter(Boolean).join(" · ");
    t.push({
      id: re("hearing", a.clientId, r.toISOString()),
      kind: "hearing",
      title: `Audiencia mañana: ${a.clientName}`,
      body: c,
      urgent: !0,
      target: { type: "hearing", clientId: a.clientId }
    });
  }
  return t;
}
const sn = {
  kind: "hearing",
  isEnabled: (n) => n.hearingAlerts,
  async getDue(n) {
    const e = await O.getScheduledHearings();
    return on(e, n);
  }
}, ge = (n) => {
  try {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0
    }).format(n);
  } catch {
    return `$${Math.round(n).toLocaleString("es-CL")}`;
  }
}, cn = 9, ln = 7;
function un(n, e) {
  let t = null;
  for (let r = en(e.from); r <= e.to; r = ve(r, 1)) {
    const o = new Date(r);
    o.setHours(cn, 0, 0, 0), le(o, e.from, e.to) && (t = r);
  }
  const a = t ? dn(n, t) : null;
  return a ? [a] : [];
}
function dn(n, e) {
  const t = ve(e, ln), a = [], r = [];
  for (const s of n) {
    if (s.status === "completed") continue;
    if (s.status === "overdue") {
      a.push(s);
      continue;
    }
    const p = be(s.date);
    p && (p < e ? a.push(s) : p <= t && r.push(s));
  }
  if (a.length === 0 && r.length === 0) return null;
  const o = [
    a.length > 0 && `${_e(a.length, "vencido", "vencidos")} (${ge(ye(a))})`,
    r.length > 0 && `${_e(r.length, "vence", "vencen")} esta semana (${ge(ye(r))})`
  ].filter(Boolean), c = [...a, ...r], i = c.length === 1 ? c[0] : null;
  return {
    id: re("payment", "summary", ae(e)),
    kind: "payment",
    title: i ? `Cobro pendiente: ${i.client}` : "Cobros por revisar",
    body: o.join(" · "),
    // Con un solo cobro se abre directamente; con varios, la sección de Pagos.
    target: i ? { type: "payment", id: i.id } : void 0
  };
}
function ye(n) {
  return n.reduce((e, t) => e + t.amount, 0);
}
function _e(n, e, t) {
  return `${n} ${n === 1 ? e : t}`;
}
const pn = {
  kind: "payment",
  isEnabled: (n) => n.paymentReminders,
  async getDue(n) {
    const e = await x.getAll();
    return un(e, n);
  }
}, Oe = m.dirname(Be(import.meta.url));
process.env.APP_ROOT = m.join(Oe, "..");
const Ce = process.env.VITE_DEV_SERVER_URL, An = m.join(process.env.APP_ROOT, "dist-electron"), De = m.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Ce ? m.join(process.env.APP_ROOT, "public") : De;
E.name = X;
const mn = 3e3;
function W() {
  Ut({
    preloadPath: m.join(Oe, "preload.mjs"),
    publicDir: process.env.VITE_PUBLIC,
    rendererDist: De,
    devServerUrl: Ce,
    // En macOS el Dock permite reabrir siempre; en Windows/Linux solo si el icono de bandeja existe.
    canHideToBackground: () => process.platform === "darwin" || Le(),
    onHiddenToBackground: wt
  });
}
function Ne() {
  R() ? ne() : W();
}
function En() {
  const n = Ie();
  return {
    calendarAlerts: n.calendarAlerts,
    hearingAlerts: n.hearingAlerts,
    paymentReminders: n.paymentReminders,
    sound: n.soundEffects
  };
}
function he() {
  se(), E.quit();
}
function Tn() {
  It(), process.platform === "win32" && E.setAppUserModelId(E.isPackaged ? ht : process.execPath), Ft(), E.on("second-instance", () => {
    R() ? ne() : E.isReady() && W();
  }), E.on("window-all-closed", () => {
    process.platform !== "darwin" && E.quit();
  }), E.on("before-quit", () => {
    se();
  });
  let n = !1;
  E.on("will-quit", (e) => {
    if (mt(), ot(), vt(), n) return;
    e.preventDefault();
    const t = new Promise((a) => setTimeout(a, mn));
    Promise.race([qe(), t]).catch((a) => console.error("[SQLite] Error al cerrar:", a)).finally(() => {
      n = !0, E.quit();
    });
  }), E.on("activate", () => {
    R() ? ne() : E.isReady() && W();
  }), E.whenReady().then(async () => {
    await Ke(), await Lt(), Wt(), Ht(), Gt(), Bt(), Yt(), Je(R), W(), bt({
      publicDir: process.env.VITE_PUBLIC,
      onOpen: Ne,
      onQuit: he
    }), at({
      adapter: Nt({ iconPath: m.join(process.env.VITE_PUBLIC, "icon.png") }),
      getPreferences: En,
      onOpen: Ne,
      navigate: Pt
    }), K(rn), K(sn), K(pn), pt(), me.on("resume", () => void J()), me.on("shutdown", he);
  });
}
E.requestSingleInstanceLock() ? Tn() : E.quit();
export {
  An as MAIN_DIST,
  De as RENDERER_DIST,
  Ce as VITE_DEV_SERVER_URL
};
