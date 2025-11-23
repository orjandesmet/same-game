import { buildBasePartyMembers } from '../buildBasePartyMembers';
import type { CellKey } from '../cells';
import { type PartyMembers } from '../creatures';
import type { SameGame } from '../engine';
import type { StartGameParameters } from '../types';
import type { Recorder } from './recorder';
import type { Recording } from './types';

const REPLAY_STORAGE_KEY = 'same-game-moves-replay';

export class PlayRecorder implements Recorder {
  private readonly _gameInstance: SameGame;
  private _movesRecord: CellKey[] = [];
  private _nrOfRows = 0;
  private _nrOfColumns = 0;
  private _partyMembers: PartyMembers = buildBasePartyMembers();
  private _seed: number = 0;

  constructor(gameInstance: SameGame) {
    this._gameInstance = gameInstance;
    this._gameInstance.addEventListener('MOVE-ADDED', this.addMove.bind(this));
    this._gameInstance.addEventListener('START-GAME', this.reset.bind(this));
    this._gameInstance.addEventListener('GAME-OVER', this.store.bind(this));
  }

  private reset({
    nrOfRows,
    nrOfColumns,
    partyMembers,
    seed,
  }: StartGameParameters) {
    this._movesRecord = [];
    this._nrOfRows = nrOfRows;
    this._nrOfColumns = nrOfColumns;
    this._partyMembers = partyMembers;
    this._seed = seed;
  }

  private addMove(move: CellKey) {
    this._movesRecord.push(move);
  }

  private store() {
    localStorage.setItem(
      REPLAY_STORAGE_KEY,
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

  readRecording(): Recording | null {
    const recording = localStorage.getItem(REPLAY_STORAGE_KEY);
    if (!recording) {
      return null;
    }
    const [seedStr, nrOfRowsStr, nrOfColumnsStr, partyMembersStr, ...moves] =
      recording.split(';');
    return {
      seed: Number(seedStr),
      nrOfRows: Number(nrOfRowsStr),
      nrOfColumns: Number(nrOfColumnsStr),
      partyMembers: partyMembersStr ? JSON.parse(partyMembersStr) : {},
      moves: moves as CellKey[],
    };
  }
}
