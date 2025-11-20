import { describe, expect, it } from 'vitest';
import { isVisibleEffectStage } from './isVisibleEffectStage';
import type { Effect } from './types';

describe('isVisibleEffectsStage', () => {
  it.each<Effect['effectName']>([
    'EMBER',
    'METRONOME',
    'THUNDER SHOCK',
    'TRANSFORM',
    'VINE WHIP',
    'WATER GUN',
    undefined,
  ])(
    'should determine that the effect %s has a visible animation',
    (effectName) => {
      const effect: Effect = {
        effectName,
        color: 'B',
        duration: 100,
        fn: (b) => b,
        level: 30,
      };

      expect(isVisibleEffectStage(effect)).toBe(true);
    }
  );

  it('should determine that the effect FAINT has no visible animation', () => {
    const effect: Effect = {
      effectName: 'FAINT',
      color: 'B',
      duration: 100,
      fn: (b) => b,
      level: 30,
    };

    expect(isVisibleEffectStage(effect)).toBe(false);
  });
});
