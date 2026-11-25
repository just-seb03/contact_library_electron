/**
 * @file macAdapter.ts
 * @description Particularidades de las notificaciones de macOS.
 *
 * Por ahora reutiliza `BaseAdapter` sin cambios, y eso ya funciona en Mac:
 * - El icono lo pone el sistema (el de la app); no se pasa `icon` a propósito, porque macOS
 *   lo mostraría como imagen adjunta a la derecha del aviso.
 * - `timeoutType` se ignora: en Mac la persistencia depende del estilo de alerta
 *   (`NSUserNotificationAlertStyle` en `electron-builder.json5` → `mac.extendInfo`).
 *
 * Al portar la app (plan de notificaciones, paso 11) se puede sobrescribir `buildOptions()`
 * para añadir `subtitle`, `sound: 'default'` o botones de acción (`actions`).
 */

import { BaseAdapter } from './baseAdapter'

export class MacAdapter extends BaseAdapter {
  constructor() {
    super('darwin')
  }
}
