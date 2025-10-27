import type { Color, PartyMembers } from './pkmn';

export function getSelectedPartyMembers(partyMembers: PartyMembers): {
  selectedPartyMembers: Partial<PartyMembers>;
  colors: Color[];
} {
  const selectedPartyMembers: Partial<PartyMembers> = Object.fromEntries(
    Object.entries(partyMembers).filter(([, lvl]) => lvl > 0)
  );
  const colors = Object.keys(selectedPartyMembers) as Color[];

  return { selectedPartyMembers, colors };
}
