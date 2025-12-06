export function formatRupiah(amount: number) {
  return amount
    .toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    })
    .replace(/,00$/, '');
}
