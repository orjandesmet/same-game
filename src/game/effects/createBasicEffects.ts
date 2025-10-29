import type { Color } from '@game/pkmn';
import type { CellState } from '../cells';
import { EFFECT_DURATION_MS } from './constants';
import type { EffectGroupFn, EffectName, Effects } from './types';
import { createFaintEffectStage } from './createFaintEffectStage';

export function createBasicEffects(
  groupFn: EffectGroupFn,
  color: Color,
  effectName: Readonly<EffectName>,
  cellState: CellState,
  level: number = 1,
  durationInMs: Readonly<number> = EFFECT_DURATION_MS,
): Effects {
  return {
    groupFn,
    stages: [
      {
        color,
        level,
        effectName,
        fn: (board, group, { cellUpdate }) =>
          cellUpdate(board, group, { cellState, hasPkmn: false }),
        duration: durationInMs,
      },
      createFaintEffectStage(color, level),
    ],
  };
}