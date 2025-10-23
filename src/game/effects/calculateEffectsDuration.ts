import type { Effect } from './types';

export function calculateEffectsDuration(effects: Effect[]): Readonly<number> {
  // 500ms is added for the last fade-out animation
  return effects.reduce((total, effect) => total + effect.duration, 500);
}