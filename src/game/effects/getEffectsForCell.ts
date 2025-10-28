import type { PartyMembers } from '@game/pkmn';
import type { Group } from '../board';
import type { CellColor } from '../cells';
import type { PRNG } from '../rng';
import { createBasicEffects } from './createBasicEffects';
import { createMetronomeEffects } from './createMetronomeEffects';
import { createTransformEffects } from './createTransformEffects';
import { getBurningGroup } from './getBurningGroup';
import { getCuttingGroup } from './getCuttingGroup';
import { getFloodedGroup } from './getFloodedGroup';
import { getShockedGroup } from './getShockedGroup';
import type { Effects } from './types';

export function getEffectsForCell(
  cellColor: CellColor,
  allGroups: Group[],
  party: Partial<PartyMembers>,
  rng: Readonly<PRNG>
): Effects | null {
  switch (cellColor) {
    case 'R':
      return createBasicEffects(getBurningGroup, 'R', 'EMBER', 'BURNING', party['R']);
    case 'B':
      return createBasicEffects(getFloodedGroup, 'B', 'WATER GUN', 'FLOODED', party['B']);
    case 'G':
      return createBasicEffects(getCuttingGroup, 'G', 'VINE WHIP', 'CUTTING', party['G']);
    case 'Y':
      return createBasicEffects(getShockedGroup, 'Y', 'THUNDER SHOCK', 'SHOCKED', party['Y']);
    case 'P':
      return createTransformEffects(allGroups, party, rng);
    case 'W': 
      return createMetronomeEffects(allGroups, party, rng, getEffectsForCell);
    default:
      return null;
  }
}