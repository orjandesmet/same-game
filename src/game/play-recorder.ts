import type { CellKey } from './cells';
import { BASE_PKMN_PROBABILITY, type PartyMembers } from './pkmn';

export class PlayRecorder {
  private _movesRecord: CellKey[] = [];
  private _nrOfRows = 0;
  private _nrOfColumns = 0;
  private _partyMembers: Partial<PartyMembers> = BASE_PKMN_PROBABILITY;
  private _seed?: number;

  reset(
    nrOfRows: number,
    nrOfColumns: number,
    partyMembers: Partial<PartyMembers>,
    seed?: number
  ) {
    this._movesRecord = [];
    this._nrOfRows = nrOfRows;
    this._nrOfColumns = nrOfColumns;
    this._partyMembers = partyMembers;
    this._seed = seed;
  }

  addMove(move: CellKey) {
    this._movesRecord.push(move);
  }

  store() {
    sessionStorage.setItem(
      'same-game-moves-record',
      [
        this._seed,
        this._nrOfRows,
        this._nrOfColumns,
        JSON.stringify(this._partyMembers),
      ]
        .filter(Boolean)
        .map(String)
        .concat(this._movesRecord)
        .join(';')
    );
  }
}
