import type { ColumnIdx, RowIdx } from '@game/board';
import { cellUtils } from '@game/cells';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
  type MockedObject,
} from 'vitest';
import { buildBasePartyMembers } from '../buildBasePartyMembers';
import { SameGame } from '../engine';
import { cleanEventListeners } from '../eventListeners';
import type { GameState, ScoreCard, StartGameParameters } from '../types';
import { PlayRecorder, REPLAY_STORAGE_KEY } from './play-recorder';
import type { Recording } from './types';

class SameGameMock extends SameGame {
  public startGame = vi.fn();
  public handleCellClick = vi.fn();

  mockStartGame = vi.fn((startGameParameters: StartGameParameters) => {
    this.notifyListeners('START-GAME', startGameParameters);
  });
  mockNotifyStateChange = vi.fn((gameState: GameState) => {
    this.notifyListeners('STATE-CHANGE', gameState);
  });
  mockHandleCellClick = vi.fn((rowIdx: RowIdx, columnIdx: ColumnIdx) => {
    const cellKey = cellUtils.createCellKey(rowIdx, columnIdx);
    this.notifyListeners('MOVE-ADDED', cellKey);
  });
  mockGameOver = vi.fn((scoreCard: ScoreCard) => {
    this.notifyListeners('GAME-OVER', scoreCard);
  });
  clearEventListeners() {
    this._eventListeners = cleanEventListeners();
  }
}

const mockStorage: MockedObject<Storage> = {
  getItem: vi.fn(),
  removeItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
};

describe('play-recorder', () => {
  const mockEngine = new SameGameMock();
  let playRecorder: PlayRecorder;

  beforeEach(() => {
    vi.clearAllMocks();
    playRecorder = new PlayRecorder(mockEngine, mockStorage);
  });

  afterEach(() => {
    mockEngine.clearEventListeners();
  });

  describe('== while not replaying ==', () => {
    it('should not have a replayState', () => {
      expect(playRecorder.replayState).toBeNull();
    });

    it('should handle a start-game event', () => {
      expect(playRecorder['_nrOfColumns']).toBe(0);
      expect(playRecorder['_nrOfRows']).toBe(0);
      expect(playRecorder['_seed']).toBe(0);
      expect(playRecorder['_partyMembers']).toStrictEqual(
        buildBasePartyMembers()
      );
      expect(playRecorder['_movesRecord']).toHaveLength(0);
      const partyMembers = {
        ...buildBasePartyMembers(),
        R: 10,
        B: 30,
        G: 20,
        Y: 50,
      };
      mockEngine.mockStartGame({
        nrOfColumns: 10,
        nrOfRows: 10,
        partyMembers,
        seed: 1234,
      });
      expect(playRecorder['_nrOfColumns']).toBe(10);
      expect(playRecorder['_nrOfRows']).toBe(10);
      expect(playRecorder['_seed']).toBe(1234);
      expect(playRecorder['_partyMembers']).toStrictEqual(partyMembers);
      expect(playRecorder['_movesRecord']).toHaveLength(0);
    });

    it('should handle a move event', () => {
      expect(playRecorder['_movesRecord']).toHaveLength(0);
      mockEngine.mockHandleCellClick(3, 2);
      expect(playRecorder['_movesRecord']).toHaveLength(1);
      expect(playRecorder['_movesRecord'].at(0)).toBe('3:2');
    });

    it('should handle a multiple move event', () => {
      expect(playRecorder['_movesRecord']).toHaveLength(0);
      mockEngine.mockHandleCellClick(3, 2);
      mockEngine.mockHandleCellClick(5, 1);
      mockEngine.mockHandleCellClick(9, 12);
      expect(playRecorder['_movesRecord']).toHaveLength(3);
      expect(playRecorder['_movesRecord'].at(0)).toBe('3:2');
      expect(playRecorder['_movesRecord'].at(1)).toBe('5:1');
      expect(playRecorder['_movesRecord'].at(2)).toBe('9:12');
    });

    it('should clear the moves on a start-game event', () => {
      mockEngine.mockHandleCellClick(9, 12);
      expect(playRecorder['_movesRecord']).toHaveLength(1);
      mockEngine.mockStartGame({
        nrOfColumns: 10,
        nrOfRows: 10,
        partyMembers: buildBasePartyMembers(),
        seed: 1234,
      });
      expect(playRecorder['_movesRecord']).toHaveLength(0);
    });

    it('should handle a game-over event', () => {
      const partyMembers = {
        ...buildBasePartyMembers(),
        R: 10,
        B: 30,
        G: 20,
        Y: 50,
      };
      mockEngine.mockStartGame({
        nrOfColumns: 10,
        nrOfRows: 10,
        partyMembers,
        seed: 1234,
      });
      mockEngine.mockHandleCellClick(3, 2);
      mockEngine.mockHandleCellClick(5, 1);
      mockEngine.mockHandleCellClick(9, 12);
      expect(mockStorage.setItem).not.toHaveBeenCalled();
      mockEngine.mockGameOver({
        allCleared: true,
        cellsRemoved: 23,
        creatures: [],
        multiplier: 2,
      });
      expect(mockStorage.setItem).toHaveBeenCalledOnce();
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        REPLAY_STORAGE_KEY,
        JSON.stringify({
          seed: 1234,
          nrOfRows: 10,
          nrOfColumns: 10,
          partyMembers,
          moves: ['3:2', '5:1', '9:12'],
        })
      );
    });
  });

  describe('== while replaying ==', () => {
    const partyMembers = {
      ...buildBasePartyMembers(),
      R: 10,
      B: 30,
      G: 20,
      Y: 50,
    };
    const mockRecording: Recording = {
      seed: 1234,
      nrOfRows: 10,
      nrOfColumns: 10,
      partyMembers,
      moves: ['1:3', '4:3', '8:5'],
    };

    beforeEach(() => {
      playRecorder.startReplay(mockRecording);
    });

    it('should have set the replayState', () => {
      expect(playRecorder.replayState).toStrictEqual({
        currentMoveIndex: 0,
        recording: mockRecording,
      });
    });

    it('should have started a game', () => {
      expect(mockEngine.startGame).toHaveBeenCalledWith({
        seed: 1234,
        nrOfRows: 10,
        nrOfColumns: 10,
        partyMembers,
      });
    });

    it('should not handle start-game event', () => {
      expect(playRecorder['_nrOfColumns']).toBe(0);
      expect(playRecorder['_nrOfRows']).toBe(0);
      expect(playRecorder['_seed']).toBe(0);
      expect(playRecorder['_partyMembers']).toStrictEqual(
        buildBasePartyMembers()
      );
      expect(playRecorder['_movesRecord']).toHaveLength(0);
    });

    it('should not handle a move event', () => {
      mockEngine.mockHandleCellClick(3, 4);
      expect(playRecorder['_movesRecord']).toHaveLength(0);
    });

    it('should not handle a game-over event', () => {
      mockEngine.mockStartGame({
        nrOfColumns: 10,
        nrOfRows: 10,
        partyMembers,
        seed: 1234,
      });
      mockEngine.mockHandleCellClick(3, 2);
      mockEngine.mockHandleCellClick(5, 1);
      mockEngine.mockHandleCellClick(9, 12);
      mockEngine.mockGameOver({
        allCleared: true,
        cellsRemoved: 23,
        creatures: [],
        multiplier: 2,
      });
      expect(mockStorage.setItem).not.toHaveBeenCalled();
    });

    it('should handle the first move', () => {
      playRecorder.replayNextMove();
      expect(mockEngine.handleCellClick).toHaveBeenCalledOnce();
      expect(mockEngine.handleCellClick).toHaveBeenCalledWith(1, 3);
      expect(playRecorder.replayState?.currentMoveIndex).toBe(1);
    });

    it('should handle the second move', () => {
      playRecorder.replayNextMove();
      playRecorder.replayNextMove();
      expect(mockEngine.handleCellClick).toHaveBeenCalledTimes(2);
      expect(mockEngine.handleCellClick).toHaveBeenNthCalledWith(1, 1, 3);
      expect(mockEngine.handleCellClick).toHaveBeenNthCalledWith(2, 4, 3);
      expect(playRecorder.replayState?.currentMoveIndex).toBe(2);
    });

    it('should stop the replay', () => {
      mockEngine.startGame.mockClear();
      playRecorder.stopReplay();
      expect(playRecorder.replayState).toBeNull();
      expect(mockEngine.startGame).toHaveBeenCalledOnce();
    });
  });

  describe('== RecordingChangeListener ==', () => {
    const recordingChangeListener = vi.fn();

    afterEach(() => {
      playRecorder.removeRecordingChangeListener(recordingChangeListener);
    });

    it('should notify recordingChangeListener that there is a recording', () => {
      (mockStorage.getItem as Mock<Storage['getItem']>).mockReturnValue(null);

      playRecorder.addRecordingChangeListener(recordingChangeListener);

      expect(recordingChangeListener).toHaveBeenCalledOnce();
      expect(recordingChangeListener).toHaveBeenCalledWith(null);
    });

    it('should determine that there is a recording if the localStorage returns one', () => {
      const mockRecording: Recording = {
        seed: 1234,
        nrOfRows: 10,
        nrOfColumns: 10,
        partyMembers: buildBasePartyMembers(),
        moves: ['1:3', '4:3', '8:5'],
      };
      (mockStorage.getItem as Mock<Storage['getItem']>).mockReturnValue(
        JSON.stringify(mockRecording)
      );

      playRecorder.addRecordingChangeListener(recordingChangeListener);

      expect(recordingChangeListener).toHaveBeenCalledOnce();
      expect(recordingChangeListener).toHaveBeenCalledWith(mockRecording);
    });

    it('should not throw an error when the stored recording is of the wrong format', () => {
      (mockStorage.getItem as Mock<Storage['getItem']>).mockReturnValue(
        'SOMETHING WRONG'
      );

      playRecorder.addRecordingChangeListener(recordingChangeListener);

      expect(recordingChangeListener).toHaveBeenCalledOnce();
      expect(recordingChangeListener).toHaveBeenCalledWith(null);
    });
    // Add your tests here

    it('should send out an event when the recording has been removed', () => {
      playRecorder.addRecordingChangeListener(recordingChangeListener);
      recordingChangeListener.mockClear();

      playRecorder.deleteRecording();
      expect(mockStorage.removeItem).toHaveBeenCalled();
      expect(recordingChangeListener).toHaveBeenCalledOnce();
      expect(recordingChangeListener).toHaveBeenCalledWith(null);
    });

    it('should send out an event when the recording has been stored', () => {
      playRecorder.addRecordingChangeListener(recordingChangeListener);
      recordingChangeListener.mockClear();
      mockEngine.mockStartGame({
        nrOfColumns: 10,
        nrOfRows: 10,
        partyMembers: buildBasePartyMembers(),
        seed: 1234,
      });
      mockEngine.mockHandleCellClick(3, 4);

      mockEngine.mockGameOver({
        allCleared: true,
        cellsRemoved: 10,
        creatures: [],
        multiplier: 2,
      });
      expect(recordingChangeListener).toHaveBeenCalledOnce();
      expect(recordingChangeListener).toHaveBeenCalledWith({
        seed: 1234,
        nrOfRows: 10,
        nrOfColumns: 10,
        partyMembers: buildBasePartyMembers(),
        moves: ['3:4'],
      });
    });
  });
});
