import { describe, expect, it, vi } from 'vitest';
import { getEvolutionIdx } from './getEvolutionIdx';

vi.mock('./values', () => ({
  EVOLUTION_LEVELS: {
    R: [0, 12, 36],
  },
}));

describe('getEvolutionIdx', () => {
  it.each([
    [0, 0],
    [0, 5],
    [0, 11],
    [1, 12],
    [1, 16],
    [1, 35],
    [2, 36],
    [2, 53],
    [2, 10000],
  ])(
    'should return the index (%s) of the largest value less or equal to the input %s',
    (expectedIdx, inputLevel) => {
      expect(getEvolutionIdx('R', inputLevel)).toBe(expectedIdx);
    }
  );

  it('should return 0 if the color does not exist', () => {
    expect(getEvolutionIdx('G', 12)).toBe(0);
  });
});
