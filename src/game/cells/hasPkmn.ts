import { BASE_PKMN_PROBABILITY, type Color, type PartyMembers } from '@game/pkmn';

export function hasPkmn(
  color: Color,
  rngValue: Readonly<number>,
  probability: Partial<PartyMembers> = BASE_PKMN_PROBABILITY
): Readonly<boolean> {
  return rngValue < (probability[color] || 0);
}
