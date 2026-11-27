export const MAX_PHONE_DIGITS = 15;

/** Extrae solo dígitos de cualquier cadena (máx. 15). */
export function extractDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, MAX_PHONE_DIGITS);
}

/** Formatea dígitos como teléfono con espacios: "+56 9 8412 3390". */
export function formatPhone(value: string): string {
  const digits = extractDigits(value);
  if (!digits) return '';
  if (digits.startsWith('56')) {
    return `+${[digits.slice(0, 2), digits.slice(2, 3), digits.slice(3, 7), digits.slice(7)]
      .filter(Boolean).join(' ')}`;
  }
  return `+${[digits.slice(0, 2), ...(digits.slice(2).match(/.{1,4}/g) ?? [])]
    .filter(Boolean).join(' ')}`;
}

/** Valida entre 7 y 15 dígitos. */
export function isValidPhone(value: string): boolean {
  const len = extractDigits(value).length;
  return len >= 7 && len <= MAX_PHONE_DIGITS;
}
