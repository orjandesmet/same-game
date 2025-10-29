import type { Color } from '@game/pkmn';
import type { Effect } from './types';

export function createFaintEffectStage(color: Color, level: number): Effect {
  return {
        color,
        level,
        effectName: 'FAINT',
        fn: (board, group, { cellRemove }) => cellRemove(board, group),
        duration: 0,
      };
}