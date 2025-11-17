import type { Group } from '@game/board';
import type { CellColor } from '@game/cells';
import type { PartyMembers } from '@game/creatures';
import type { PRNG } from '@game/rng';
import { createFloodedEffects } from './B/createFloodedEffects';
import { createCuttingEffects } from './G/createCuttingEffects';
import { createTransformEffects } from './P/createTransformEffects';
import { createBurningEffects } from './R/createBurningEffects';
import type { Effects } from './types';
import { createMetronomeEffects } from './W/createMetronomeEffects';
import { createShockedEffects } from './Y/createShockedEffects';

export function getEffectsForCell(
  cellColor: CellColor,
  cellHasSpecialCreature: boolean,
  allGroups: Group[],
  party: Partial<PartyMembers>,
  rng: Readonly<PRNG>
): Effects | null {
  switch (cellColor) {
    case 'R':
      return createBurningEffects(party, cellHasSpecialCreature);
    case 'B':
      return createFloodedEffects(party, cellHasSpecialCreature);
    case 'G':
      return createCuttingEffects(party, cellHasSpecialCreature);
    case 'Y': {
      return createShockedEffects(party, rng, cellHasSpecialCreature);
    }
    case 'P':
      return createTransformEffects(
        allGroups,
        party,
        rng,
        cellHasSpecialCreature
      );
    case 'W':
      return createMetronomeEffects(
        allGroups,
        party,
        rng,
        getEffectsForCell,
        cellHasSpecialCreature
      );
    default:
      return null;
  }
}
