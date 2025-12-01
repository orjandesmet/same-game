import { SameGame, type ScoreCard, type StartGameParameters } from '@game';
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
import { buildBasePartyMembers } from '../../buildBasePartyMembers';
import { cleanEventListeners } from '../../eventListeners';
import { HallOfFameRecorder, HOF_STORAGE_KEY } from './hall-of-fame-recorder';
import type { HallOfFameDataList } from './types';

class SameGameMock extends SameGame {
  mockStartGame = vi.fn((startGameParameters: StartGameParameters) => {
    this.notifyListeners('START-GAME', startGameParameters);
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

describe('HallOfFameRecorder', () => {
  const mockEngine = new SameGameMock();
  let hallOfFameRecorder: HallOfFameRecorder;

  beforeEach(() => {
    vi.clearAllMocks();
    hallOfFameRecorder = new HallOfFameRecorder(mockEngine, mockStorage);
  });

  afterEach(() => {
    mockEngine.clearEventListeners();
  });

  it('should handle a start-game event', () => {
    expect(hallOfFameRecorder['_startGameParameters']).toBeNull();
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
    expect(hallOfFameRecorder['_startGameParameters']).toStrictEqual({
      nrOfColumns: 10,
      nrOfRows: 10,
      partyMembers,
      seed: 1234,
    });
  });

  it('should handle a game-over event', () => {
    const partyMembers = {
      ...buildBasePartyMembers(),
      R: 10,
      B: 30,
      G: 20,
      Y: 50,
    };
    const mockDate = new Date(2022, 0, 1);
    vi.setSystemTime(mockDate);
    mockEngine.mockStartGame({
      nrOfColumns: 10,
      nrOfRows: 10,
      partyMembers,
      seed: 1234,
    });
    expect(mockStorage.setItem).not.toHaveBeenCalled();
    mockEngine.mockGameOver({
      allCleared: true,
      cellsRemoved: 23,
      creatures: [],
      multiplier: 2,
    });
    expect(mockStorage.setItem).toHaveBeenCalledOnce();
    expect(mockStorage.setItem).toHaveBeenCalledWith(
      HOF_STORAGE_KEY,
      JSON.stringify([
        {
          date: mockDate.getTime(),
          startGameParameters: {
            nrOfColumns: 10,
            nrOfRows: 10,
            partyMembers,
            seed: 1234,
          },
          scoreCard: {
            allCleared: true,
            cellsRemoved: 23,
            creatures: [],
            multiplier: 2,
          },
        },
      ])
    );
  });

  it('should handle multiple game-over events', () => {
    const partyMembers = {
      ...buildBasePartyMembers(),
      R: 10,
      B: 30,
      G: 20,
      Y: 50,
    };
    const startGameParameters: StartGameParameters = {
      nrOfColumns: 10,
      nrOfRows: 10,
      partyMembers,
      seed: 1234,
    };
    mockEngine.mockStartGame(startGameParameters);
    expect(mockStorage.setItem).not.toHaveBeenCalled();
    const mockDate = new Date(2022, 0, 1);
    vi.setSystemTime(mockDate);
    mockEngine.mockGameOver({
      allCleared: true,
      cellsRemoved: 23,
      creatures: [],
      multiplier: 2,
    });
    const mockDate2 = new Date(2022, 0, 2);
    vi.setSystemTime(mockDate2);
    mockEngine.mockGameOver({
      allCleared: true,
      cellsRemoved: 50,
      creatures: [],
      multiplier: 4,
    });
    expect(mockStorage.setItem).toHaveBeenCalledTimes(2);
    expect(mockStorage.setItem).toHaveBeenNthCalledWith(
      1,
      HOF_STORAGE_KEY,
      JSON.stringify([
        {
          date: mockDate.getTime(),
          startGameParameters,
          scoreCard: {
            allCleared: true,
            cellsRemoved: 23,
            creatures: [],
            multiplier: 2,
          },
        },
      ])
    );
    expect(mockStorage.setItem).toHaveBeenNthCalledWith(
      2,
      HOF_STORAGE_KEY,
      JSON.stringify([
        {
          date: mockDate.getTime(),
          startGameParameters,
          scoreCard: {
            allCleared: true,
            cellsRemoved: 23,
            creatures: [],
            multiplier: 2,
          },
        },
        {
          date: mockDate2.getTime(),
          startGameParameters,
          scoreCard: {
            allCleared: true,
            cellsRemoved: 50,
            creatures: [],
            multiplier: 4,
          },
        },
      ])
    );
  });

  it('should only store max 5 game-over events', () => {
    const partyMembers = {
      ...buildBasePartyMembers(),
      R: 10,
      B: 30,
      G: 20,
      Y: 50,
    };
    const startGameParameters: StartGameParameters = {
      nrOfColumns: 10,
      nrOfRows: 10,
      partyMembers,
      seed: 1234,
    };
    const mockDate = new Date(2022, 0, 1);
    vi.setSystemTime(mockDate);
    mockEngine.mockStartGame(startGameParameters);
    expect(mockStorage.setItem).not.toHaveBeenCalled();
    const scoreCards: ScoreCard[] = Array.from({ length: 6 }).map((_, idx) => ({
      allCleared: true,
      cellsRemoved: idx + 1,
      creatures: [],
      multiplier: 2,
    }));
    scoreCards.forEach(mockEngine.mockGameOver);

    expect(mockStorage.setItem).toHaveBeenCalledTimes(6);
    expect(mockStorage.setItem).toHaveBeenLastCalledWith(
      HOF_STORAGE_KEY,
      JSON.stringify([
        {
          date: mockDate.getTime(),
          startGameParameters,
          scoreCard: scoreCards[1],
        },
        {
          date: mockDate.getTime(),
          startGameParameters,
          scoreCard: scoreCards[2],
        },
        {
          date: mockDate.getTime(),
          startGameParameters,
          scoreCard: scoreCards[3],
        },
        {
          date: mockDate.getTime(),
          startGameParameters,
          scoreCard: scoreCards[4],
        },
        {
          date: mockDate.getTime(),
          startGameParameters,
          scoreCard: scoreCards[5],
        },
      ])
    );
  });

  describe('== DataChangeListener ==', () => {
    const dataChangeListener = vi.fn();

    afterEach(() => {
      hallOfFameRecorder.removeDataChangeListener(dataChangeListener);
    });

    it('should notify dataChangeListener that there is no HoF data', () => {
      (mockStorage.getItem as Mock<Storage['getItem']>).mockReturnValue(null);

      hallOfFameRecorder.addDataChangeListener(dataChangeListener);

      expect(dataChangeListener).toHaveBeenCalledOnce();
      expect(dataChangeListener).toHaveBeenCalledWith([]);
    });

    it('should determine that there is a Hof data if the localStorage returns one', () => {
      const mockHofData: HallOfFameDataList = [
        {
          date: 12345,
          startGameParameters: {
            seed: 1234,
            nrOfRows: 10,
            nrOfColumns: 10,
            partyMembers: buildBasePartyMembers(),
          },
          scoreCard: {
            allCleared: true,
            cellsRemoved: 23,
            creatures: [],
            multiplier: 2,
          },
        },
      ];
      (mockStorage.getItem as Mock<Storage['getItem']>).mockReturnValue(
        JSON.stringify(mockHofData)
      );

      hallOfFameRecorder.addDataChangeListener(dataChangeListener);

      expect(dataChangeListener).toHaveBeenCalledOnce();
      expect(dataChangeListener).toHaveBeenCalledWith(mockHofData);
    });

    it('should not throw an error when the stored HoF data is of the wrong format', () => {
      (mockStorage.getItem as Mock<Storage['getItem']>).mockReturnValue(
        'SOMETHING WRONG'
      );

      hallOfFameRecorder.addDataChangeListener(dataChangeListener);

      expect(dataChangeListener).toHaveBeenCalledOnce();
      expect(dataChangeListener).toHaveBeenCalledWith([]);
    });
    // Add your tests here

    it('should send out an event when the HoF data has been removed', () => {
      hallOfFameRecorder.addDataChangeListener(dataChangeListener);
      dataChangeListener.mockClear();

      hallOfFameRecorder.removeHoFData();
      expect(mockStorage.removeItem).toHaveBeenCalled();
      expect(dataChangeListener).toHaveBeenCalledOnce();
      expect(dataChangeListener).toHaveBeenCalledWith([]);
    });

    it('should send out an event when the HoF data has been stored', () => {
      hallOfFameRecorder.addDataChangeListener(dataChangeListener);
      dataChangeListener.mockClear();
      mockEngine.mockStartGame({
        nrOfColumns: 10,
        nrOfRows: 10,
        partyMembers: buildBasePartyMembers(),
        seed: 1234,
      });

      const mockDate = new Date(2022, 0, 1);
      vi.setSystemTime(mockDate);
      mockEngine.mockGameOver({
        allCleared: true,
        cellsRemoved: 10,
        creatures: [],
        multiplier: 2,
      });
      expect(dataChangeListener).toHaveBeenCalledOnce();
      expect(dataChangeListener).toHaveBeenCalledWith([
        {
          date: mockDate.getTime(),
          startGameParameters: {
            seed: 1234,
            nrOfRows: 10,
            nrOfColumns: 10,
            partyMembers: buildBasePartyMembers(),
          },
          scoreCard: {
            allCleared: true,
            cellsRemoved: 10,
            creatures: [],
            multiplier: 2,
          },
        },
      ]);
    });
  });
});
