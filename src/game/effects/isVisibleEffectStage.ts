import type { Effect } from './types';

export function isVisibleEffectStage(effect: Pick<Effect, 'effectName'>) {
  return effect.effectName !== 'FAINT';
}
