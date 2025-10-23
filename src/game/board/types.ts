import type { Cell, CellKey } from '../cells';

export type Group = Readonly<CellKey[]>;
export type Column = Readonly<Cell[]>;
export type Board = Readonly<Column[]>;

export type RowIdx = Readonly<number>;
export type ColumnIdx = Readonly<number>;
export type FlatBoard = Readonly<
  Array<Cell & { rowIdx: RowIdx; columnIdx: ColumnIdx }>
>;