import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { boardUtils, type Board, type Group } from './board';
import { buildBasePartyMembers } from './buildBasePartyMembers';
import { cellUtils } from './cells';
import { type PartyMembers } from './creatures';
import { SameGame } from './engine';
import type { Seed } from './rng';
import { Xorshift32 } from './rng/xorshift32';

const MockPlayRecorder = vi.fn(
  class {
    reset = vi.fn();
    addMove = vi.fn();
    store = vi.fn();
  }
);

describe('engine', () => {
  const INITIAL_SEED = 74673;
  let sameGame: SameGame;

  beforeEach(() => {
    const rng = new Xorshift32(INITIAL_SEED);
    sameGame = new SameGame(rng);
    sameGame['_recorder'] = new MockPlayRecorder();
  });

  it('should have state "NOT-STARTED" if the game has not started yet', () => {
    expect(sameGame['_gameState']).toEqual('NOT-STARTED');
    expect(sameGame.board).toHaveLength(0);
    expect(sameGame.movesLeft).toBe(0);
    expect(sameGame.score).toBe(0);
    expect(sameGame.seed).toEqual(INITIAL_SEED);
  });

  describe('== BASIC GAME OF 8x12 with BASE_PARTY (seed:12345) ==', () => {
    // VERIFY WITH http://localhost:5173/?debug=true&seed=12345&columns=12&rows=8
    const TEST_SEED: Seed = 12345;
    const TEST_NR_OF_ROWS = 8;
    const TEST_NR_OF_COLUMNS = 12;
    const BASE_PARTY: PartyMembers = buildBasePartyMembers();
    const stateListener = vi.fn();
    let initialBoard: Board;

    beforeEach(() => {
      vi.useFakeTimers();
      stateListener.mockClear();
      sameGame.addStateChangeListener(stateListener);
      sameGame.startGame(
        TEST_NR_OF_ROWS,
        TEST_NR_OF_COLUMNS,
        BASE_PARTY,
        TEST_SEED
      );
      initialBoard = sameGame.board;
    });

    afterEach(() => {
      sameGame.removeStateChangeListener(stateListener);
      vi.useRealTimers();
    });

    it('should start a game with the existing seed', () => {
      expect(sameGame['_gameState']).toEqual('IN-PROGRESS');
      expect(sameGame['_specialCreatureAppeared']).toBe(false);
      expect(sameGame['_party']).toStrictEqual({
        R: BASE_PARTY.R,
        Y: BASE_PARTY.Y,
        W: BASE_PARTY.W,
        B: BASE_PARTY.B,
        M: BASE_PARTY.M,
      });
      expect(sameGame.score).toBe(0);
      expect(sameGame.seed).toBe(TEST_SEED);
    });

    it('should have the given number of rows and columns', () => {
      expect(sameGame.board).toHaveLength(TEST_NR_OF_COLUMNS);
      expect(sameGame.board[0]).toHaveLength(TEST_NR_OF_ROWS);
      expect(boardUtils.getNonEmptyCells(sameGame.board)).toHaveLength(
        TEST_NR_OF_COLUMNS * TEST_NR_OF_ROWS
      );
    });

    it('should have 25 moves left', () => {
      expect(sameGame.movesLeft).toBe(25);
    });

    it('should have 6 cells with creatures', () => {
      expect(boardUtils.countCellsWithCreature(sameGame.board)).toBe(6);
    });

    it('should have 61 groups, of which 19 with at least 2 cells', () => {
      const allGroups = boardUtils.getAllGroups(sameGame.board);

      expect(allGroups).toHaveLength(60);
      expect(allGroups.filter((group) => group.length >= 2)).toHaveLength(19);
    });

    it('should have called the listener with the initial state', () => {
      expect(stateListener).toHaveBeenCalledOnce();
      expect(stateListener).toHaveBeenCalledWith({
        board: initialBoard,
        movesLeft: 25,
        scoreCard: {
          allCleared: false,
          cellsRemoved: 0,
          multiplier: 2,
          creatures: [],
        },
        gameState: 'IN-PROGRESS',
      });
    });

    it('should do nothing when clicking a cell that is part of a group with less than 2 cells', () => {
      const rowIdx = 1;
      const columnIdx = 3;
      stateListener.mockClear();

      const effectsThatRan = sameGame.handleCellClick(rowIdx, columnIdx);

      expect(effectsThatRan).toHaveLength(0);
      expect(sameGame.board).toStrictEqual(initialBoard);
      expect(stateListener).not.toHaveBeenCalled();
      expect(sameGame.score).toBe(0);
    });

    it('should remove cells in a group when the selected cell is part of a group of at least two cells', () => {
      const rowIdx = 2;
      const columnIdx = 5;
      const expectedGroup: Group = ['1:5', '2:5', '2:6', '3:6'];
      const expectedUpdatedBoard = boardUtils.removeGroup(
        initialBoard,
        expectedGroup
      );
      const expectedScore = 8; // (4 - 2)^2 * 2
      stateListener.mockClear();

      const effectsThatRan = sameGame.handleCellClick(rowIdx, columnIdx);

      expect(effectsThatRan).toHaveLength(0);
      expect(sameGame.board).toStrictEqual(expectedUpdatedBoard);
      expect(boardUtils.getNonEmptyCells(sameGame.board)).toHaveLength(92); // 12 * 8 - 4
      expect(stateListener).toHaveBeenCalledOnce();
      expect(stateListener).toHaveBeenCalledWith({
        board: expectedUpdatedBoard,
        movesLeft: 24,
        scoreCard: {
          allCleared: false,
          cellsRemoved: 4,
          multiplier: 2,
          creatures: [],
        },
        gameState: 'IN-PROGRESS',
      });
      expect(sameGame.score).toBe(expectedScore);
    });

    it('should remove cells in a group when the selected cell is part of a group of at least two cells a second time', () => {
      const rowIdx = 2;
      const columnIdx = 5;
      const expectedGroup1: Group = ['1:5', '2:5', '2:6', '3:6'];
      const expectedGroup2: Group = ['2:5', '2:6', '2:7'];
      const expectedUpdatedBoardAfterMove1 = boardUtils.removeGroup(
        initialBoard,
        expectedGroup1
      );
      const expectedUpdatedBoardAfterMove2 = boardUtils.removeGroup(
        expectedUpdatedBoardAfterMove1,
        expectedGroup2
      );
      const expectedScore = 10; // [(4 - 2)^2 + (3 - 2)^2] * 2
      stateListener.mockClear();

      sameGame.handleCellClick(rowIdx, columnIdx);
      const effectsThatRanSecondTime = sameGame.handleCellClick(
        rowIdx,
        columnIdx
      );

      expect(effectsThatRanSecondTime).toHaveLength(0);
      expect(sameGame.board).toStrictEqual(expectedUpdatedBoardAfterMove2);
      expect(boardUtils.getNonEmptyCells(sameGame.board)).toHaveLength(89); // 12 * 8 - 4 - 3
      expect(stateListener).toHaveBeenCalledTimes(2);
      expect(stateListener).toHaveBeenNthCalledWith(1, {
        board: expectedUpdatedBoardAfterMove1,
        movesLeft: 24,
        scoreCard: {
          allCleared: false,
          cellsRemoved: 4,
          multiplier: 2,
          creatures: [],
        },
        gameState: 'IN-PROGRESS',
      });
      expect(stateListener).toHaveBeenNthCalledWith(2, {
        board: expectedUpdatedBoardAfterMove2,
        movesLeft: 22,
        scoreCard: {
          allCleared: false,
          cellsRemoved: 5,
          multiplier: 2,
          creatures: [],
        },
        gameState: 'IN-PROGRESS',
      });
      expect(sameGame.score).toBe(expectedScore);
    });

    it('should run an effect when the cell has a creature on it', async () => {
      const rowIdx = 1;
      const columnIdx = 7;
      const expectedGroup: Group = [
        '0:7',
        '1:7',
        '2:7',
        '3:7',
        '4:7',
        '5:7',
        '6:7',
        '7:7',
      ];
      const expectedUpdatedBoard = boardUtils.updateCellsInBoard(
        initialBoard,
        expectedGroup,
        { cellState: 'FLOODED', hasCreature: false }
      );
      const expectedClearedBoard = boardUtils.removeGroup(
        expectedUpdatedBoard,
        expectedGroup
      );
      stateListener.mockClear();

      expect(initialBoard[columnIdx][rowIdx].color).toBe('B');
      expect(initialBoard[columnIdx][rowIdx].hasCreature).toBe(true);
      // Cell has a B creature
      const effectsThatRan = sameGame.handleCellClick(rowIdx, columnIdx);
      await vi.runAllTimersAsync();

      expect(sameGame.board).toStrictEqual(expectedClearedBoard);
      expect(boardUtils.getNonEmptyCells(sameGame.board)).toHaveLength(88); // 12 * 8 - 8
      expect(stateListener).toHaveBeenCalledTimes(4);
      expect(stateListener).toHaveBeenNthCalledWith(1, {
        board: initialBoard,
        movesLeft: 25,
        scoreCard: {
          allCleared: false,
          cellsRemoved: 0,
          multiplier: 2,
          creatures: [],
        },
        gameState: 'PAUSED',
      });
      expect(stateListener).toHaveBeenNthCalledWith(2, {
        board: expectedUpdatedBoard,
        movesLeft: 25,
        scoreCard: {
          allCleared: false,
          cellsRemoved: 0,
          multiplier: 2,
          creatures: [],
        },
        gameState: 'PAUSED',
      });
      expect(stateListener).toHaveBeenNthCalledWith(3, {
        board: expectedClearedBoard,
        movesLeft: 25,
        scoreCard: {
          allCleared: false,
          cellsRemoved: 36,
          multiplier: 2,
          creatures: [],
        },
        gameState: 'PAUSED',
      });
      expect(stateListener).toHaveBeenNthCalledWith(4, {
        board: expectedClearedBoard,
        movesLeft: 21,
        scoreCard: {
          allCleared: false,
          cellsRemoved: 36,
          multiplier: 2,
          creatures: ['B'],
        },
        gameState: 'IN-PROGRESS',
      });
      const expectedScore = 172; // 36 * 2 + 100
      expect(sameGame.score).toBe(expectedScore);

      expect(effectsThatRan).toHaveLength(2);
      expect(effectsThatRan.at(0)!.effectName).toBe('WATER GUN');
      expect(effectsThatRan.at(1)!.effectName).toBe('FAINT');
    });

    it('should trigger the GAME OVER state with non-empty cells left', async () => {
      const moves = [
        { rowIdx: 5, columnIdx: 7 },
        { rowIdx: 7, columnIdx: 9 },
        { rowIdx: 7, columnIdx: 2 },
        { rowIdx: 7, columnIdx: 2 },
        { rowIdx: 7, columnIdx: 2 },
        { rowIdx: 7, columnIdx: 2 },
        { rowIdx: 7, columnIdx: 2 },
        { rowIdx: 7, columnIdx: 4 },
        { rowIdx: 7, columnIdx: 4 },
        { rowIdx: 7, columnIdx: 5 },
        { rowIdx: 7, columnIdx: 5 },
        { rowIdx: 7, columnIdx: 5 },
        { rowIdx: 7, columnIdx: 5 },
        { rowIdx: 7, columnIdx: 5 },
        { rowIdx: 3, columnIdx: 0 },
        { rowIdx: 6, columnIdx: 7 },
        { rowIdx: 6, columnIdx: 7 },
        { rowIdx: 7, columnIdx: 7 },
        { rowIdx: 6, columnIdx: 7 },
        { rowIdx: 6, columnIdx: 7 },
        { rowIdx: 7, columnIdx: 7 },
        { rowIdx: 7, columnIdx: 7 },
        { rowIdx: 7, columnIdx: 0 },
      ];
      moves.forEach(({ rowIdx, columnIdx }) => {
        sameGame.handleCellClick(rowIdx, columnIdx);
      });
      await vi.runAllTimersAsync();
      const lastMove = { rowIdx: 7, columnIdx: 4 };
      stateListener.mockClear();
      sameGame.handleCellClick(lastMove.rowIdx, lastMove.columnIdx);
      await vi.runAllTimersAsync();
      const finishedBoard = sameGame.board;
      expect(boardUtils.getNonEmptyCells(finishedBoard)).toHaveLength(13);
      expect(sameGame['_gameState']).toBe('GAME-OVER');
      expect(stateListener).toHaveBeenLastCalledWith({
        board: finishedBoard,
        movesLeft: 0,
        scoreCard: {
          allCleared: false,
          cellsRemoved: 135,
          multiplier: 2,
          creatures: ['B', 'B'],
        },
        gameState: 'GAME-OVER',
      });
    });

    it('should not allow any more moves in GAME OVER state', async () => {
      const moves = [
        { rowIdx: 5, columnIdx: 7 },
        { rowIdx: 7, columnIdx: 9 },
        { rowIdx: 7, columnIdx: 2 },
        { rowIdx: 7, columnIdx: 2 },
        { rowIdx: 7, columnIdx: 2 },
        { rowIdx: 7, columnIdx: 2 },
        { rowIdx: 7, columnIdx: 2 },
        { rowIdx: 7, columnIdx: 4 },
        { rowIdx: 7, columnIdx: 4 },
        { rowIdx: 7, columnIdx: 5 },
        { rowIdx: 7, columnIdx: 5 },
        { rowIdx: 7, columnIdx: 5 },
        { rowIdx: 7, columnIdx: 5 },
        { rowIdx: 7, columnIdx: 5 },
        { rowIdx: 3, columnIdx: 0 },
        { rowIdx: 6, columnIdx: 7 },
        { rowIdx: 6, columnIdx: 7 },
        { rowIdx: 7, columnIdx: 7 },
        { rowIdx: 6, columnIdx: 7 },
        { rowIdx: 6, columnIdx: 7 },
        { rowIdx: 7, columnIdx: 7 },
        { rowIdx: 7, columnIdx: 7 },
        { rowIdx: 7, columnIdx: 0 },
      ];
      moves.forEach(({ rowIdx, columnIdx }) => {
        sameGame.handleCellClick(rowIdx, columnIdx);
      });
      await vi.runAllTimersAsync();
      sameGame.handleCellClick(7, 4);
      await vi.runAllTimersAsync();
      expect(sameGame['_gameState']).toBe('GAME-OVER');

      stateListener.mockClear();

      const finishedBoard = sameGame.board;
      const lastMove = { rowIdx: 7, columnIdx: 0 };
      expect(
        cellUtils.isEmptyCell(
          finishedBoard[lastMove.columnIdx][lastMove.rowIdx]
        )
      ).toBe(false);

      sameGame.handleCellClick(lastMove.rowIdx, lastMove.columnIdx);

      expect(stateListener).not.toHaveBeenCalled();
    });
  });

  describe('== BASIC GAME OF 8x12 with BASE_PARTY and RAISED SPECIAL CHANCE (seed:12345) ==', () => {
    // VERIFY WITH http://localhost:5173/?debug=true&seed=12345&columns=12&rows=8&party=M:50&party=W:-1
    const TEST_SEED: Seed = 12345;
    const TEST_NR_OF_ROWS = 8;
    const TEST_NR_OF_COLUMNS = 12;
    const BASE_PARTY: PartyMembers = buildBasePartyMembers();
    const stateListener = vi.fn();

    beforeEach(() => {
      vi.useFakeTimers();
      stateListener.mockClear();
      sameGame.addStateChangeListener(stateListener);
      sameGame.startGame(
        TEST_NR_OF_ROWS,
        TEST_NR_OF_COLUMNS,
        { ...BASE_PARTY, M: 50, W: -1 },
        TEST_SEED
      );
    });

    afterEach(() => {
      sameGame.removeStateChangeListener(stateListener);
      vi.useRealTimers();
    });

    it("shouldn't have the special creature appear before the first move", () => {
      expect(sameGame['_specialCreatureAppeared']).toBe(false);
    });

    it("shouldn't have the special creature appear after the first move", () => {
      sameGame.handleCellClick(7, 7);
      expect(sameGame['_specialCreatureAppeared']).toBe(false);
    });

    it("shouldn't have the special creature appear after the second move", () => {
      sameGame.handleCellClick(7, 7);
      sameGame.handleCellClick(7, 5);
      expect(sameGame['_specialCreatureAppeared']).toBe(false);
    });

    it('should have the special creature appear after the third move', () => {
      sameGame.handleCellClick(7, 7);
      sameGame.handleCellClick(7, 5);
      const boardBeforeSpecial = sameGame.board;
      const expectedBoardAfterSpecialAppeared = boardUtils.updateCellsInBoard(
        boardUtils.removeGroup(boardBeforeSpecial, [
          '6:0',
          '5:0',
          '5:1',
          '5:2',
          '4:2',
          '4:3',
        ]),
        ['6:8'],
        { hasCreature: true, hasSpecialCreature: true }
      );
      stateListener.mockClear();
      sameGame.handleCellClick(5, 2);
      expect(sameGame['_specialCreatureAppeared']).toBe(true);

      const rowIdx = 6;
      const columnIdx = 8;
      expect(sameGame.board[columnIdx][rowIdx].color).toBe('Y');
      expect(sameGame.board[columnIdx][rowIdx].hasCreature).toBe(true);
      expect(sameGame.board[columnIdx][rowIdx].hasSpecialCreature).toBe(true);
      expect(sameGame.board).toStrictEqual(expectedBoardAfterSpecialAppeared);
      expect(boardUtils.getNonEmptyCells(sameGame.board)).toHaveLength(80); // 12 * 8 - 6 - 4 - 6
      expect(stateListener).toHaveBeenCalledOnce();
      expect(stateListener).toHaveBeenCalledWith({
        board: expectedBoardAfterSpecialAppeared,
        movesLeft: 21,
        scoreCard: {
          allCleared: false,
          cellsRemoved: 36,
          multiplier: 1.5,
          creatures: [],
        },
        gameState: 'IN-PROGRESS',
      });
    });

    it('should execute the effects of the special creature', async () => {
      sameGame.handleCellClick(7, 7);
      sameGame.handleCellClick(7, 5);
      sameGame.handleCellClick(5, 2);
      const boardAfterSpecialAppeared = sameGame.board;

      const rowIdx = 6;
      const columnIdx = 8;
      const expectedGroup: Group = [
        '2:0',
        '4:0',
        '5:0',
        '7:0',
        '1:1',
        '2:1',
        '3:1',
        '5:1',
        '6:1',
        '2:2',
        '6:2',
        '7:2',
        '3:3',
        '4:3',
        '1:4',
        '3:4',
        '5:4',
        '6:4',
        '4:5',
        '5:5',
        '6:5',
        '2:6',
        '3:6',
        '5:6',
        '6:6',
        '7:6',
        '3:7',
        '4:7',
        '6:7',
        '7:7',
        '1:8',
        '3:8',
        '4:8',
        '5:8',
        '6:8',
        '7:8',
        '1:9',
        '2:9',
        '3:9',
        '4:9',
        '5:9',
        '6:9',
        '7:9',
        '1:10',
        '3:10',
        '6:10',
        '7:10',
        '0:11',
        '1:11',
        '3:11',
        '4:11',
        '5:11',
        '6:11',
        '7:11',
      ];
      const expectedUpdatedBoard = boardUtils.updateCellsInBoard(
        boardAfterSpecialAppeared,
        expectedGroup,
        { cellState: 'SHOCKED', hasCreature: false }
      );
      const expectedClearedBoard = boardUtils.removeGroup(
        expectedUpdatedBoard,
        expectedGroup
      );
      stateListener.mockClear();

      expect(boardAfterSpecialAppeared[columnIdx][rowIdx].color).toBe('Y');
      expect(boardAfterSpecialAppeared[columnIdx][rowIdx].hasCreature).toBe(
        true
      );
      expect(
        boardAfterSpecialAppeared[columnIdx][rowIdx].hasSpecialCreature
      ).toBe(true);
      // Cell has a Y special creature
      const effectsThatRan = sameGame.handleCellClick(rowIdx, columnIdx);
      await vi.runAllTimersAsync();

      expect(sameGame.board).toStrictEqual(expectedClearedBoard);
      expect(boardUtils.getNonEmptyCells(sameGame.board)).toHaveLength(26); // 12 * 8 - 6 - 4 - 6 - 54
      expect(stateListener).toHaveBeenCalledTimes(4);
      expect(stateListener).toHaveBeenNthCalledWith(1, {
        board: boardAfterSpecialAppeared,
        movesLeft: 21,
        scoreCard: {
          allCleared: false,
          cellsRemoved: 36,
          multiplier: 1.5,
          creatures: [],
        },
        gameState: 'PAUSED',
      });
      expect(stateListener).toHaveBeenNthCalledWith(2, {
        board: expectedUpdatedBoard,
        movesLeft: 21,
        scoreCard: {
          allCleared: false,
          cellsRemoved: 36,
          multiplier: 1.5,
          creatures: [],
        },
        gameState: 'PAUSED',
      });
      expect(stateListener).toHaveBeenNthCalledWith(3, {
        board: expectedClearedBoard,
        movesLeft: 21,
        scoreCard: {
          allCleared: false,
          cellsRemoved: 2740, // 36 + (54 - 2)^2
          multiplier: 1.5,
          creatures: [],
        },
        gameState: 'PAUSED',
      });
      expect(stateListener).toHaveBeenNthCalledWith(4, {
        board: expectedClearedBoard,
        movesLeft: 5,
        scoreCard: {
          allCleared: false,
          cellsRemoved: 2740,
          multiplier: 1.5,
          creatures: ['M'],
        },
        gameState: 'IN-PROGRESS',
      });
      const expectedScore = 4610; // 2740 * 1.5 + 500
      expect(sameGame.score).toBe(expectedScore);

      expect(effectsThatRan).toHaveLength(2);
      expect(effectsThatRan.at(0)!.effectName).toBe('THUNDER SHOCK');
      expect(effectsThatRan.at(1)!.effectName).toBe('FAINT');
    });

    it('should trigger a game over state with 0 non-empty cells left', async () => {
      sameGame.handleCellClick(7, 7);
      sameGame.handleCellClick(7, 5);
      sameGame.handleCellClick(5, 2);
      sameGame.handleCellClick(6, 8);
      await vi.advanceTimersToNextTimerAsync();
      const lastMove = { rowIdx: 7, columnIdx: 4 };
      stateListener.mockClear();
      sameGame.handleCellClick(lastMove.rowIdx, lastMove.columnIdx);
      await vi.runAllTimersAsync();
      const finishedBoard = sameGame.board;
      expect(boardUtils.getNonEmptyCells(finishedBoard)).toHaveLength(0);
      expect(sameGame['_gameState']).toBe('GAME-OVER');
      expect(stateListener).toHaveBeenLastCalledWith({
        board: finishedBoard,
        movesLeft: 0,
        scoreCard: {
          allCleared: true,
          cellsRemoved: 3316,
          multiplier: 1.5,
          creatures: ['M'],
        },
        gameState: 'GAME-OVER',
      });

      const expectedScore = 6474; // 3316 * 1.5 + 500 + 1000
      expect(sameGame.score).toBe(expectedScore);
    });
  });
});
