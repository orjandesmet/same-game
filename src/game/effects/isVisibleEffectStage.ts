import type { Effect } from './types';

export function isVisibleEffectStage(effect: Effect) {
  return effect.effectName !== 'FAINT';
}