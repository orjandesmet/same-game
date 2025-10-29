import type { Color, EMPTY } from '@game/pkmn';

export type CellColor = Readonly<Color | typeof EMPTY>;
export type CellKey = Readonly<`${number}:${number}`>;
export type CellState = Readonly<
  'NORMAL' | 'BURNING' | 'FLOODED' | 'CUTTING' | 'SHOCKED' | 'TRANSFORMING'
>;
export type Cell = Readonly<{
  key: CellKey;
  color: CellColor;
  hasPkmn: boolean;
  level: number;
  cellState: CellState;
}>;
