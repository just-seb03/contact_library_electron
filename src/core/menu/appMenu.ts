import { Menu, app, BrowserWindow, MenuItemConstructorOptions } from 'electron';

export interface AppMenuOptions {
  onOpenSettings?: () => void;
}

/**
 * Genera la plantilla de menú nativo de macOS respetando las Human Interface Guidelines (HIG) de Apple.
 * Proporciona soporte indispensable para portapapeles (Cmd+C/V/X), selección (Cmd+A),
 * historial de edición (Cmd+Z/Shift+Cmd+Z), vista, ventanas y atajos de sistema.
 */
export function createMacMenuTemplate(
  getMainWindow: () => BrowserWindow | null,
  options?: AppMenuOptions
): MenuItemConstructorOptions[] {
  const isDev = !app.isPackaged || Boolean(process.env.VITE_DEV_SERVER_URL);

  return [
    // 1. Menú de la Aplicación (App Menu)
    {
      label: app.name || 'Contact Library',
      submenu: [
        {
          role: 'about',
          label: `Acerca de ${app.name || 'Contact Library'}`,
        },
        { type: 'separator' },
        {
          label: 'Ajustes del Sistema...',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            if (options?.onOpenSettings) {
              options.onOpenSettings();
              return;
            }
            const win = getMainWindow();
            if (win && !win.isDestroyed()) {
              win.webContents.send('app:navigate', '/settings/');
            }
          },
        },
        { type: 'separator' },
        {
          role: 'services',
          label: 'Servicios',
        },
        { type: 'separator' },
        {
          role: 'hide',
          label: `Ocultar ${app.name || 'Contact Library'}`,
        },
        {
          role: 'hideOthers',
          label: 'Ocultar otros',
        },
        {
          role: 'unhide',
          label: 'Mostrar todo',
        },
        { type: 'separator' },
        {
          role: 'quit',
          label: `Salir de ${app.name || 'Contact Library'}`,
        },
      ],
    },

    // 2. Menú de Edición (Edit Menu) - Fundamental para que funcionen los atajos en inputs
    {
      label: 'Edición',
      submenu: [
        { role: 'undo', label: 'Deshacer' },
        { role: 'redo', label: 'Rehacer' },
        { type: 'separator' },
        { role: 'cut', label: 'Cortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Pegar' },
        { role: 'selectAll', label: 'Seleccionar todo' },
      ],
    },

    // 3. Menú de Visualización (View Menu)
    {
      label: 'Visualización',
      submenu: [
        { role: 'reload', label: 'Recargar' },
        { role: 'forceReload', label: 'Forzar recarga' },
        ...(isDev
          ? [
              {
                role: 'toggleDevTools' as const,
                label: 'Herramientas de Desarrollador',
              },
            ]
          : []),
        { type: 'separator' },
        { role: 'resetZoom', label: 'Tamaño real' },
        { role: 'zoomIn', label: 'Acercar' },
        { role: 'zoomOut', label: 'Alejar' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Pantalla completa' },
      ],
    },

    // 4. Menú de Ventana (Window Menu)
    {
      label: 'Ventana',
      submenu: [
        { role: 'minimize', label: 'Minimizar' },
        { role: 'zoom', label: 'Zoom' },
        { type: 'separator' },
        { role: 'front', label: 'Traer todo al frente' },
      ],
    },
  ];
}

/**
 * Configura el menú de la aplicación de forma condicionada a la plataforma.
 * En macOS instala el menú nativo completo; en Windows/Linux desactiva la barra nativa.
 */
export function setupAppMenu(
  getMainWindow: () => BrowserWindow | null,
  options?: AppMenuOptions
): void {
  if (process.platform === 'darwin') {
    const template = createMacMenuTemplate(getMainWindow, options);
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    Menu.setApplicationMenu(null);
  }
}

