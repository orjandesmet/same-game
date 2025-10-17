export const COLORS = ['R', 'B', 'Y', 'G', 'W'] as const;
export const EMPTY = '_' as const;
export type CellValue = typeof COLORS[number] | typeof EMPTY;
export type CellKey = `${number}:${number}`;
export type Cell = {key: CellKey; value: CellValue;};
export type Board = Cell[][];
export type FlatBoard = Array<Cell & {rowIdx: number, columnIdx: number}>;
