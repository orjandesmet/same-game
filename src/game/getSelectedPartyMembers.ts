import { SPECIAL_CREATURE, type Color, type PartyMembers } from './creatures';

export function getSelectedPartyMembers(partyMembers: PartyMembers): {
  selectedPartyMembers: Partial<PartyMembers>;
  colors: Color[];
} {
  const selectedPartyMembers: Partial<PartyMembers> = Object.fromEntries(
    Object.entries(partyMembers).filter(([, lvl]) => lvl > 0)
  );
  const colors = getSelectedColors(selectedPartyMembers);

  return { selectedPartyMembers, colors };
}

export function getSelectedColors(partyMembers: Partial<PartyMembers>) {
  return Object.keys(partyMembers).filter(
    (color) => color !== SPECIAL_CREATURE
  ) as Color[];
}
