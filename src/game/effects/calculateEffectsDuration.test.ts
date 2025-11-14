import { describe, expect, it } from 'vitest';
import type { Effect } from './types';
import { calculateEffectsDuration } from './calculateEffectsDuration';

describe('calculateEffectsDuration', () => {
  it('should get a total of the effects durations + 500ms', () => {
    const effects: Effect[] = [
      {color: 'R', duration: 5000, fn: (b) => b, level: 3},
      {color: 'G', duration: 4000, fn: (b) => b, level: 3},
      {color: 'B', duration: 6000, fn: (b) => b, level: 3},
      {color: 'Y', duration: 2300, fn: (b) => b, level: 3},
    ];

    expect(calculateEffectsDuration(effects)).toBe(17800);
  })
})