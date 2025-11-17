import {
  BASE_CREATURE_PROBABILITY,
  COLORS,
  type Color,
  type PartyMembers,
} from './creatures';

const STARTING_COLORS: Color[] = ['R', 'Y', 'W', 'B'];
export function buildBasePartyMembers(): PartyMembers {
  const party = structuredClone(BASE_CREATURE_PROBABILITY);

  Object.keys(party)
    .filter(isExcludedColor)
    .forEach((color) => {
      party[color] = -BASE_CREATURE_PROBABILITY[color];
    });

  return party;
}

function isExcludedColor(color: string): color is Color {
  return (
    COLORS.includes(color as Color) && !STARTING_COLORS.includes(color as Color)
  );
}
