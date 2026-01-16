export type NumberFormat = {
  notation?: 'compact' | 'standard';
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export function intlFormatNumber(value: number, numberFormat: NumberFormat = {}) {
  const { notation = 'standard', minimumFractionDigits, maximumFractionDigits = 0 } = numberFormat;

  return new Intl.NumberFormat('nb-NO', {
    style: 'decimal',
    notation,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}
