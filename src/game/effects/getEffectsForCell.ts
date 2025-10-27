import type { Color } from '@game/pkmn';
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
  colors: Color[],
  rng: Readonly<PRNG>
): Effects | null {
  switch (cellColor) {
    case 'R':
      return createBasicEffects(getBurningGroup, 'EMBER', 'BURNING');
    case 'B':
      return createBasicEffects(getFloodedGroup, 'WATER GUN', 'FLOODED');
    case 'G':
      return createBasicEffects(getCuttingGroup, 'VINE WHIP', 'CUTTING');
    case 'Y':
      return createBasicEffects(getShockedGroup, 'THUNDER SHOCK', 'SHOCKED');
    case 'P':
      return createTransformEffects(allGroups, colors, rng);
    case 'W': 
      return createMetronomeEffects(allGroups, colors, rng, getEffectsForCell);
    default:
      return null;
  }
}