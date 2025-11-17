import type { Color, PartyMembers } from '@game/creatures';
import type { PRNG } from '@game/rng';
import { getSelectedColors } from '../../getSelectedPartyMembers';
import { createBasicEffects } from '../createBasicEffects';
import type { Effects } from '../types';
import { getShockedGroup } from './getShockedGroup';

export function createShockedEffects(
  party: Partial<PartyMembers>,
  rng: PRNG,
  cellHasSpecialCreature: boolean
): Effects {
  const additionalColors = cellHasSpecialCreature
    ? getAdditionalColors(party, rng)
    : [];

  return createBasicEffects(
    getShockedGroup(additionalColors),
    'Y',
    party['Y'],
    cellHasSpecialCreature
  );
}

function getAdditionalColors(party: Partial<PartyMembers>, rng: PRNG): Color[] {
  const colors = getSelectedColors(party);
  const additionalColorIdxes = [
    rng.nextRange(0, colors.length),
    rng.nextRange(0, colors.length),
  ];
  if (additionalColorIdxes[0] === additionalColorIdxes[1]) {
    additionalColorIdxes[1] =
      additionalColorIdxes[0] === 0 ? 1 : additionalColorIdxes[0] - 1;
  }
  return additionalColorIdxes.map((idx) => colors[idx]);
}
