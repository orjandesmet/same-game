import type { PartyMembers } from '@game/creatures';
import { createBasicEffects } from '../createBasicEffects';
import { getBurningGroup } from './getBurningGroup';

export function createBurningEffects(
  party: Partial<PartyMembers>,
  cellHasSpecialCreature: boolean
) {
  return createBasicEffects(
    getBurningGroup(cellHasSpecialCreature),
    'R',
    party['R'],
    cellHasSpecialCreature
  );
}
