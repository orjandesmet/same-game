import { BASE_PKMN_PROBABILITY, COLORS, type Color, type PartyMembers } from '@game/cells';
import { useState } from 'react';

export function useGameOptions() {
  const [partyMembers, setPartyMembers] = useState<PartyMembers>(buildBasePartyMembers());
  const [nrOfColumns, setNrOfColumns] = useState(10);
  const [nrOfRows, setNrOfRows] = useState(10);

    return {
      nrOfColumns,
      nrOfRows,
      partyMembers,
      setNrOfColumns,
      setNrOfRows,
      setPartyMembers,
    }
}

const STARTING_COLORS: Color[] = ['R', 'Y', 'W', 'B'];
function buildBasePartyMembers(): PartyMembers {
  const party = structuredClone(BASE_PKMN_PROBABILITY);

  Object.keys(party).filter(isExcludedColor).forEach((color) => {party[color] = -BASE_PKMN_PROBABILITY[color]});

  return party;
}

function isExcludedColor(color: string): color is Color {
  return COLORS.includes(color as Color) && !STARTING_COLORS.includes(color as Color);
}