import { cellUtils } from '../cells';
import type { Column } from './types';

export function isEmptyColumn(column: Column): Readonly<boolean> {
  return column.every(cellUtils.isEmptyCell);
}