import type { PartyMembers } from '@game/creatures';
import type { Group } from '../board';
import type { CellColor } from '../cells';
import type { PRNG } from '../rng';
import { createBasicEffects } from './createBasicEffects';
import { createMetronomeEffects } from './createMetronomeEffects';
import { createShockedEffects } from './createShockedEffects';
import { createTransformEffects } from './createTransformEffects';
import { getBurningGroup } from './getBurningGroup';
import { getCuttingGroup } from './getCuttingGroup';
import { getFloodedGroup } from './getFloodedGroup';
import type { Effects } from './types';

export function getEffectsForCell(
  cellColor: CellColor,
  cellHasM: boolean,
  allGroups: Group[],
  party: Partial<PartyMembers>,
  rng: Readonly<PRNG>
): Effects | null {
  switch (cellColor) {
    case 'R':
      return createBasicEffects(getBurningGroup(cellHasM), 'R', 'EMBER', 'BURNING', party['R'], cellHasM);
    case 'B':
      return createBasicEffects(getFloodedGroup(cellHasM), 'B', 'WATER GUN', 'FLOODED', party['B'], cellHasM);
    case 'G':
      return createBasicEffects(getCuttingGroup(cellHasM), 'G', 'VINE WHIP', 'CUTTING', party['G'], cellHasM);
    case 'Y': {
      return createShockedEffects(party, rng, cellHasM);
    }
    case 'P':
      return createTransformEffects(allGroups, party, rng, cellHasM);
    case 'W': 
      return createMetronomeEffects(allGroups, party, rng, getEffectsForCell, cellHasM);
    default:
      return null;
  }
}