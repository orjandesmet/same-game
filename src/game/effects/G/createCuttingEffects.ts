import type { PartyMembers } from '@game/creatures';
import { createBasicEffects } from '../createBasicEffects';
import { getCuttingGroup } from './getCuttingGroup';

export function createCuttingEffects(
  party: Partial<PartyMembers>,
  cellHasSpecialCreature: boolean
) {
  return createBasicEffects(
    getCuttingGroup(cellHasSpecialCreature),
    'G',
    party['G'],
    cellHasSpecialCreature
  );
}
