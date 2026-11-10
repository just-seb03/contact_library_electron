import { app as b, ipcMain as c, BrowserWindow as M, Menu as U } from "electron";
import { fileURLToPath as D } from "node:url";
import d from "node:path";
import N from "node:fs";
import F from "sqlite3";
const m = (e, t) => `rgba(${e}, ${t})`, A = (e) => `#${e.split(",").map((t) => Number(t.trim()).toString(16).padStart(2, "0")).join("")}`, p = {
  primary: "0, 122, 255",
  success: "52, 199, 89",
  warning: "255, 149, 0",
  danger: "255, 59, 48",
  neutral: "142, 142, 147"
}, I = "0, 0, 0", O = "255, 255, 255", x = "245, 245, 247", L = {
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
  cardBorder: m(I, 0.05),
  glassBorder: m(I, 0.06),
  glassSurface: m(x, 0.65),
  whiteOverlay: m(O, 0.2),
  whiteTextMuted: m(O, 0.9),
  whiteTextFaint: m(O, 0.6),
  // Tints derivados de APP_COLOR_RGB
  primaryTint: "var(--macos-accent-tint-subtle, rgba(0, 122, 255, 0.08))",
  primaryStatusTint: "var(--macos-accent-tint-status, rgba(0, 122, 255, 0.1))",
  neutralTint: m(p.neutral, 0.1),
  successTint: m(p.success, 0.1),
  warningTint: m(p.warning, 0.1),
  // Colores semánticos derivados del RGB base
  primary: "var(--macos-accent-color, #007aff)",
  success: A(p.success),
  warning: A(p.warning),
  danger: A(p.danger),
  neutral: A(p.neutral),
  // Variantes del primario
  primaryStrong: "var(--macos-accent-color, #0a84ff)",
  primaryLight: "var(--macos-accent-color, #30b0ff)"
}, X = {
  "--f7-page-bg-color": "var(--macos-canvas-bg, #f5f5f7)",
  "--f7-bars-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-navbar-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-toolbar-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-card-bg-color": "transparent",
  "--f7-list-strong-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-list-bg-color": "var(--macos-card-bg, #ffffff)"
}, B = () => {
  const e = {
    "--f7-theme-color": L.primary,
    "--f7-theme-color-rgb": p.primary
  };
  for (const [o, n] of Object.entries(L))
    e[`--app-color-${o}`] = n;
  for (const [o, n] of Object.entries(p))
    e[`--app-color-${o}-rgb`] = n;
  const t = {
    blue: "primary",
    green: "success",
    orange: "warning",
    red: "danger",
    gray: "neutral"
  };
  for (const [o, n] of Object.entries(t))
    e[`--f7-color-${o}`] = `var(--app-color-${n})`, e[`--f7-color-${o}-rgb`] = `var(--app-color-${n}-rgb)`;
  for (const [o, n] of Object.entries(X))
    e[o] = String(n);
  return e;
};
B();
const j = `
CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  rut TEXT,
  status TEXT DEFAULT 'activo',
  caso TEXT,
  pago TEXT,
  documentos TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  client TEXT NOT NULL,
  clientId INTEGER,
  concept TEXT NOT NULL,
  amount REAL NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  startTime TEXT NOT NULL,
  endTime TEXT NOT NULL,
  colorId TEXT DEFAULT 'blue',
  alarmMinutes INTEGER DEFAULT 15,
  clientId INTEGER,
  details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`, z = `
INSERT OR IGNORE INTO clients (id, name, phone, email, status, caso, pago, documentos) VALUES
(
  1,
  'El manzano',
  '+56 9 8765 4321',
  'contacto@elmanzano.cl',
  'activo',
  '{"expediente":"EXP-2026-042","juzgado":"1° Juzgado Civil de Santiago","materia":"Asesoría Mensual Corporativa","estado":"Contrato vigente al día","proximaAudiencia":"28 Oct, 2026 - 10:00 AM"}',
  '{"monto":450000,"concepto":"Asesoría Mensual","fecha":"10 Oct, 2026","estado":"completed"}',
  '[]'
),
(
  2,
  'Sebastian Bastian',
  '+56 9 9123 4567',
  'sebastian.bastian@empresa.com',
  'en_proceso',
  '{"expediente":"EXP-2026-118","juzgado":"2° Juzgado de Letras del Trabajo","materia":"Desarrollo de Módulo y Propiedad Intelectual","estado":"Revisión de entregables y cobro pendiente","proximaAudiencia":"14 Oct, 2026 - 11:30 AM"}',
  '{"monto":1200000,"concepto":"Desarrollo de Modulo","fecha":"14 Oct, 2026","estado":"pending"}',
  '[]'
),
(
  3,
  'MaxiMaxi',
  '+56 9 6543 2109',
  'administracion@maximaxi.com',
  'en_proceso',
  '{"expediente":"EXP-2026-077","juzgado":"Juzgado de Cobranza Judicial","materia":"Mantenimiento de Agenda y Soporte Legal","estado":"Notificación de cobro vencido","proximaAudiencia":"05 Nov, 2026 - 09:30 AM"}',
  '{"monto":300000,"concepto":"Mantenimiento de Agenda","fecha":"05 Oct, 2026","estado":"overdue"}',
  '[]'
),
(
  6,
  'Carlos Mendoza',
  '+56 9 5555 2222',
  'carlos.mendoza@legales.cl',
  'en_proceso',
  '{"expediente":"EXP-2026-155","juzgado":"3° Juzgado Civil de Santiago","materia":"Revisión de contrato comercial","estado":"Pendiente de firma","proximaAudiencia":"22 Oct, 2026 - 02:00 PM"}',
  '{"monto":600000,"concepto":"Revisión Contractual","fecha":"22 Oct, 2026","estado":"pending"}',
  '[]'
);

INSERT OR IGNORE INTO settings (key, value) VALUES
('hearingAlerts', 'true'),
('paymentReminders', 'true'),
('soundEffects', 'true'),
('accentColor', '"blue"'),
('lawyerName', '"Sebastián Contreras"'),
('lawyerEmail', '"s.contreras@estudiojuridico.cl"'),
('lawyerFirm', '"Contreras & Asociados • Derecho Civil y Litigios"');
`;
let f = null;
function J() {
  var e;
  try {
    const t = (e = b) != null && e.getPath ? b.getPath("userData") : process.cwd();
    return d.join(t, "contact_library.db");
  } catch {
    return d.join(process.cwd(), "contact_library.db");
  }
}
function y(e) {
  return e.length === 1 && Array.isArray(e[0]) ? e[0] : e;
}
function V(e) {
  return new Promise((t, o) => {
    const n = new F.Database(e, (a) => {
      a ? o(a) : t(n);
    });
  });
}
function k(e) {
  let t = Promise.resolve();
  const o = (n) => new Promise((a, i) => {
    e.exec(n, (r) => {
      r ? i(r) : a();
    });
  });
  return {
    prepare(n) {
      return {
        all(...a) {
          const i = y(a);
          return new Promise((r, l) => {
            const u = e.prepare(n, (T) => {
              if (T) {
                l(T);
                return;
              }
              u.all(i, (g, R) => {
                u.finalize((S) => {
                  g || S ? l(g || S) : r(R);
                });
              });
            });
          });
        },
        get(...a) {
          const i = y(a);
          return new Promise((r, l) => {
            const u = e.prepare(n, (T) => {
              if (T) {
                l(T);
                return;
              }
              u.get(i, (g, R) => {
                u.finalize((S) => {
                  g || S ? l(g || S) : r(R);
                });
              });
            });
          });
        },
        run(...a) {
          const i = y(a);
          return new Promise((r, l) => {
            const u = e.prepare(n, (T) => {
              if (T) {
                l(T);
                return;
              }
              u.run(i, function(g) {
                u.finalize((R) => {
                  g || R ? l(g || R) : r({ lastInsertRowid: this.lastID, changes: this.changes });
                });
              });
            });
          });
        }
      };
    },
    exec: o,
    pragma(n) {
      return o(`PRAGMA ${n};`);
    },
    async transaction(n) {
      let a;
      const i = t;
      t = new Promise((r) => {
        a = r;
      }), await i;
      try {
        await o("BEGIN TRANSACTION;");
        const r = await n();
        return await o("COMMIT;"), r;
      } catch (r) {
        try {
          await o("ROLLBACK;");
        } catch (l) {
          console.error("[SQLite] Error revirtiendo transacción:", l);
        }
        throw r;
      } finally {
        a();
      }
    },
    close() {
      e.close((n) => {
        n && console.error("[SQLite] Error cerrando la base de datos:", n);
      });
    }
  };
}
async function G(e) {
  if (f) return f;
  const t = J(), o = d.dirname(t);
  N.mkdirSync(o, { recursive: !0 });
  const n = await V(t), a = k(n);
  try {
    await a.pragma("foreign_keys = ON");
    let i = j;
    const r = d.join(process.cwd(), "src", "core", "database", "schema", "tables.sql");
    N.existsSync(r) && (i = N.readFileSync(r, "utf-8")), await a.exec(i);
    const l = await a.prepare("SELECT count(*) as count FROM clients").get();
    if (!l || l.count === 0) {
      let u = z;
      const T = d.join(process.cwd(), "src", "core", "database", "schema", "seed.sql");
      N.existsSync(T) && (u = N.readFileSync(T, "utf-8")), await a.exec(u);
    }
  } catch (i) {
    throw a.close(), i;
  }
  return console.log("[SQLite] Base de datos inicializada y conectada en:", t), f = a, f;
}
function E() {
  if (!f)
    throw new Error("[SQLite] La base de datos no ha sido inicializada. Asegúrate de llamar a initDatabase() primero.");
  return f;
}
function w() {
  f && (f.close(), f = null);
}
function Y() {
  c.handle("db:calendar:getAll", async () => E().prepare("SELECT * FROM calendar_events ORDER BY date ASC, startTime ASC").all()), c.handle("db:calendar:saveAll", async (e, t) => {
    const o = E();
    return await o.transaction(async () => {
      await o.prepare("DELETE FROM calendar_events").run();
      const n = o.prepare(`
        INSERT INTO calendar_events (id, title, date, startTime, endTime, colorId, alarmMinutes, clientId, details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const a of t)
        await n.run(
          a.id,
          a.title,
          a.date,
          a.startTime,
          a.endTime,
          a.colorId || "blue",
          a.alarmMinutes ?? 15,
          a.clientId || null,
          a.details || ""
        );
    }), !0;
  });
}
function h(e) {
  return {
    id: e.id,
    name: e.name,
    phone: e.phone,
    email: e.email ?? void 0,
    rut: e.rut ?? void 0,
    status: e.status,
    caso: e.caso ? JSON.parse(e.caso) : void 0,
    pago: e.pago ? JSON.parse(e.pago) : void 0,
    documentos: e.documentos ? JSON.parse(e.documentos) : []
  };
}
function $() {
  c.handle("db:clients:getAll", async () => (await E().prepare("SELECT * FROM clients ORDER BY id ASC").all()).map(h)), c.handle("db:clients:create", async (e, t) => {
    const n = await E().prepare(`
      INSERT INTO clients (name, phone, email, rut, status, caso, pago, documentos)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      t.name,
      t.phone,
      t.email || null,
      t.rut || null,
      t.status || "activo",
      t.caso ? JSON.stringify(t.caso) : null,
      t.pago ? JSON.stringify(t.pago) : null,
      t.documentos ? JSON.stringify(t.documentos) : "[]"
    );
    return {
      ...t,
      id: Number(n.lastInsertRowid)
    };
  }), c.handle("db:clients:update", async (e, t, o) => {
    const n = E(), a = await n.prepare("SELECT * FROM clients WHERE id = ?").get(t);
    if (!a)
      throw new Error(`Cliente con id ${t} no encontrado`);
    const r = { ...h(a), ...o };
    return await n.prepare(`
      UPDATE clients
      SET name = ?, phone = ?, email = ?, rut = ?, status = ?, caso = ?, pago = ?, documentos = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      r.name,
      r.phone,
      r.email || null,
      r.rut || null,
      r.status || "activo",
      r.caso ? JSON.stringify(r.caso) : null,
      r.pago ? JSON.stringify(r.pago) : null,
      r.documentos ? JSON.stringify(r.documentos) : "[]",
      t
    ), r;
  }), c.handle("db:clients:delete", async (e, t) => (await E().prepare("DELETE FROM clients WHERE id = ?").run(t), !0)), c.handle("db:clients:saveAll", async (e, t) => {
    const o = E();
    return await o.transaction(async () => {
      await o.prepare("DELETE FROM clients").run();
      const n = o.prepare(`
        INSERT INTO clients (id, name, phone, email, rut, status, caso, pago, documentos)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const a of t)
        await n.run(
          a.id,
          a.name,
          a.phone,
          a.email || null,
          a.rut || null,
          a.status || "activo",
          a.caso ? JSON.stringify(a.caso) : null,
          a.pago ? JSON.stringify(a.pago) : null,
          a.documentos ? JSON.stringify(a.documentos) : "[]"
        );
    }), !0;
  });
}
function W() {
  c.handle("db:payments:getAll", async () => E().prepare("SELECT * FROM payments ORDER BY date DESC").all()), c.handle("db:payments:saveAll", async (e, t) => {
    const o = E();
    return await o.transaction(async () => {
      await o.prepare("DELETE FROM payments").run();
      const n = o.prepare(`
        INSERT INTO payments (id, client, clientId, concept, amount, date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const a of t)
        await n.run(
          a.id,
          a.client,
          a.clientId || null,
          a.concept,
          a.amount,
          a.date,
          a.status
        );
    }), !0;
  });
}
function K() {
  c.handle("db:settings:getAll", async () => {
    const t = await E().prepare("SELECT key, value FROM settings").all(), o = {};
    for (const n of t)
      try {
        o[n.key] = JSON.parse(n.value);
      } catch {
        o[n.key] = n.value;
      }
    return o;
  }), c.handle("db:settings:saveAll", async (e, t) => {
    const o = E();
    return await o.transaction(async () => {
      const n = o.prepare(`
        INSERT INTO settings (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `);
      for (const [a, i] of Object.entries(t))
        await n.run(a, JSON.stringify(i));
    }), !0;
  });
}
const C = d.dirname(D(import.meta.url));
process.env.APP_ROOT = d.join(C, "..");
const v = process.env.VITE_DEV_SERVER_URL, ae = d.join(process.env.APP_ROOT, "dist-electron"), _ = d.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = v ? d.join(process.env.APP_ROOT, "public") : _;
let s;
c.on("window-minimize", () => s == null ? void 0 : s.minimize());
c.on("window-maximize", () => {
  s != null && s.isMaximized() ? s == null || s.restore() : s == null || s.maximize();
});
c.on("window-close", () => s == null ? void 0 : s.close());
c.handle("get-platform", () => process.platform);
function P() {
  const e = process.platform === "darwin";
  U.setApplicationMenu(null), s = new M({
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
    backgroundColor: L.background,
    icon: d.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: d.join(C, "preload.mjs")
    }
  }), s.setMenu(null), s.once("ready-to-show", () => {
    s == null || s.show();
  }), s.webContents.on("did-finish-load", () => {
    s == null || s.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), v ? s.loadURL(v) : s.loadFile(d.join(_, "index.html"));
}
b.on("window-all-closed", () => {
  w(), process.platform !== "darwin" && (b.quit(), s = null);
});
b.on("before-quit", () => {
  w();
});
b.on("activate", () => {
  M.getAllWindows().length === 0 && P();
});
b.whenReady().then(async () => {
  await G(), $(), W(), Y(), K(), P();
});
export {
  ae as MAIN_DIST,
  _ as RENDERER_DIST,
  v as VITE_DEV_SERVER_URL
};
