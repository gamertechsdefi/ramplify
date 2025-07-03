export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function formatCrypto(amount: number, currency: string) {
  return `${amount.toFixed(6)} ${currency}`;
}