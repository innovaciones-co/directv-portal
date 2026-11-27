/**
 * Keeps only digits in a field as the customer types or pastes, cut to `max`, and writes them
 * back so a typed letter doesn't stay visible. A pasted phone loses its 57; a pasted whole
 * serial keeps its last digits (the ones asked for).
 */
export function onlyDigits(field: HTMLInputElement, max: number, mode: 'phone' | 'last' | 'first' = 'first'): string {
  let digits = field.value.replace(/[^0-9]/g, '');
  if (mode === 'phone' && digits.length > max && digits.startsWith('57')) digits = digits.slice(2);
  digits = mode === 'last' && digits.length > max ? digits.slice(-max) : digits.slice(0, max);
  field.value = digits;
  return digits;
}

/** 3001234567 → 300 123 4567 */
export function formatPhone(number: string): string {
  return number.length === 10 ? `${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}` : number;
}
