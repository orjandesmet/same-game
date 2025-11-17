import type { Group } from '@game/board';
import type { PartyMembers } from '@game/creatures';
import type { PRNG } from '@game/rng';
import { describe, expect, it, vi } from 'vitest';
import { createTestBoard } from '../../board/createTestBoard.test-util';
import { EFFECT_DURATION_MS, TRANSFORM_DURATION_MS } from '../constants';
import type { EffectTools } from '../types';
import { createTransformEffects } from './createTransformEffects';
import { getTransformingGroup } from './getTransformingGroup';

const mockRNG: PRNG = {
  nextFloat: () => 0.123,
  nextRange: () => 1,
  reseed: () => {},
  seed: 123456,
};

const mockGroupFn = vi.fn();
vi.mock(import('./getTransformingGroup'), () => ({
  getTransformingGroup: vi.fn(() => mockGroupFn),
}));

describe('createTransformEffects', () => {
  const party: Partial<PartyMembers> = {
    B: 10,
    R: 5,
    G: 20,
    P: 35,
  };
  const allGroups: Group[] = [['1:3', '5:4', '6:3', '9:5']];
  const testBoard = createTestBoard(['RGB', 'BGR']);
  it('should create transform effects to R for the group of the current cell when no special creature is in the cell', () => {
    const effects = createTransformEffects(allGroups, party, mockRNG, false);

    expect(getTransformingGroup).toHaveBeenCalledWith(allGroups, false);

    expect(effects.stages).toHaveLength(2);
    // Stage 1 should update cells to state TRANSFORMING
    expect(effects.stages.at(0)).toMatchObject({
      color: 'P',
      level: 35,
      effectName: 'TRANSFORM',
      hasSpecialCreature: false,
      duration: TRANSFORM_DURATION_MS,
    });
    const tools: EffectTools = {
      cellUpdate: vi.fn(),
      cellRemove: vi.fn(),
      _debug: vi.fn(),
    };
    effects.stages.at(0)!.fn(testBoard, allGroups[0], tools);
    expect(tools.cellUpdate).toHaveBeenCalledWith(testBoard, allGroups[0], {
      cellState: 'TRANSFORMING',
    });

    // Stage 2 should update cells to state NORMAL
    expect(effects.stages.at(1)).toMatchObject({
      color: 'R',
      level: 5,
      hasSpecialCreature: false,
      duration: EFFECT_DURATION_MS,
    });
    effects.stages.at(1)!.fn(testBoard, allGroups[0], tools);
    expect(tools.cellUpdate).toHaveBeenCalledWith(testBoard, allGroups[0], {
      color: 'R',
      level: 5,
      cellState: 'NORMAL',
    });
  });

  it('should create transform effects for multiple group of the current cell when a special creature is in the cell', () => {
    const effects = createTransformEffects(allGroups, party, mockRNG, true);

    expect(getTransformingGroup).toHaveBeenCalledWith(allGroups, true);

    expect(effects.stages).toHaveLength(2);
    expect(effects.stages.at(0)!.hasSpecialCreature).toBe(true);
    expect(effects.stages.at(1)!.hasSpecialCreature).toBe(false);
  });
});
