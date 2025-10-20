import type { CellKey, Color } from './cells';

export class PlayRecorder {
  private _movesRecord: CellKey[] = [];
  private _nrOfRows = 0;
  private _nrOfColumns = 0;
  private _colors: Color[] = [];
  private _seed?: number;

  reset(
    nrOfRows: number,
    nrOfColumns: number,
    colors: Color[],
    seed?: number
  ) {
    this._movesRecord = [];
    this._nrOfRows = nrOfRows;
    this._nrOfColumns = nrOfColumns;
    this._colors = colors;
    this._seed = seed;
  }

  addMove(move: CellKey) {
    this._movesRecord.push(move);
  }

  store() {
    sessionStorage.setItem(
      'same-game-moves-record',
      [this._seed, this._nrOfRows, this._nrOfColumns, this._colors.join(',')]
        .filter(Boolean)
        .map(String)
        .concat(this._movesRecord)
        .join(';')
    );
  }
}
