import { ipcMain as i, app as n, BrowserWindow as t } from "electron";
import { fileURLToPath as c } from "node:url";
import o from "node:path";
const r = o.dirname(c(import.meta.url));
process.env.APP_ROOT = o.join(r, "..");
const s = process.env.VITE_DEV_SERVER_URL, f = o.join(process.env.APP_ROOT, "dist-electron"), a = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = s ? o.join(process.env.APP_ROOT, "public") : a;
let e;
i.on("window-minimize", () => e == null ? void 0 : e.minimize());
i.on("window-maximize", () => {
  e != null && e.isMaximized() ? e == null || e.restore() : e == null || e.maximize();
});
i.on("window-close", () => e == null ? void 0 : e.close());
function l() {
  e = new t({
    width: 1280,
    height: 720,
    frame: !1,
    show: !1,
    backgroundColor: "#f5f5f7",
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: o.join(r, "preload.mjs")
    }
  }), e.once("ready-to-show", () => {
    e == null || e.show();
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), s ? e.loadURL(s) : e.loadFile(o.join(a, "index.html"));
}
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), e = null);
});
n.on("activate", () => {
  t.getAllWindows().length === 0 && l();
});
n.whenReady().then(l);
export {
  f as MAIN_DIST,
  a as RENDERER_DIST,
  s as VITE_DEV_SERVER_URL
};
