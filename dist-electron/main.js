import { ipcMain, app, BrowserWindow, Menu } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
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
  primaryTint: rgba(APP_COLOR_RGB.primary, 0.08),
  primaryStatusTint: rgba(APP_COLOR_RGB.primary, 0.1),
  neutralTint: rgba(APP_COLOR_RGB.neutral, 0.1),
  successTint: rgba(APP_COLOR_RGB.success, 0.1),
  warningTint: rgba(APP_COLOR_RGB.warning, 0.1),
  // Colores semánticos derivados del RGB base
  primary: rgbToHex(APP_COLOR_RGB.primary),
  success: rgbToHex(APP_COLOR_RGB.success),
  warning: rgbToHex(APP_COLOR_RGB.warning),
  danger: rgbToHex(APP_COLOR_RGB.danger),
  neutral: rgbToHex(APP_COLOR_RGB.neutral),
  // Variantes del primario
  primaryStrong: "#0a84ff",
  primaryLight: "#30b0ff"
};
const FRAMEWORK_PAGE_VARIABLES = {
  "--f7-page-bg-color": APP_COLORS.white,
  "--f7-bars-bg-color": APP_COLORS.white,
  "--f7-navbar-bg-color": APP_COLORS.white,
  "--f7-toolbar-bg-color": APP_COLORS.white,
  "--f7-card-bg-color": "transparent",
  "--f7-list-strong-bg-color": APP_COLORS.white,
  "--f7-list-bg-color": APP_COLORS.white
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
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
ipcMain.on("window-minimize", () => win == null ? void 0 : win.minimize());
ipcMain.on("window-maximize", () => {
  if (win == null ? void 0 : win.isMaximized()) {
    win == null ? void 0 : win.restore();
  } else {
    win == null ? void 0 : win.maximize();
  }
});
ipcMain.on("window-close", () => win == null ? void 0 : win.close());
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
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
