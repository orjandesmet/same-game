import type { Color, ExtendedColor, PartyMembers } from './types';

export const BASE_CREATURE_PROBABILITY: PartyMembers = {
  R: 12,
  B: 12,
  G: 12,
  Y: 6,
  P: 3,
  W: 1,
  M: 0.25,
};

export const CREATURE_NAMES: Record<ExtendedColor, string[]> = {
  R: ['CHARMANDER', 'CHARMELEON', 'CHARIZARD'],
  B: ['SQUIRTLE', 'WARTORTLE', 'BLASTOISE'],
  Y: ['PIKACHU'],
  G: ['BULBASAUR', 'IVYSAUR', 'VENUSAUR'],
  P: ['DITTO'],
  W: ['TOGEPI'],
  M: ['MEW']
}

export const EVOLUTION_LEVELS: Record<Color, [0, ...number[]]> = {
  R: [0, 16, 36],
  B: [0, 15, 36],
  Y: [0],
  G: [0, 16, 32],
  P: [0],
  W: [0],
}