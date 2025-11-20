import { boardUtils, type Group } from '@game/board';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestBoard } from '../board/createTestBoard.test-util';
import { runEffects } from './runEffects';
import type { Effect } from './types';

describe('runEffects', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should run the given effect stages and update the board at each point', async () => {
    const effects: Effect[] = [
      {
        color: 'W',
        duration: 100,
        fn: vi.fn((b, g, t) => t.cellUpdate(b, g, { color: 'B' })),
        level: 30,
        effectName: 'METRONOME',
      },
      {
        color: 'W',
        duration: 300,
        fn: vi.fn((b, g, t) => t.cellUpdate(b, g, { hasCreature: true })),
        level: 30,
        effectName: 'TRANSFORM',
      },
      {
        color: 'R',
        duration: 500,
        fn: vi.fn((b, g, t) => t.cellUpdate(b, g, { cellState: 'BURNING' })),
        level: 30,
        effectName: 'EMBER',
      },
    ];

    const initialBoard = createTestBoard(['RRY', 'RGY', 'GRB']);
    const group: Group = ['1:2', '0:2'];

    const expectedStage1Board = boardUtils.updateCellsInBoard(
      initialBoard,
      group,
      { color: 'B' }
    );
    const expectedStage2Board = boardUtils.updateCellsInBoard(
      expectedStage1Board,
      group,
      { hasCreature: true }
    );
    const expectedStage3Board = boardUtils.updateCellsInBoard(
      expectedStage2Board,
      group,
      { cellState: 'BURNING' }
    );

    const callbackFn = vi.fn();
    const tools = {
      _debug: vi.fn(),
      cellRemove: vi.fn(boardUtils.removeGroup),
      cellUpdate: vi.fn(boardUtils.updateCellsInBoard),
    };

    const runPromise = runEffects(
      effects,
      initialBoard,
      group,
      callbackFn,
      tools
    );

    await vi.advanceTimersToNextTimerAsync();
    // first effect is applied synchronously when runEffects starts
    expect(callbackFn).toHaveBeenCalledWith(expectedStage1Board);
    expect(effects.at(0)!.fn).toHaveBeenCalledWith(initialBoard, group, tools);
    expect(tools.cellUpdate).toHaveBeenCalledWith(initialBoard, group, {
      color: 'B',
    });

    // advance to the next scheduled timer (end of first effect)
    await vi.advanceTimersToNextTimerAsync();
    // allow microtasks to flush
    expect(callbackFn).toHaveBeenCalledWith(expectedStage2Board);
    expect(effects.at(1)!.fn).toHaveBeenCalledWith(
      expectedStage1Board,
      group,
      tools
    );
    expect(tools.cellUpdate).toHaveBeenCalledWith(expectedStage1Board, group, {
      hasCreature: true,
    });

    // advance to the next scheduled timer (end of second effect)
    await vi.advanceTimersToNextTimerAsync();
    expect(callbackFn).toHaveBeenCalledWith(expectedStage3Board);
    expect(effects.at(2)!.fn).toHaveBeenCalledWith(
      expectedStage2Board,
      group,
      tools
    );
    expect(tools.cellUpdate).toHaveBeenCalledWith(expectedStage2Board, group, {
      cellState: 'BURNING',
    });

    // finish the runEffects promise
    const resultingBoard = await runPromise;
    expect(resultingBoard).toStrictEqual(expectedStage3Board);
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});
