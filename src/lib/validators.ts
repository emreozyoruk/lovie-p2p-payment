const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_AMOUNT_CENTS = 1_000_000;

export function validateEmail(email: string): string | null {
  if (!email || !email.trim()) return 'Email is required';
  if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email';
  return null;
}

export function validateAmount(amountCents: number): string | null {
  if (!Number.isInteger(amountCents)) return 'Amount must be a whole number of cents';
  if (amountCents <= 0) return 'Amount must be greater than zero';
  if (amountCents > MAX_AMOUNT_CENTS) return 'Amount is too high. Max is $10,000';
  return null;
}

export function validateSelfRequest(senderEmail: string, recipientEmail: string): string | null {
  if (senderEmail.toLowerCase().trim() === recipientEmail.toLowerCase().trim()) {
    return "You can't request money from yourself";
  }
  return null;
}

export function dollarsToCents(dollars: string): number {
  const cleaned = dollars.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

export function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function formatCurrency(cents: number): string {
  return `$${centsToDollars(cents)}`;
}
