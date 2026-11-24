import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { APP_COLORS } from './core/theme/style'
import { initDatabase, closeDatabase } from './core/database/connection'
import { setupAppMenu } from './core/menu/appMenu'
import { registerCalendarController } from './features/calendar/controllers/calendarController'
import { registerClientController } from './features/clients/controllers/clientController'
import { registerDocumentController } from './features/clients/controllers/documentController'
import { registerPaymentController } from './features/payments/controllers/paymentController'
import { registerSettingsController } from './features/settings/controllers/settingsController'
import { IPC_CHANNELS, createIpcSuccess } from './shared/types/ipc'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

app.name = 'Contact Library'

let win: BrowserWindow | null
let isQuitting = false

// Configuración de los eventos para la barra de título personalizada
const handleMinimize = () => win?.minimize()
const handleMaximize = () => {
  if (win?.isMaximized()) {
    win?.restore()
  } else {
    win?.maximize()
  }
}
const handleClose = () => {
  if (process.platform === 'darwin' && !isQuitting) {
    win?.hide()
  } else {
    win?.close()
  }
}

ipcMain.on(IPC_CHANNELS.WINDOW_MINIMIZE, handleMinimize)
ipcMain.on(IPC_CHANNELS.WINDOW_MAXIMIZE, handleMaximize)
ipcMain.on(IPC_CHANNELS.WINDOW_CLOSE, handleClose)
ipcMain.handle(IPC_CHANNELS.APP_GET_PLATFORM, () => createIpcSuccess(process.platform))

// Compatibilidad con llamadas heredadas
ipcMain.on('window-minimize', handleMinimize)
ipcMain.on('window-maximize', handleMaximize)
ipcMain.on('window-close', handleClose)
ipcMain.handle('get-platform', () => process.platform)

function createWindow() {
  const isMac = process.platform === 'darwin'

  // Configurar menú de la aplicación (Menú nativo en macOS, sin barra en Windows)
  setupAppMenu(() => win)

  win = new BrowserWindow({
    width: 1320,
    height: 820,
    minWidth: 1000,
    minHeight: 640,
    frame: false,
    autoHideMenuBar: true,
    titleBarStyle: isMac ? 'hidden' : 'default',
    trafficLightPosition: isMac ? { x: 18, y: 18 } : undefined,
    vibrancy: isMac ? 'sidebar' : undefined,
    visualEffectState: isMac ? 'active' : undefined,
    show: false,
    backgroundColor: APP_COLORS.background,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  if (!isMac) {
    win.setMenu(null)
  }

  // En macOS, al hacer clic en el semáforo rojo o pulsar Cmd+W, ocultamos la ventana
  // para permitir la reapertura instantánea desde el Dock sin destruir la sesión.
  win.on('close', (event) => {
    if (isMac && !isQuitting) {
      event.preventDefault()
      win?.hide()
    }
  })

  win.once('ready-to-show', () => {
    win?.show();
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    closeDatabase()
    app.quit()
    win = null
  }
})

app.on('before-quit', () => {
  isQuitting = true
  closeDatabase()
})

app.on('activate', () => {
  if (win && !win.isDestroyed()) {
    if (win.isMinimized()) win.restore()
    win.show()
    win.focus()
  } else if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(async () => {
  await initDatabase()
  registerClientController()
  registerDocumentController()
  registerPaymentController()
  registerCalendarController()
  registerSettingsController()
  createWindow()
})