import type { PartyMembers } from '@game/pkmn';
import { cellUtils } from '../cells';
import { getSelectedColors } from '../getSelectedPartyMembers';
import type { PRNG } from '../rng';
import type { Board } from './types';

export function createBoard(
  nrOfRows: number,
  nrOfColumns: number,
  partyMembers: Partial<PartyMembers>,
  rng: Readonly<PRNG>
): Board {
  const colors = getSelectedColors(partyMembers);
  return Array.from({ length: nrOfColumns }).map((_, columnIdx) =>
    Array.from({ length: nrOfRows }).map((_, rowIdx) => {
      const color = colors[rng.nextRange(0, colors.length)];
      return {
        key: cellUtils.createCellKey(rowIdx, columnIdx),
        color,
        hasPkmn: cellUtils.hasPkmn(
          color,
          rng.nextFloat(),
          partyMembers
        ),
        level: partyMembers[color] ?? 1,
        cellState: 'NORMAL' as const,
      };
    })
  );
}
