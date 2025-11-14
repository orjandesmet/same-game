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
  cellHasSpecialCreature: boolean,
  allGroups: Group[],
  party: Partial<PartyMembers>,
  rng: Readonly<PRNG>
): Effects | null {
  switch (cellColor) {
    case 'R':
      return createBasicEffects(getBurningGroup(cellHasSpecialCreature), 'R', 'EMBER', 'BURNING', party['R'], cellHasSpecialCreature);
    case 'B':
      return createBasicEffects(getFloodedGroup(cellHasSpecialCreature), 'B', 'WATER GUN', 'FLOODED', party['B'], cellHasSpecialCreature);
    case 'G':
      return createBasicEffects(getCuttingGroup(cellHasSpecialCreature), 'G', 'VINE WHIP', 'CUTTING', party['G'], cellHasSpecialCreature);
    case 'Y': {
      return createShockedEffects(party, rng, cellHasSpecialCreature);
    }
    case 'P':
      return createTransformEffects(allGroups, party, rng, cellHasSpecialCreature);
    case 'W': 
      return createMetronomeEffects(allGroups, party, rng, getEffectsForCell, cellHasSpecialCreature);
    default:
      return null;
  }
}