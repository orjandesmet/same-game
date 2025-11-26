import type { SameGame } from '../../engine';
import type { ScoreCard, StartGameParameters } from '../../types';
import { Recorder } from '../recorder';
import type { HallOfFameData, HallOfFameDataList } from './types';

export const HOF_STORAGE_KEY = 'same-game-hall-of-fame';

export class HallOfFameRecorder extends Recorder<HallOfFameDataList> {
  private _startGameParameters: StartGameParameters | null = null;
  private _hallOfFameDataList: HallOfFameDataList = [];

  constructor(gameInstance: SameGame, storage = localStorage) {
    super(gameInstance, storage);
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
    const newHoFData: HallOfFameData = {
      startGameParameters: this._startGameParameters!,
      scoreCard,
    };
    this._hallOfFameDataList.push(newHoFData);
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
