import type { PartyMembers } from '@game/creatures';
import { createBasicEffects } from '../createBasicEffects';
import { getFloodedGroup } from './getFloodedGroup';

export function createFloodedEffects(
  party: Partial<PartyMembers>,
  cellHasSpecialCreature: boolean
) {
  return createBasicEffects(
    getFloodedGroup(cellHasSpecialCreature),
    'B',
    party['B'],
    cellHasSpecialCreature
  );
}
