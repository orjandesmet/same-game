import type { Color } from './types';

const PKMN_PROBABILITY: Readonly<Record<Color, number>> = {
  R: 0.1,
  B: 0.1,
  G: 0.1,
  Y: 0.01,
  P: 0.01,
  W: 0.01,
};

export function hasPkmn(color: Color, rngValue: Readonly<number>): Readonly<boolean> {
  return rngValue < (PKMN_PROBABILITY[color] || 0);
}