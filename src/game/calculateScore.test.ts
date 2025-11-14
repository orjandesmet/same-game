import { describe, expect, it } from 'vitest';
import { calculateScore } from './calculateScore';
import { ALL_CLEARED_BONUS } from './types';
import type { PartyMembers } from './creatures';

describe('calculateScore', () => {
  it('should calculate basic score with cells removed and multiplier', () => {
    const score = calculateScore(
      {
        cellsRemoved: 10,
        multiplier: 2,
        allCleared: false,
        creatures: [],
      },
      {}
    );
    expect(score).toBe(20); // 10 cells * 2 multiplier
  });

  it('should add bonus for clearing all cells', () => {
    const score = calculateScore(
      {
        cellsRemoved: 10,
        multiplier: 1,
        allCleared: true,
        creatures: [],
      },
      {}
    );
    expect(score).toBe(10 + ALL_CLEARED_BONUS);
  });

  it('should calculate creature scores based on party members', () => {
    const party: Partial<PartyMembers> = {
      R: 2, // Level 2 red creature
      B: 1, // Level 1 blue creature
    };

    const score = calculateScore(
      {
        cellsRemoved: 5,
        multiplier: 1,
        allCleared: false,
        creatures: ['R', 'R', 'B'], // 2 red creature and 1 blue creature
      },
      party
    );

    // Base score: 5 cells
    // Creature scores: (2 * 100 for R) + (1 * 100 for B) = 300
    expect(score).toBe(5 + 300);
  });

  it('should handle partial score card data', () => {
    const score = calculateScore({}, {});
    expect(score).toBe(0);
  });
});
