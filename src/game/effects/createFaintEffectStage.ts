import type { Color } from '@game/creatures';
import type { Effect } from './types';

export function createFaintEffectStage(color: Color, level: number, cellHasM: boolean): Effect {
  return {
        color,
        level,
        hasM: cellHasM,
        effectName: 'FAINT',
        fn: (board, group, { cellRemove }) => cellRemove(board, group),
        duration: 0,
      };
}