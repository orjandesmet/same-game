import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestBoard } from '../board/createTestBoard.test-util';
import {
  EFFECT_CELL_STATES,
  EFFECT_DURATION_MS,
  EFFECT_NAMES,
} from './constants';
import { createBasicEffects } from './createBasicEffects';
import type { EffectTools } from './types';

describe('createBasicEffects', () => {
  const groupFn = vi.fn();
  const testBoard = createTestBoard(['RGB', 'BGR']);
  const mockUpdatedBoard = createTestBoard(['BBR', 'GRY']);

  const effectTools: EffectTools = {
    _debug: vi.fn(),
    cellRemove: vi.fn(),
    cellUpdate: vi.fn(() => mockUpdatedBoard),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a change stage and a faint stage for the given color', () => {
    const effects = createBasicEffects(groupFn, 'B', 10, false, {
      effectName: 'EMBER',
      cellState: 'SHOCKED',
    });

    expect(effects.stages).toHaveLength(2);

    // Stage 1 is runs the animation
    expect(effects.stages.at(0)).toMatchObject({
      color: 'B',
      level: 10,
      effectName: 'EMBER',
      hasSpecialCreature: false,
      duration: EFFECT_DURATION_MS,
    });
    const expectedStage1Board = effects.stages
      .at(0)!
      .fn(testBoard, ['1:2'], effectTools);
    expect(effectTools.cellUpdate).toHaveBeenCalledWith(testBoard, ['1:2'], {
      cellState: 'SHOCKED',
      hasCreature: false,
    });
    expect(expectedStage1Board).toStrictEqual(mockUpdatedBoard);

    // Stage 2 removes the affected cells
    expect(effects.stages.at(1)).toMatchObject({
      color: 'B',
      level: 10,
      effectName: 'FAINT',
      hasSpecialCreature: false,
      duration: 0,
    });
  });

  it('should pass on the special creature', () => {
    const effects = createBasicEffects(groupFn, 'B', 10, true, {
      effectName: 'EMBER',
      cellState: 'SHOCKED',
    });

    expect(effects.stages).toHaveLength(2);
    expect(effects.stages.at(0)!.hasSpecialCreature).toBe(true);
    expect(effects.stages.at(1)!.hasSpecialCreature).toBe(true);
  });

  it('should default to the BASE cell states and effect name', () => {
    const effects = createBasicEffects(groupFn, 'B', 10, false);

    expect(effects.stages).toHaveLength(2);

    // Stage 1 is runs the animation
    expect(effects.stages.at(0)).toMatchObject({
      color: 'B',
      level: 10,
      effectName: EFFECT_NAMES['B'],
      hasSpecialCreature: false,
      duration: EFFECT_DURATION_MS,
    });

    effects.stages.at(0)!.fn(testBoard, ['1:2'], effectTools);
    expect(effectTools.cellUpdate).toHaveBeenCalledWith(testBoard, ['1:2'], {
      cellState: EFFECT_CELL_STATES['B'],
      hasCreature: false,
    });
  });
});
