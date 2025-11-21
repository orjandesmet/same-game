import { describe, expect, it } from 'vitest';
import { calculateCreatureScores } from './calculateCreatureScores';
import type { PartyMembers } from './types';

describe('calculateCreatureScores', () => {
  it('should calculate scores for basic creature catches', () => {
    const party: Partial<PartyMembers> = {
      R: 1,
      B: 1,
    };

    const scores = calculateCreatureScores(['R', 'R', 'B'], party);

    expect(scores).toHaveLength(2); // Two types of creature
    expect(scores).toContainEqual({
      color: 'R',
      level: 1,
      baseScore: 100,
      score: 200, // 2 red creature * 100 base score
    });
    expect(scores).toContainEqual({
      color: 'B',
      level: 1,
      baseScore: 100,
      score: 100, // 1 blue creature * 100 base score
    });
  });

  it('should apply level multipliers from party members', () => {
    const party: Partial<PartyMembers> = {
      R: 2, // Level 2
      B: 3, // Level 3
    };

    const scores = calculateCreatureScores(['R', 'B'], party);

    expect(scores).toContainEqual({
      color: 'R',
      level: 2,
      baseScore: 100,
      score: 100, // 1 red creature * 100 base score
    });
    expect(scores).toContainEqual({
      color: 'B',
      level: 3,
      baseScore: 100,
      score: 100, // 1 blue creature * 100 base score
    });
  });

  it('should handle special creature (MEW) with higher base score', () => {
    const party: Partial<PartyMembers> = {
      M: 1,
    };

    const scores = calculateCreatureScores(['M'], party);

    expect(scores).toHaveLength(1);
    expect(scores[0]).toEqual({
      color: 'M',
      level: 1,
      baseScore: 500,
      score: 500, // Mew has 500 base score
    });
  });

  it('should return empty array when no creature caught', () => {
    const scores = calculateCreatureScores([], {});
    expect(scores).toEqual([]);
  });

  it('should use default level 1 for creature not in party', () => {
    const party: Partial<PartyMembers> = {
      R: 2, // Only R has a custom level
    };

    const scores = calculateCreatureScores(['R', 'B'], party);

    expect(scores).toContainEqual({
      color: 'R',
      level: 2, // Custom level from party
      baseScore: 100,
      score: 100,
    });
    expect(scores).toContainEqual({
      color: 'B',
      level: 1, // Default level
      baseScore: 100,
      score: 100,
    });
  });
});
