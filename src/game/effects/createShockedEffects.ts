import type { Color, PartyMembers } from '@game/pkmn';
import type { PRNG } from '@game/rng';
import { getSelectedColors } from '../getSelectedPartyMembers';
import { createBasicEffects } from './createBasicEffects';
import { getShockedGroup } from './getShockedGroup';
import type { Effects } from './types';

export function createShockedEffects(party: Partial<PartyMembers>, rng: PRNG, cellHasM: boolean): Effects {
  const additionalColors = cellHasM ? getAdditionalColors(party, rng) : [];
  
  return createBasicEffects(getShockedGroup(additionalColors), 'Y', 'THUNDER SHOCK', 'SHOCKED', party['G'], cellHasM);
}

function getAdditionalColors(party: Partial<PartyMembers>, rng: PRNG): Color[] {
  const colors = getSelectedColors(party);
  const additionalColorIdxes = [
    rng.nextRange(0, colors.length),
    rng.nextRange(0, colors.length),
  ];
  if (additionalColorIdxes[0] === additionalColorIdxes[1]) {
    additionalColorIdxes[1] = additionalColorIdxes[0] === 0 ? 1 : additionalColorIdxes[0] - 1;
  } 
  return additionalColorIdxes.map((idx) => colors[idx]);
}