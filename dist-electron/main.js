import { ipcMain as l, app as f, BrowserWindow as b, Menu as h } from "electron";
import { fileURLToPath as _ } from "node:url";
import s from "node:path";
const a = (r, c) => `rgba(${r}, ${c})`, i = (r) => `#${r.split(",").map((c) => Number(c.trim()).toString(16).padStart(2, "0")).join("")}`, o = {
  primary: "0, 122, 255",
  success: "52, 199, 89",
  warning: "255, 149, 0",
  danger: "255, 59, 48",
  neutral: "142, 142, 147"
}, p = "0, 0, 0", d = "255, 255, 255", T = "245, 245, 247", m = {
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
  cardBorder: a(p, 0.05),
  glassBorder: a(p, 0.06),
  glassSurface: a(T, 0.65),
  whiteOverlay: a(d, 0.2),
  whiteTextMuted: a(d, 0.9),
  whiteTextFaint: a(d, 0.6),
  // Tints derivados de APP_COLOR_RGB
  primaryTint: a(o.primary, 0.08),
  primaryStatusTint: a(o.primary, 0.1),
  neutralTint: a(o.neutral, 0.1),
  successTint: a(o.success, 0.1),
  warningTint: a(o.warning, 0.1),
  // Colores semánticos derivados del RGB base
  primary: i(o.primary),
  success: i(o.success),
  warning: i(o.warning),
  danger: i(o.danger),
  neutral: i(o.neutral),
  // Variantes del primario
  primaryStrong: "#0a84ff",
  primaryLight: "#30b0ff"
}, w = {
  "--f7-page-bg-color": "var(--macos-canvas-bg, #f5f5f7)",
  "--f7-bars-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-navbar-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-toolbar-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-card-bg-color": "transparent",
  "--f7-list-strong-bg-color": "var(--macos-card-bg, #ffffff)",
  "--f7-list-bg-color": "var(--macos-card-bg, #ffffff)"
}, y = () => {
  const r = {
    "--f7-theme-color": m.primary,
    "--f7-theme-color-rgb": o.primary
  };
  for (const [n, t] of Object.entries(m))
    r[`--app-color-${n}`] = t;
  for (const [n, t] of Object.entries(o))
    r[`--app-color-${n}-rgb`] = t;
  const c = {
    blue: "primary",
    green: "success",
    orange: "warning",
    red: "danger",
    gray: "neutral"
  };
  for (const [n, t] of Object.entries(c))
    r[`--f7-color-${n}`] = `var(--app-color-${t})`, r[`--f7-color-${n}-rgb`] = `var(--app-color-${t}-rgb)`;
  for (const [n, t] of Object.entries(w))
    r[n] = String(t);
  return r;
};
y();
const u = s.dirname(_(import.meta.url));
process.env.APP_ROOT = s.join(u, "..");
const g = process.env.VITE_DEV_SERVER_URL, S = s.join(process.env.APP_ROOT, "dist-electron"), v = s.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = g ? s.join(process.env.APP_ROOT, "public") : v;
let e;
l.on("window-minimize", () => e == null ? void 0 : e.minimize());
l.on("window-maximize", () => {
  e != null && e.isMaximized() ? e == null || e.restore() : e == null || e.maximize();
});
l.on("window-close", () => e == null ? void 0 : e.close());
l.handle("get-platform", () => process.platform);
function R() {
  const r = process.platform === "darwin";
  h.setApplicationMenu(null), e = new b({
    width: 1320,
    height: 820,
    minWidth: 1e3,
    minHeight: 640,
    frame: !1,
    autoHideMenuBar: !0,
    titleBarStyle: r ? "hidden" : "default",
    trafficLightPosition: r ? { x: 18, y: 18 } : void 0,
    vibrancy: r ? "sidebar" : void 0,
    visualEffectState: r ? "active" : void 0,
    show: !1,
    backgroundColor: m.background,
    icon: s.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: s.join(u, "preload.mjs")
    }
  }), e.setMenu(null), e.once("ready-to-show", () => {
    e == null || e.show();
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), g ? e.loadURL(g) : e.loadFile(s.join(v, "index.html"));
}
f.on("window-all-closed", () => {
  process.platform !== "darwin" && (f.quit(), e = null);
});
f.on("activate", () => {
  b.getAllWindows().length === 0 && R();
});
f.whenReady().then(R);
export {
  S as MAIN_DIST,
  v as RENDERER_DIST,
  g as VITE_DEV_SERVER_URL
};
