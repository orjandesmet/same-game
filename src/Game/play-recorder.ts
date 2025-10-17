import type { CellKey } from './types';

export class PlayRecorder {
  private _movesRecord: CellKey[] = [];
  private _nrOfRows = 0;
  private _nrOfColumns = 0;
  private _nrOfColors = 0;
  private _seed?: number;
  
  reset(nrOfRows: number, nrOfColumns: number, nrOfColors: number, seed?: number) {
    this._movesRecord = [];
    this._nrOfRows = nrOfRows;
    this._nrOfColumns = nrOfColumns;
    this._nrOfColors = nrOfColors;
    this._seed = seed;
  }

  addMove(move: CellKey) {
    this._movesRecord.push(move);
  }

  store() {
    sessionStorage.setItem('same-game-moves-record', [this._seed, this._nrOfRows, this._nrOfColumns, this._nrOfColors].filter(Boolean).map(String).concat(this._movesRecord).join(','));
  } 
}