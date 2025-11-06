import { describe, expect, it } from 'vitest';
import { pkmnUtils } from '.';
import type { PartyMembers } from './types';

describe('calculatePkmnScores', () => {
  it('should calculate scores for basic pokemon catches', () => {
    const party: Partial<PartyMembers> = {
      R: 1,
      B: 1,
    };

    const scores = pkmnUtils.calculatePkmnScores(['R', 'R', 'B'], party);

    expect(scores).toHaveLength(2); // Two types of pokemon
    expect(scores).toContainEqual({
      color: 'R',
      level: 1,
      baseScore: 100,
      score: 200, // 2 red pokemon * 100 base score
    });
    expect(scores).toContainEqual({
      color: 'B',
      level: 1,
      baseScore: 100,
      score: 100, // 1 blue pokemon * 100 base score
    });
  });

  it('should apply level multipliers from party members', () => {
    const party: Partial<PartyMembers> = {
      R: 2, // Level 2
      B: 3, // Level 3
    };

    const scores = pkmnUtils.calculatePkmnScores(['R', 'B'], party);

    expect(scores).toContainEqual({
      color: 'R',
      level: 2,
      baseScore: 100,
      score: 100, // 1 red pokemon * 100 base score
    });
    expect(scores).toContainEqual({
      color: 'B',
      level: 3,
      baseScore: 100,
      score: 100, // 1 blue pokemon * 100 base score
    });
  });

  it('should handle special pokemon (MEW) with higher base score', () => {
    const party: Partial<PartyMembers> = {
      M: 1,
    };

    const scores = pkmnUtils.calculatePkmnScores(['M'], party);

    expect(scores).toHaveLength(1);
    expect(scores[0]).toEqual({
      color: 'M',
      level: 1,
      baseScore: 500,
      score: 500, // Mew has 500 base score
    });
  });

  it('should return empty array when no pokemon caught', () => {
    const scores = pkmnUtils.calculatePkmnScores([], {});
    expect(scores).toEqual([]);
  });

  it('should use default level 1 for pokemon not in party', () => {
    const party: Partial<PartyMembers> = {
      R: 2, // Only R has a custom level
    };

    const scores = pkmnUtils.calculatePkmnScores(['R', 'B'], party);

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
