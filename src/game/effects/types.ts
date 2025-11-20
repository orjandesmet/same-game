import type { Board, ColumnIdx, Group, RowIdx } from '@game/board';
import type { Cell } from '@game/cells';
import type { Color } from '@game/creatures';

export type EffectName =
  | 'EMBER'
  | 'WATER GUN'
  | 'VINE WHIP'
  | 'THUNDER SHOCK'
  | 'TRANSFORM'
  | 'METRONOME'
  | 'FAINT';

export type EffectGroupFn = (
  board: Board,
  source: { rowIdx: RowIdx; columnIdx: ColumnIdx },
  _debug: DebugFn
) => Group;

export type EffectTools = Readonly<{
  cellUpdate: (
    board: Board,
    group: Group,
    updatedCell: Partial<
      Pick<Cell, 'color' | 'cellState' | 'hasCreature' | 'level'>
    >
  ) => Board;
  cellRemove: (board: Board, group: Group) => Board;
  _debug: DebugFn;
}>;
export type Effect = Readonly<{
  color: Color;
  level: number;
  effectName?: Readonly<EffectName>;
  hasSpecialCreature?: boolean;
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
