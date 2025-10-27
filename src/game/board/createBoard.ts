import type { PartyMembers } from '@game/pkmn';
import { cellUtils } from '../cells';
import { getSelectedPartyMembers } from '../getSelectedPartyMembers';
import type { PRNG } from '../rng';
import type { Board } from './types';

export function createBoard(
  nrOfRows: number,
  nrOfColumns: number,
  partyMembers: PartyMembers,
  rng: Readonly<PRNG>
): Board {
  const { selectedPartyMembers, colors } =
    getSelectedPartyMembers(partyMembers);
  return Array.from({ length: nrOfColumns }).map((_, columnIdx) =>
    Array.from({ length: nrOfRows }).map((_, rowIdx) => {
      const color = colors[rng.nextRange(0, colors.length)];
      return {
        key: cellUtils.createCellKey(rowIdx, columnIdx),
        color,
        hasPkmn: cellUtils.hasPkmn(
          color,
          rng.nextFloat(),
          selectedPartyMembers
        ),
        level: partyMembers[color],
        cellState: 'NORMAL' as const,
      };
    })
  );
}
