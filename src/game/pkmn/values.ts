import type { Color, PartyMembers } from './types';

export const BASE_PKMN_PROBABILITY: PartyMembers = {
  R: 0.12,
  B: 0.12,
  G: 0.12,
  Y: 0.06,
  P: 0.03,
  W: 0.01,
};

export const PKMN_NAMES: Record<Color, string> = {
  R: 'CHARMANDER',
  B: 'SQUIRTLE',
  Y: 'PIKACHU',
  G: 'BULBASAUR',
  P: 'DITTO',
  W: 'TOGEPI',
}

export const EVOLUTION_LEVELS: Record<Color, number[]> = {
  R: [0],
  B: [0],
  Y: [0],
  G: [0],
  P: [0],
  W: [0],
}