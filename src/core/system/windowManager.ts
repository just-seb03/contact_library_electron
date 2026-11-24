/**
 * @file windowManager.ts
 * @description Ciclo de vida de la ventana principal: creación, controles IPC de la barra de título
 * y el comportamiento "cerrar = ocultar en segundo plano" (estilo Discord).
 */

import { BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { APP_COLORS } from '../theme/style'
import { IPC_CHANNELS, createIpcSuccess } from '../../shared/types/ipc'
import { attachContextMenu } from '../menu/contextMenu'
import { getSystemPreferences } from './preferences'

export interface MainWindowOptions {
  preloadPath: string
  publicDir: string
  rendererDist: string
  devServerUrl?: string
  /**
   * Indica si hay forma de volver a abrir la ventana una vez oculta
   * (icono de bandeja en Windows/Linux; el Dock siempre existe en macOS).
   */
  canHideToBackground: () => boolean
  /** Se invoca cada vez que la ventana se oculta en lugar de cerrarse. */
  onHiddenToBackground?: () => void
}

let win: BrowserWindow | null = null

/**
 * `true` cuando la app está terminando de verdad (Salir en la bandeja, Cmd+Q, apagado del sistema).
 * Mientras sea `false`, cerrar la ventana solo la oculta.
 */
let isQuitting = false

export function markQuitting(): void {
  isQuitting = true
}

export function getMainWindow(): BrowserWindow | null {
  return win && !win.isDestroyed() ? win : null
}

export function showMainWindow(): void {
  const target = getMainWindow()
  if (!target) return
  if (target.isMinimized()) target.restore()
  if (!target.isVisible()) target.show()
  target.focus()
}

export function createMainWindow(options: MainWindowOptions): BrowserWindow {
  const isMac = process.platform === 'darwin'

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
    // En macOS el icono lo define el bundle (.icns); este se usa en Windows/Linux.
    icon: path.join(options.publicDir, 'icon.png'),
    webPreferences: {
      preload: options.preloadPath,
    },
  })

  // En macOS el menú es global (barra superior); en Windows/Linux la ventana no lleva barra de menú.
  if (!isMac) {
    win.setMenu(null)
  }

  attachContextMenu(win)

  win.once('ready-to-show', () => {
    win?.show()
  })

  // Cerrar = ocultar, salvo que la app esté saliendo o el usuario lo haya desactivado.
  win.on('close', (event) => {
    if (isQuitting) return
    if (!getSystemPreferences().minimizeToTray) return
    if (!options.canHideToBackground()) return

    event.preventDefault()
    win?.hide()
    options.onHiddenToBackground?.()
  })

  // Windows: al cerrar sesión o apagar, `before-quit` no se emite. Sin esto, el handler
  // de `close` ocultaría la ventana y bloquearía el apagado.
  win.on('session-end', () => {
    markQuitting()
  })

  win.on('closed', () => {
    win = null
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (options.devServerUrl) {
    win.loadURL(options.devServerUrl)
  } else {
    win.loadFile(path.join(options.rendererDist, 'index.html'))
  }

  return win
}

/**
 * Registra los canales IPC de la barra de título personalizada.
 */
export function registerWindowController(): void {
  const handleMinimize = () => getMainWindow()?.minimize()
  const handleMaximize = () => {
    const target = getMainWindow()
    if (!target) return
    if (target.isMaximized()) {
      target.restore()
    } else {
      target.maximize()
    }
  }
  // Pasa por el evento `close`, así que respeta la preferencia de minimizar a la bandeja.
  const handleClose = () => getMainWindow()?.close()

  ipcMain.on(IPC_CHANNELS.WINDOW_MINIMIZE, handleMinimize)
  ipcMain.on(IPC_CHANNELS.WINDOW_MAXIMIZE, handleMaximize)
  ipcMain.on(IPC_CHANNELS.WINDOW_CLOSE, handleClose)
  ipcMain.handle(IPC_CHANNELS.APP_GET_PLATFORM, () => createIpcSuccess(process.platform))

  // Compatibilidad con llamadas heredadas
  ipcMain.on('window-minimize', handleMinimize)
  ipcMain.on('window-maximize', handleMaximize)
  ipcMain.on('window-close', handleClose)
  ipcMain.handle('get-platform', () => process.platform)
}
