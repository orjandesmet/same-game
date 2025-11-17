import type { CellState } from '@game/cells';
import type { Color } from '@game/creatures';
import type { EffectName } from './types';

export const EFFECT_DURATION_MS = 2000;
export const TRANSFORM_DURATION_MS = 1000;
export const METRONOME_DURATION_MS = 1500;

export const EFFECT_NAMES: Record<Color, EffectName> = {
  R: 'EMBER',
  B: 'WATER GUN',
  G: 'VINE WHIP',
  Y: 'THUNDER SHOCK',
  P: 'TRANSFORM',
  W: 'METRONOME',
};

export const EFFECT_CELL_STATES: Record<Color, CellState> = {
  R: 'BURNING',
  B: 'FLOODED',
  G: 'CUTTING',
  Y: 'SHOCKED',
  P: 'TRANSFORMING',
  W: 'NORMAL',
};
