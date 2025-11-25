import { buildBasePartyMembers } from '../buildBasePartyMembers';
import type { CellKey } from '../cells';
import { type PartyMembers } from '../creatures';
import type { SameGame } from '../engine';
import type { StartGameParameters } from '../types';
import type { Recorder } from './recorder';
import type { Recording, ReplayState } from './types';

export const REPLAY_STORAGE_KEY = 'same-game-moves-replay';

export class PlayRecorder implements Recorder {
  private readonly _gameInstance: SameGame;
  private _storage: Storage;
  private _movesRecord: CellKey[] = [];
  private _nrOfRows = 0;
  private _nrOfColumns = 0;
  private _partyMembers: PartyMembers = buildBasePartyMembers();
  private _seed: number = 0;
  private _replayState: ReplayState | null = null;
  private _recordingListeners: Array<(recording: Recording | null) => void> =
    [];

  public get replayState() {
    return this._replayState;
  }

  constructor(gameInstance: SameGame, storage = localStorage) {
    this._gameInstance = gameInstance;
    this._storage = storage;
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
    if (this._replayState) {
      return;
    }
    this._movesRecord = [];
    this._nrOfRows = nrOfRows;
    this._nrOfColumns = nrOfColumns;
    this._partyMembers = partyMembers;
    this._seed = seed;
  }

  private addMove(move: CellKey) {
    if (this._replayState) {
      return;
    }
    this._movesRecord.push(move);
  }

  private store() {
    if (this._replayState) {
      this._replayState = null;
      return;
    }
    const recording: Recording = {
      seed: this._seed,
      nrOfRows: this._nrOfRows,
      nrOfColumns: this._nrOfColumns,
      partyMembers: this._partyMembers,
      moves: this._movesRecord,
    };

    this._storage.setItem(REPLAY_STORAGE_KEY, JSON.stringify(recording));
    this.notifyListeners(recording);
  }

  private notifyListeners(recording: Recording | null) {
    this._recordingListeners.forEach((listener) => listener(recording));
  }

  addRecordingChangeListener(listener: (recording: Recording | null) => void) {
    this._recordingListeners.push(listener);
    listener(this.readRecording());
  }

  removeRecordingChangeListener(
    listener: (recording: Recording | null) => void
  ): void {
    const watcherIdx = this._recordingListeners.indexOf(listener);
    if (watcherIdx === -1) {
      return;
    }
    this._recordingListeners.splice(watcherIdx, 1);
  }

  private readRecording(): Recording | null {
    const recording = this._storage.getItem(REPLAY_STORAGE_KEY);
    if (!recording) {
      return null;
    }
    try {
      return JSON.parse(recording) satisfies Recording;
    } catch {
      return null;
    }
  }

  deleteRecording() {
    this._storage.removeItem(REPLAY_STORAGE_KEY);
    this.notifyListeners(null);
  }

  startReplay(recording: Recording) {
    this._replayState = {
      recording,
      currentMoveIndex: 0,
    };
    this._gameInstance.startGame({
      nrOfRows: recording.nrOfRows,
      nrOfColumns: recording.nrOfColumns,
      partyMembers: recording.partyMembers,
      seed: recording.seed,
    });
  }

  replayNextMove() {
    if (!this._replayState) {
      return false;
    }
    const { recording, currentMoveIndex } = this._replayState;
    if (currentMoveIndex >= recording.moves.length) {
      this._replayState = null;
      return false;
    }
    const [rowIdx, columnIdx] = recording.moves[currentMoveIndex]
      .split(':')
      .map(Number);
    this._gameInstance.handleCellClick(rowIdx, columnIdx);
    this._replayState.currentMoveIndex += 1;
    return true;
  }

  stopReplay() {
    this._replayState = null;
    this._gameInstance.startGame({
      nrOfRows: this._nrOfRows,
      nrOfColumns: this._nrOfColumns,
      partyMembers: this._partyMembers,
      seed: this._seed,
    });
  }
}
