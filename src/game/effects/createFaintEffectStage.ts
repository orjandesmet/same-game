import type { Color } from '@game/creatures';
import type { Effect } from './types';

export function createFaintEffectStage(
  color: Color,
  level: number,
  cellHasSpecialCreature: boolean
): Effect {
  return {
    color,
    level,
    hasSpecialCreature: cellHasSpecialCreature,
    effectName: 'FAINT',
    fn: (board, group, { cellRemove }) => cellRemove(board, group),
    duration: 0,
  };
}
