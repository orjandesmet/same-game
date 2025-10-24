/** This should be in a different place */
export const COLORS = ['R', 'B', 'Y', 'G', 'P', 'W'] as const;
export const EMPTY = '_' as const;
export type Color = Readonly<(typeof COLORS)[number]>;
export type PartyMembers = Record<Color, number>;


export type CellColor = Readonly<Color | typeof EMPTY>;
export type CellKey = Readonly<`${number}:${number}`>;
export type CellState = Readonly<
  'NORMAL' | 'BURNING' | 'FLOODED' | 'CUTTING' | 'SHOCKED' | 'TRANSFORMING'
>;
export type Cell = Readonly<{
  key: CellKey;
  color: CellColor;
  hasPkmn: boolean;
  cellState: CellState;
}>;