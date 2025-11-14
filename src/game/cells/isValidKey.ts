import type { CellKey } from './types';

export function isValidKey(input: unknown): input is CellKey {
  if (!input || typeof input !== 'string' || !input.includes(':')) {
    return false;
  }
  const splitted = input.split(':').filter(value => !!value);
  if (splitted.length !== 2) {
    return false;
  }

  const [rowIdx, columnIdx] = splitted.map(Number);

  if (isNaN(rowIdx) || isNaN(columnIdx)) {
    return false;
  }

  return true;
}