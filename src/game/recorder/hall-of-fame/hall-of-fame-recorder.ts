import type { SameGame } from '../../engine';
import type { ScoreCard, StartGameParameters } from '../../types';
import { Recorder } from '../recorder';
import type { ReplayRecorder } from '../replay/replay-recorder';
import type { HallOfFameData, HallOfFameDataList } from './types';

export const HOF_STORAGE_KEY = 'same-game-hall-of-fame';

export class HallOfFameRecorder extends Recorder<HallOfFameDataList> {
  private _startGameParameters: StartGameParameters | null = null;
  private _hallOfFameDataList: HallOfFameDataList = [];
  private _replayRecorder: ReplayRecorder;

  constructor(
    gameInstance: SameGame,
    replayRecorder: ReplayRecorder,
    storage = localStorage
  ) {
    super(gameInstance, storage);
    this._replayRecorder = replayRecorder;
    this._gameInstance.addEventListener('START-GAME', this.reset.bind(this));
    this._gameInstance.addEventListener('GAME-OVER', this.store.bind(this));
  }

  public addDataChangeListener(
    listener: (data: HallOfFameDataList | null) => void
  ): void {
    super.addDataChangeListener(listener);
    listener(this.readInitialData());
  }

  protected readInitialData(): HallOfFameDataList {
    const hallOfFameData = this._storage.getItem(HOF_STORAGE_KEY);
    if (!hallOfFameData) {
      return [];
    }
    try {
      this._hallOfFameDataList = JSON.parse(
        hallOfFameData
      ) satisfies HallOfFameDataList;
      return this._hallOfFameDataList;
    } catch {
      return [];
    }
  }

  private store(scoreCard: ScoreCard) {
    if (this._replayRecorder.replayState) {
      return;
    }
    const now = new Date();
    const newHoFData: HallOfFameData = {
      date: now.getTime(),
      startGameParameters: this._startGameParameters!,
      scoreCard,
    };
    this._hallOfFameDataList = this._hallOfFameDataList
      .concat(newHoFData)
      .slice(-5);
    this._storage.setItem(
      HOF_STORAGE_KEY,
      JSON.stringify(this._hallOfFameDataList)
    );
    this.notifyListeners(this._hallOfFameDataList);
  }

  public removeHoFData() {
    this._storage.removeItem(HOF_STORAGE_KEY);
    this.notifyListeners([]);
  }

  private reset(startGameParameters: StartGameParameters) {
    this._startGameParameters = startGameParameters;
  }
}
