export function getTodayInputValue(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

export function formatPaymentDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
}

export function toDateInputValue(value: string): string {
  const match = value.match(/^(\d{1,2})\s+([A-Za-z]{3}),\s+(\d{4})$/);
  if (match) {
    const month = new Date(`${match[2]} 1, ${match[3]}`).getMonth() + 1;
    return `${match[3]}-${String(month).padStart(2, '0')}-${String(Number(match[1])).padStart(2, '0')}`;
  }
  return value;
}
