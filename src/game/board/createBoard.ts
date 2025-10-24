import { cellUtils, type Color } from '../cells';
import type { PRNG } from '../rng';
import type { Board } from './types';

export function createBoard(
  nrOfRows: number,
  nrOfColumns: number,
  colors: Color[],
  rng: Readonly<PRNG>
): Board {
  return Array.from({ length: nrOfColumns }).map((_, columnIdx) =>
    Array.from({ length: nrOfRows }).map((_, rowIdx) => {
      const color = colors[rng.nextRange(0, colors.length)];
      return {
        key: cellUtils.createCellKey(rowIdx, columnIdx),
        color,
        hasPkmn: cellUtils.hasPkmn(color, rng.nextFloat()),
        cellState: 'NORMAL' as const,
      };
    })
  );
}