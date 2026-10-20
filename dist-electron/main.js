import { ipcMain as s, app as n, BrowserWindow as r } from "electron";
import { fileURLToPath as d } from "node:url";
import o from "node:path";
const m = {
  background: "#f5f5f7"
}, a = o.dirname(d(import.meta.url));
process.env.APP_ROOT = o.join(a, "..");
const i = process.env.VITE_DEV_SERVER_URL, _ = o.join(process.env.APP_ROOT, "dist-electron"), l = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = i ? o.join(process.env.APP_ROOT, "public") : l;
let e;
s.on("window-minimize", () => e == null ? void 0 : e.minimize());
s.on("window-maximize", () => {
  e != null && e.isMaximized() ? e == null || e.restore() : e == null || e.maximize();
});
s.on("window-close", () => e == null ? void 0 : e.close());
s.handle("get-platform", () => process.platform);
function c() {
  const t = process.platform === "darwin";
  e = new r({
    width: 1280,
    height: 720,
    frame: !1,
    titleBarStyle: t ? "hiddenInset" : "default",
    trafficLightPosition: t ? { x: 12, y: 12 } : void 0,
    show: !1,
    backgroundColor: m.background,
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: o.join(a, "preload.mjs")
    }
  }), e.once("ready-to-show", () => {
    e == null || e.show();
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), i ? e.loadURL(i) : e.loadFile(o.join(l, "index.html"));
}
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), e = null);
});
n.on("activate", () => {
  r.getAllWindows().length === 0 && c();
});
n.whenReady().then(c);
export {
  _ as MAIN_DIST,
  l as RENDERER_DIST,
  i as VITE_DEV_SERVER_URL
};
