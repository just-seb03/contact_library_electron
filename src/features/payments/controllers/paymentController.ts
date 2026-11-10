import { ipcMain } from 'electron'
import { paymentRepository } from '../repositories/PaymentRepository'
import type { Payment } from '../../../core/context/types'

export function registerPaymentController(): void {
  // 1. Obtener todos los pagos (con soporte de filtros opcionales)
  ipcMain.handle('db:payments:getAll', async (_event, filters) => {
    return paymentRepository.getAll(filters)
  })

  // 2. Obtener pago por ID
  ipcMain.handle('db:payments:getById', async (_event, id: string) => {
    return paymentRepository.getById(id)
  })

  // 3. Crear pago atómicamente
  ipcMain.handle('db:payments:create', async (_event, paymentData: any) => {
    return paymentRepository.create(paymentData)
  })

  // 4. Actualizar pago atómicamente
  ipcMain.handle('db:payments:update', async (_event, id: string, paymentData: any) => {
    return paymentRepository.update(id, paymentData)
  })

  // 5. Eliminar pago
  ipcMain.handle('db:payments:delete', async (_event, id: string) => {
    return paymentRepository.delete(id)
  })

  // 6. Obtener balance/resumen financiero
  ipcMain.handle('db:payments:getSummary', async (_event, clientId?: number) => {
    return paymentRepository.getSummary(clientId)
  })

  // 7. Compatibilidad temporal con saveAll (ahora de forma no destructiva / upsert)
  ipcMain.handle('db:payments:saveAll', async (_event, payments: Payment[]) => {
    for (const p of payments) {
      const existing = await paymentRepository.getById(p.id)
      if (existing) {
        await paymentRepository.update(p.id, p)
      } else {
        await paymentRepository.create(p)
      }
    }
    return true
  })
}
