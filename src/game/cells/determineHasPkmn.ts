import {
  BASE_PKMN_PROBABILITY,
  type ExtendedColor,
  type PartyMembers,
} from '@game/pkmn';

export function determineHasPkmn(
  color: ExtendedColor,
  rngValue: Readonly<number>,
  probability: Partial<PartyMembers> = BASE_PKMN_PROBABILITY
): Readonly<boolean> {
  return rngValue < (probability[color] ?? 0) / 100;
}
