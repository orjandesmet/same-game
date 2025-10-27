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