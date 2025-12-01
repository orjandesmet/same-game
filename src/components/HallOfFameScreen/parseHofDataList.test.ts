import { CREATURE_NAMES } from '@game/creatures';
import type { HallOfFameDataList } from '@game/recorder';
import { describe, expect, it } from 'vitest';
import { parseHofDataList } from './parseHofDataList';
import type { ParsedCreatureListItem, ParsedListItem } from './types';

describe('parseHofDataList', () => {
  it('should parse the HoF data into UI usable data', () => {
    const hofDataList: HallOfFameDataList = [
      {
        date: 12345,
        scoreCard: {
          multiplier: 2,
          allCleared: false,
          cellsRemoved: 10,
          creatures: ['R', 'G', 'B', 'B'],
        },
        startGameParameters: {
          nrOfColumns: 12,
          nrOfRows: 8,
          partyMembers: { B: 10, G: 4, M: 3, P: 5, R: 6, W: 12, Y: 25 },
          seed: 1234,
        },
      },
      {
        date: 56789,
        scoreCard: {
          multiplier: 3,
          allCleared: true,
          cellsRemoved: 769,
          creatures: ['R', 'B', 'Y'],
        },
        startGameParameters: {
          nrOfColumns: 15,
          nrOfRows: 15,
          partyMembers: { B: 10, G: 4, M: 3, P: 5, R: 6, W: 12, Y: 25 },
          seed: 784,
        },
      },
    ];

    const expectedResult: ParsedListItem[] = [
      {
        allCleared: false,
        creatures: [
          {
            color: 'R',
            timesUsed: 1,
            name: CREATURE_NAMES['R'][0],
            sprite: `R-0`,
          },
          {
            color: 'G',
            timesUsed: 1,
            name: CREATURE_NAMES['G'][0],
            sprite: `G-0`,
          },
          {
            color: 'B',
            timesUsed: 2,
            name: CREATURE_NAMES['B'][0],
            sprite: `B-0`,
          },
          {
            color: 'P',
            timesUsed: 0,
            name: CREATURE_NAMES['P'][0],
            sprite: `P-0`,
          },
          {
            color: 'W',
            timesUsed: 0,
            name: CREATURE_NAMES['W'][0],
            sprite: `W-0`,
          },
          {
            color: 'Y',
            timesUsed: 0,
            name: CREATURE_NAMES['Y'][0],
            sprite: `Y-0`,
          },
        ],
        date: 12345,
        dimensions: `8x12`,
        score: 420,
        seed: 1234,
      },
      {
        allCleared: true,
        creatures: [
          {
            color: 'R',
            timesUsed: 1,
            name: CREATURE_NAMES['R'][0],
            sprite: `R-0`,
          },
          {
            color: 'B',
            timesUsed: 1,
            name: CREATURE_NAMES['B'][0],
            sprite: `B-0`,
          },
          {
            color: 'Y',
            timesUsed: 1,
            name: CREATURE_NAMES['Y'][0],
            sprite: `Y-0`,
          },
          {
            color: 'G',
            timesUsed: 0,
            name: CREATURE_NAMES['G'][0],
            sprite: `G-0`,
          },
          {
            color: 'P',
            timesUsed: 0,
            name: CREATURE_NAMES['P'][0],
            sprite: `P-0`,
          },
          {
            color: 'W',
            timesUsed: 0,
            name: CREATURE_NAMES['W'][0],
            sprite: `W-0`,
          },
        ],
        date: 56789,
        dimensions: `15x15`,
        score: 3627,
        seed: 784,
      },
    ];

    const result = parseHofDataList(hofDataList);

    expect(result).toStrictEqual(expectedResult);
  });

  it('should display the SPECIAL creature if it is used', () => {
    const hofDataList: HallOfFameDataList = [
      {
        date: 12345,
        scoreCard: {
          multiplier: 2,
          allCleared: false,
          cellsRemoved: 10,
          creatures: ['R', 'G', 'M', 'B'],
        },
        startGameParameters: {
          nrOfColumns: 12,
          nrOfRows: 8,
          partyMembers: { B: 10, G: 4, M: 3, P: 5, R: 6, W: 12, Y: 25 },
          seed: 1234,
        },
      },
    ];

    const expectedCreatureList: ParsedCreatureListItem[] = [
      { color: 'R', timesUsed: 1, name: CREATURE_NAMES['R'][0], sprite: `R-0` },
      { color: 'G', timesUsed: 1, name: CREATURE_NAMES['G'][0], sprite: `G-0` },
      { color: 'M', timesUsed: 1, name: CREATURE_NAMES['M'][0], sprite: `M-0` },
      { color: 'B', timesUsed: 1, name: CREATURE_NAMES['B'][0], sprite: `B-0` },
      { color: 'P', timesUsed: 0, name: CREATURE_NAMES['P'][0], sprite: `P-0` },
      { color: 'W', timesUsed: 0, name: CREATURE_NAMES['W'][0], sprite: `W-0` },
      { color: 'Y', timesUsed: 0, name: CREATURE_NAMES['Y'][0], sprite: `Y-0` },
    ];

    const result = parseHofDataList(hofDataList);

    expect(result.at(0)?.creatures).toStrictEqual(expectedCreatureList);
  });

  it('should match the levels', () => {
    const hofDataList: HallOfFameDataList = [
      {
        date: 12345,
        scoreCard: {
          multiplier: 2,
          allCleared: false,
          cellsRemoved: 10,
          creatures: ['R', 'G', 'M', 'B'],
        },
        startGameParameters: {
          nrOfColumns: 12,
          nrOfRows: 8,
          partyMembers: { B: 16, G: 42, M: 3, P: 5, R: 6, W: 12, Y: 25 },
          seed: 1234,
        },
      },
    ];

    const expectedCreatureList: ParsedCreatureListItem[] = [
      { color: 'R', timesUsed: 1, name: CREATURE_NAMES['R'][0], sprite: `R-0` },
      { color: 'G', timesUsed: 1, name: CREATURE_NAMES['G'][2], sprite: `G-2` },
      { color: 'M', timesUsed: 1, name: CREATURE_NAMES['M'][0], sprite: `M-0` },
      { color: 'B', timesUsed: 1, name: CREATURE_NAMES['B'][1], sprite: `B-1` },
      { color: 'P', timesUsed: 0, name: CREATURE_NAMES['P'][0], sprite: `P-0` },
      { color: 'W', timesUsed: 0, name: CREATURE_NAMES['W'][0], sprite: `W-0` },
      { color: 'Y', timesUsed: 0, name: CREATURE_NAMES['Y'][0], sprite: `Y-0` },
    ];

    const result = parseHofDataList(hofDataList);

    expect(result.at(0)?.creatures).toStrictEqual(expectedCreatureList);
  });

  it('should ignore creatures not in the party', () => {
    const hofDataList: HallOfFameDataList = [
      {
        date: 12345,
        scoreCard: {
          multiplier: 2,
          allCleared: false,
          cellsRemoved: 10,
          creatures: ['R', 'B', 'M'],
        },
        startGameParameters: {
          nrOfColumns: 12,
          nrOfRows: 8,
          partyMembers: { B: 16, G: -42, M: -3, P: 5, R: 6, W: -12, Y: -25 },
          seed: 1234,
        },
      },
    ];

    const expectedCreatureList: ParsedCreatureListItem[] = [
      { color: 'R', timesUsed: 1, name: CREATURE_NAMES['R'][0], sprite: `R-0` },
      { color: 'B', timesUsed: 1, name: CREATURE_NAMES['B'][1], sprite: `B-1` },
      { color: 'M', timesUsed: 1, name: CREATURE_NAMES['M'][0], sprite: `M-0` },
      { color: 'P', timesUsed: 0, name: CREATURE_NAMES['P'][0], sprite: `P-0` },
    ];

    const result = parseHofDataList(hofDataList);

    expect(result.at(0)?.creatures).toStrictEqual(expectedCreatureList);
  });

  it("should not display the SPECIAL creature when it's not used, even when it's in the party", () => {
    const hofDataList: HallOfFameDataList = [
      {
        date: 12345,
        scoreCard: {
          multiplier: 2,
          allCleared: false,
          cellsRemoved: 10,
          creatures: ['R', 'B'],
        },
        startGameParameters: {
          nrOfColumns: 12,
          nrOfRows: 8,
          partyMembers: { B: 16, G: -42, M: 3, P: 5, R: 6, W: -12, Y: -25 },
          seed: 1234,
        },
      },
    ];

    const expectedCreatureList: ParsedCreatureListItem[] = [
      { color: 'R', timesUsed: 1, name: CREATURE_NAMES['R'][0], sprite: `R-0` },
      { color: 'B', timesUsed: 1, name: CREATURE_NAMES['B'][1], sprite: `B-1` },
      { color: 'P', timesUsed: 0, name: CREATURE_NAMES['P'][0], sprite: `P-0` },
    ];

    const result = parseHofDataList(hofDataList);

    expect(result.at(0)?.creatures).toStrictEqual(expectedCreatureList);
  });
});
