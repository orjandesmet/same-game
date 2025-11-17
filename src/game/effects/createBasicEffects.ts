import type { CellState } from '@game/cells';
import type { Color } from '@game/creatures';
import {
  EFFECT_CELL_STATES,
  EFFECT_DURATION_MS,
  EFFECT_NAMES,
} from './constants';
import { createFaintEffectStage } from './createFaintEffectStage';
import type { EffectGroupFn, EffectName, Effects } from './types';

type BasicEffectOptions = {
  effectName?: EffectName;
  cellState?: CellState;
};

export function createBasicEffects(
  groupFn: EffectGroupFn,
  color: Color,
  level: number = 1,
  cellHasSpecialCreature: boolean = false,
  { effectName, cellState }: BasicEffectOptions = {}
): Effects {
  return {
    groupFn,
    stages: [
      {
        color,
        level,
        effectName: effectName ?? EFFECT_NAMES[color],
        hasSpecialCreature: cellHasSpecialCreature,
        fn: (board, group, { cellUpdate }) =>
          cellUpdate(board, group, {
            cellState: cellState ?? EFFECT_CELL_STATES[color],
            hasCreature: false,
          }),
        duration: EFFECT_DURATION_MS,
      },
      createFaintEffectStage(color, level, cellHasSpecialCreature),
    ],
  };
}
