import { app, powerMonitor } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { initDatabase, closeDatabase } from './core/database/connection'
import { setupAppMenu } from './core/menu/appMenu'
import {
  APP_DISPLAY_NAME,
  APP_ID,
  createMainWindow,
  createTray,
  destroyTray,
  getMainWindow,
  isTrayActive,
  loadSystemPreferences,
  markQuitting,
  notifyRunningInBackground,
  registerWindowController,
  showMainWindow,
} from './core/system'
import { registerCalendarController } from './features/calendar/controllers/calendarController'
import { registerClientController } from './features/clients/controllers/clientController'
import { registerDocumentController } from './features/clients/controllers/documentController'
import { registerPaymentController } from './features/payments/controllers/paymentController'
import { registerSettingsController } from './features/settings/controllers/settingsController'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

// Debe fijarse antes de cualquier uso de rutas de usuario (userData) o del bloqueo de instancia única.
app.name = APP_DISPLAY_NAME

function openMainWindow() {
  createMainWindow({
    preloadPath: path.join(__dirname, 'preload.mjs'),
    publicDir: process.env.VITE_PUBLIC,
    rendererDist: RENDERER_DIST,
    devServerUrl: VITE_DEV_SERVER_URL,
    // En macOS el Dock permite reabrir siempre; en Windows/Linux solo si el icono de bandeja existe.
    canHideToBackground: () => process.platform === 'darwin' || isTrayActive(),
    onHiddenToBackground: notifyRunningInBackground,
  })
}

/** Cierre real de la app (menú de la bandeja, Cmd+Q, apagado del sistema). */
function quitApp() {
  markQuitting()
  app.quit()
}

function bootstrap() {
  // Windows: agrupa la barra de tareas y habilita notificaciones. En desarrollo se usa el ejecutable.
  if (process.platform === 'win32') {
    app.setAppUserModelId(app.isPackaged ? APP_ID : process.execPath)
  }

  registerWindowController()

  // Si el usuario vuelve a abrir la app (acceso directo, Dock...), mostrar la instancia existente.
  app.on('second-instance', () => {
    if (getMainWindow()) {
      showMainWindow()
    } else if (app.isReady()) {
      openMainWindow()
    }
  })

  app.on('window-all-closed', () => {
    // Solo ocurre si la ventana se cerró de verdad (preferencia desactivada o sin bandeja).
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // Cmd+Q, "Salir" del menú de macOS o de la bandeja: a partir de aquí cerrar la ventana es definitivo.
  app.on('before-quit', () => {
    markQuitting()
  })

  app.on('will-quit', () => {
    destroyTray()
    closeDatabase()
  })

  // macOS: clic en el Dock. La ventana oculta sigue existiendo, así que se muestra en vez de crear otra.
  app.on('activate', () => {
    if (getMainWindow()) {
      showMainWindow()
    } else if (app.isReady()) {
      openMainWindow()
    }
  })

  app.whenReady().then(async () => {
    await initDatabase()
    await loadSystemPreferences()
    registerClientController()
    registerDocumentController()
    registerPaymentController()
    registerCalendarController()
    registerSettingsController()

    // Menú nativo completo en macOS (incluye Cmd+, para Ajustes); sin barra en Windows/Linux.
    setupAppMenu(getMainWindow)
    openMainWindow()
    createTray({
      publicDir: process.env.VITE_PUBLIC,
      onOpen: () => (getMainWindow() ? showMainWindow() : openMainWindow()),
      onQuit: quitApp,
    })

    // macOS/Linux: apagado o reinicio del sistema con la app en segundo plano.
    powerMonitor.on('shutdown', quitApp)
  })
}

// Una sola instancia: evita dos procesos compitiendo por la misma base de datos SQLite.
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  bootstrap()
}
