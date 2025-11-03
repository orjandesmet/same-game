import type { Color } from '@game/pkmn';
import type { CellState } from '../cells';
import { EFFECT_DURATION_MS } from './constants';
import { createFaintEffectStage } from './createFaintEffectStage';
import type { EffectGroupFn, EffectName, Effects } from './types';

export function createBasicEffects(
  groupFn: EffectGroupFn,
  color: Color,
  effectName: Readonly<EffectName>,
  cellState: CellState,
  level: number = 1,
  cellHasM: boolean = false,
  durationInMs: Readonly<number> = EFFECT_DURATION_MS,
): Effects {
  return {
    groupFn,
    stages: [
      {
        color,
        level,
        effectName,
        hasM: cellHasM,
        fn: (board, group, { cellUpdate }) =>
          cellUpdate(board, group, { cellState, hasPkmn: false }),
        duration: durationInMs,
      },
      createFaintEffectStage(color, level, cellHasM),
    ],
  };
}