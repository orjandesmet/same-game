import { MEW, type Color, type PartyMembers } from './pkmn';

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
  return Object.keys(partyMembers).filter((color) => color !== MEW) as Color[];
}
