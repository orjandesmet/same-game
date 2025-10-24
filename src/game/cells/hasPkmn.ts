import { BASE_PKMN_PROBABILITY } from './constants';
import type { Color, PartyMembers } from './types';

export function hasPkmn(color: Color, rngValue: Readonly<number>, probability: Partial<PartyMembers> = BASE_PKMN_PROBABILITY): Readonly<boolean> {
  return rngValue < (probability[color] || 0);
}