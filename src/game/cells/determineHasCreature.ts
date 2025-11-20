import { type ExtendedColor, type PartyMembers } from '@game/creatures';

export function determineHasCreature(
  color: ExtendedColor,
  rngValue: Readonly<number>,
  probability: Partial<PartyMembers>
): Readonly<boolean> {
  return rngValue < (probability[color] ?? 0) / 100;
}
