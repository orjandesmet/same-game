import {
  buildBasePartyMembers,
  type SameGame,
  type StartGameParameters,
} from '@game';
import type { CellKey } from '@game/cells';
import { newSeed } from '@game/rng';
import { Recorder } from '../recorder';
import type { ReplayRecording, ReplayState } from './types';

export const REPLAY_STORAGE_KEY = 'same-game-moves-replay';

export class ReplayRecorder extends Recorder<ReplayRecording> {
  private _startGameParameters: StartGameParameters | null = null;
  private _movesRecord: CellKey[] = [];
  private _replayState: ReplayState | null = null;

  public get replayState() {
    return this._replayState;
  }

  constructor(gameInstance: SameGame, storage = localStorage) {
    super(gameInstance, storage);
    this._gameInstance.addEventListener('MOVE-ADDED', this.addMove.bind(this));
    this._gameInstance.addEventListener('START-GAME', this.reset.bind(this));
    this._gameInstance.addEventListener('GAME-OVER', this.store.bind(this));
  }

  private reset(startGameParameters: StartGameParameters) {
    if (
      this._replayState &&
      this._replayState.currentMoveIndex >=
        this._replayState.recording.moves.length
    ) {
      this._replayState = null;
    } else if (this._replayState) {
      return;
    }
    this._startGameParameters = startGameParameters;
    this._movesRecord = [];
  }

  private addMove(move: CellKey) {
    if (this._replayState) {
      return;
    }
    this._movesRecord.push(move);
  }

  private store() {
    if (this._replayState) {
      return;
    }
    if (!this._startGameParameters) {
      return;
    }
    const recording: ReplayRecording = {
      ...this._startGameParameters,
      moves: this._movesRecord,
    };

    this._storage.setItem(REPLAY_STORAGE_KEY, JSON.stringify(recording));
    this.notifyListeners(recording);
  }

  addDataChangeListener(listener: (recording: ReplayRecording | null) => void) {
    super.addDataChangeListener(listener);
    listener(this.readInitialData());
  }

  protected readInitialData(): ReplayRecording | null {
    const recording = this._storage.getItem(REPLAY_STORAGE_KEY);
    if (!recording) {
      return null;
    }
    try {
      return JSON.parse(recording) satisfies ReplayRecording;
    } catch {
      return null;
    }
  }

  deleteRecording() {
    this._storage.removeItem(REPLAY_STORAGE_KEY);
    this.notifyListeners(null);
  }

  startReplay(recording: ReplayRecording) {
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
      nrOfColumns: 10,
      nrOfRows: 10,
      partyMembers: buildBasePartyMembers(),
      seed: newSeed(),
    });
  }
}
