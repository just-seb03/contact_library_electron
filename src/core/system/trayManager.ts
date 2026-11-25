/**
 * @file trayManager.ts
 * @description Icono de la app en la bandeja del sistema (Windows/Linux) o en la barra de menús (macOS).
 * No conoce la ventana: recibe callbacks para abrirla y salir, evitando dependencias circulares.
 */

import { Menu, Tray, nativeImage } from 'electron'
import path from 'node:path'
import { APP_DISPLAY_NAME } from './appInfo'

export interface TrayOptions {
  /** Carpeta pública (`process.env.VITE_PUBLIC`) que contiene `tray/`. */
  publicDir: string
  onOpen: () => void
  onQuit: () => void
}

// Referencia a nivel de módulo: si el Tray queda sin referencias, el GC lo destruye y el icono desaparece.
let tray: Tray | null = null
let backgroundNoticeShown = false

function resolveTrayIcon(publicDir: string): Electron.NativeImage {
  const trayDir = path.join(publicDir, 'tray')

  if (process.platform === 'darwin') {
    // nativeImage carga automáticamente `trayTemplate@2x.png` en pantallas Retina.
    const image = nativeImage.createFromPath(path.join(trayDir, 'trayTemplate.png'))
    image.setTemplateImage(true)
    return image
  }

  const file = process.platform === 'win32' ? 'tray.ico' : 'tray.png'
  return nativeImage.createFromPath(path.join(trayDir, file))
}

export function createTray({ publicDir, onOpen, onQuit }: TrayOptions): Tray | null {
  if (tray) return tray

  const icon = resolveTrayIcon(publicDir)
  if (icon.isEmpty()) {
    console.error('[Tray] No se encontró el icono de bandeja en', path.join(publicDir, 'tray'))
    return null
  }

  tray = new Tray(icon)
  tray.setToolTip(APP_DISPLAY_NAME)
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: `Abrir ${APP_DISPLAY_NAME}`, click: onOpen },
      { type: 'separator' },
      { label: 'Salir', click: onQuit },
    ])
  )

  // En Windows/Linux el clic izquierdo abre la app (como Discord). En macOS el clic
  // muestra el menú contextual, que es el comportamiento esperado en la barra de menús.
  if (process.platform !== 'darwin') {
    tray.on('click', onOpen)
  }

  return tray
}

export function isTrayActive(): boolean {
  return tray !== null && !tray.isDestroyed()
}

/**
 * Aviso único por sesión (solo Windows) para que el usuario sepa que la app sigue activa
 * tras cerrar la ventana.
 */
export function notifyRunningInBackground(): void {
  if (process.platform !== 'win32' || backgroundNoticeShown || !isTrayActive()) return
  backgroundNoticeShown = true
  tray?.displayBalloon({
    title: APP_DISPLAY_NAME,
    content: 'La aplicación sigue ejecutándose en segundo plano. Haz clic en el icono para abrirla.',
    iconType: 'info',
  })
}

export function destroyTray(): void {
  if (tray && !tray.isDestroyed()) tray.destroy()
  tray = null
}
