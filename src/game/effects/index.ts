import { calculateEffectsDuration } from './calculateEffectsDuration';
import { getEffectsForCell } from './getEffectsForCell';
import { isVisibleEffectStage } from './isVisibleEffectStage';
import { runEffects } from './runEffects';

export type { Effect } from './types';

export {
  EFFECT_DURATION_MS,
  METRONOME_DURATION_MS,
  TRANSFORM_DURATION_MS
} from './constants';

export const effectUtils = {
  calculateEffectsDuration,
  getEffectsForCell,
  isVisibleEffectStage,
  runEffects,
};
