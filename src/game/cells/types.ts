import type { Color, EMPTY } from '@game/creatures';

export type CellColor = Readonly<Color | typeof EMPTY>;
export type CellKey = Readonly<`${number}:${number}`>;
export type CellState = Readonly<
  'NORMAL' | 'BURNING' | 'FLOODED' | 'CUTTING' | 'SHOCKED' | 'TRANSFORMING'
>;
export type Cell = Readonly<{
  key: CellKey;
  color: CellColor;
  hasCreature: boolean;
  hasSpecialCreature: boolean;
  level: number;
  cellState: CellState;
}>;
