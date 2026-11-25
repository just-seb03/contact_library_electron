/**
 * @file paymentController.ts
 * @description Controlador IPC para la gestión y persistencia de pagos y cobros en SQLite.
 * El acceso a datos (columnas snake_case ↔ entidad camelCase) vive en `PaymentRepository`.
 */

import { ipcMain } from 'electron'
import type { Payment } from '../../../core/context/types'
import {
  IPC_CHANNELS,
  createIpcSuccess,
  createIpcError,
  type IpcResponse,
} from '../../../shared/types/ipc'
import { paymentRepository } from '../repositories/PaymentRepository'

/**
 * Registra todos los handlers IPC correspondientes al dominio de pagos.
 */
export function registerPaymentController(): void {
  // [payments:list] - Recupera la lista completa de pagos ordenada descendentemente por fecha
  ipcMain.handle(
    IPC_CHANNELS.PAYMENTS_LIST,
    async (): Promise<IpcResponse<Payment[]>> => {
      try {
        return createIpcSuccess(await paymentRepository.getAll())
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // [payments:saveAll] - Reemplazo atómico de la tabla de pagos dentro de una transacción SQLite
  ipcMain.handle(
    IPC_CHANNELS.PAYMENTS_SAVE_ALL,
    async (_event, payments: Payment[]): Promise<IpcResponse<boolean>> => {
      try {
        if (!Array.isArray(payments)) {
          return createIpcError('Se esperaba una lista de pagos.')
        }
        await paymentRepository.replaceAll(payments)
        return createIpcSuccess(true)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // --- Handlers de retrocompatibilidad transitoria ---
  ipcMain.handle('db:payments:getAll', () => paymentRepository.getAll())

  ipcMain.handle('db:payments:saveAll', async (_event, payments: Payment[]) => {
    await paymentRepository.replaceAll(payments)
    return true
  })
}
