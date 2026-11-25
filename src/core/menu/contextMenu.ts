import { Menu, type BrowserWindow } from 'electron'

/**
 * Menú contextual nativo (clic derecho) para campos editables y selección de texto.
 */
export function attachContextMenu(win: BrowserWindow): void {
  win.webContents.on('context-menu', (_event, params) => {
    const { isEditable, selectionText } = params

    if (isEditable) {
      Menu.buildFromTemplate([
        { role: 'undo', label: 'Deshacer' },
        { role: 'redo', label: 'Rehacer' },
        { type: 'separator' },
        { role: 'cut', label: 'Cortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Pegar' },
        { type: 'separator' },
        { role: 'selectAll', label: 'Seleccionar todo' },
      ]).popup({ window: win })
    } else if (selectionText && selectionText.trim().length > 0) {
      Menu.buildFromTemplate([
        { role: 'copy', label: 'Copiar' },
        { role: 'selectAll', label: 'Seleccionar todo' },
      ]).popup({ window: win })
    }
  })
}
