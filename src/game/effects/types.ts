import type { Color } from '@game/pkmn';
import type { Board, ColumnIdx, Group, RowIdx } from '../board';
import type { Cell } from '../cells';

export type EffectName = 'EMBER' | 'WATER GUN' | 'VINE WHIP' | 'THUNDER SHOCK' | 'TRANSFORM' | 'METRONOME' | 'FAINT';

export type EffectGroupFn = (
  board: Board,
  source: { rowIdx: RowIdx; columnIdx: ColumnIdx },
  _debug: DebugFn,
) => Group;

export type EffectTools = Readonly<{
  cellUpdate: (
    board: Board,
    group: Group,
    updatedCell: Partial<Pick<Cell, 'color' | 'cellState' | 'hasPkmn' | 'level'>>
  ) => Board;
  cellRemove: (board: Board, group: Group) => Board;
  _debug: DebugFn;
}>;
export type Effect = Readonly<{
  color: Color;
  level: number;
  effectName?: Readonly<EffectName>;
  hasM?: boolean;
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
