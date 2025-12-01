import type { SameGame } from '@game';

export abstract class Recorder<T> {
  protected readonly _gameInstance: SameGame;
  protected readonly _storage: Storage;

  private _listeners: Array<(data: T | null) => void> = [];

  constructor(gameInstance: SameGame, storage = localStorage) {
    this._gameInstance = gameInstance;
    this._storage = storage;
  }

  public addDataChangeListener(listener: (data: T | null) => void) {
    this._listeners.push(listener);
  }

  public removeDataChangeListener(listener: (data: T | null) => void): void {
    const watcherIdx = this._listeners.indexOf(listener);
    if (watcherIdx === -1) {
      return;
    }
    this._listeners.splice(watcherIdx, 1);
  }

  protected notifyListeners(data: T | null) {
    this._listeners.forEach((listener) => listener(data));
  }

  protected abstract readInitialData(): T | null;
}
