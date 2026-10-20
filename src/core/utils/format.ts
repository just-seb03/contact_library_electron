/**
 * Formatea un número al estándar monetario chileno (CLP, ej. $450.000)
 */
export const formatCLP = (amount: number): string => {
  try {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${Math.round(amount).toLocaleString('es-CL')}`;
  }
};
