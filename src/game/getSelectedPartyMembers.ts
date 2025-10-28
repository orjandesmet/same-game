import type { Color, PartyMembers } from './pkmn';

export function getSelectedPartyMembers(partyMembers: PartyMembers): {
  selectedPartyMembers: Partial<PartyMembers>;
  colors: Color[];
} {
  const selectedPartyMembers: Partial<PartyMembers> = Object.fromEntries(
    Object.entries(partyMembers).filter(([, lvl]) => lvl > 0)
  );
  const colors = getSelectedColors(partyMembers);

  return { selectedPartyMembers, colors };
}

export function getSelectedColors(partyMembers: Partial<PartyMembers>) {
  return Object.keys(partyMembers) as Color[];
}
