import type { Cell } from '../cells';
import type { Board, ColumnIdx, Group, RowIdx } from '../board';

export type EffectGroupFn = (
  board: Board,
  source: { rowIdx: RowIdx; columnIdx: ColumnIdx }
) => Group;

export type EffectTools = Readonly<{
  cellUpdate: (
    board: Board,
    group: Group,
    updatedCell: Partial<Pick<Cell, 'color' | 'cellState' | 'hasPkmn'>>
  ) => Board;
  cellRemove: (board: Board, group: Group) => Board;
  debug: (...args: unknown[]) => void;
}>;
export type Effect = Readonly<{
  effectName?: Readonly<string>;
  fn: (
    board: Board,
    group: Group,
    { cellUpdate, cellRemove }: EffectTools
  ) => Board;
  duration: Readonly<number>;
}>;
export type Effects = Readonly<{
  stages: Effect[];
  groupFn: EffectGroupFn;
}>;
