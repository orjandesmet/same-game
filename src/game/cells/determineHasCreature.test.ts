import { describe, expect, it } from 'vitest';
import { determineHasCreature } from './determineHasCreature';

describe('determineHasCreature', () => {
  it('should return true if the the rngValue is less than the probability score for a given color', () => {
    const color = 'R';
    const rngValue = 5;
    const probability = { R: 600 };

    expect(determineHasCreature(color, rngValue, probability)).toBe(true);
  });

  it('should return false if the the rngValue is more than the probability score for a given color', () => {
    const color = 'R';
    const rngValue = 7;
    const probability = { R: 300 };

    expect(determineHasCreature(color, rngValue, probability)).toBe(false);
  });

  it('should return false if the there is no probability score for a given color (probability = 0)', () => {
    const color = 'R';
    const rngValue = 5;
    const probability = { B: 600 };

    expect(determineHasCreature(color, rngValue, probability)).toBe(false);
  });
});
