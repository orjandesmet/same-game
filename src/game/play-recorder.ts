import { buildBasePartyMembers } from './buildBasePartyMembers';
import type { CellKey } from './cells';
import { type PartyMembers } from './creatures';
import type { ScoreCard } from './types';

const REPLAY_STORAGE_KEY = 'same-game-moves-replay';
const HIGHSCORE_STORAGE_KEY = 'same-game-highscore';

export type HighScore = {
  seed: number;
  nrOfRows: number;
  nrOfColumns: number;
  partyMembers: Partial<PartyMembers>;
  scoreCard: ScoreCard;
};

export type Recording = {
  seed: number;
  nrOfRows: number;
  nrOfColumns: number;
  partyMembers: Partial<PartyMembers>;
  moves: CellKey[];
};

export interface Recorder {
  addMove(move: CellKey): void;
  readHighScores(): HighScore[];
  store(): void;
  storeHighScore(scoreCard: ScoreCard): void;
  readRecording(): Recording | null;
  reset(
    nrOfRows: number,
    nrOfColumns: number,
    partyMembers: Partial<PartyMembers>,
    seed?: number
  ): void;
}

export class PlayRecorder implements Recorder {
  private _movesRecord: CellKey[] = [];
  private _nrOfRows = 0;
  private _nrOfColumns = 0;
  private _partyMembers: Partial<PartyMembers> = buildBasePartyMembers();
  private _seed: number = 0;

  reset(
    nrOfRows: number,
    nrOfColumns: number,
    partyMembers: Partial<PartyMembers>,
    seed: number
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
    const recording = sessionStorage.getItem(REPLAY_STORAGE_KEY);
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

  readHighScores(): HighScore[] {
    const existingHighscores =
      localStorage.getItem(HIGHSCORE_STORAGE_KEY) || '';
    const highscores = existingHighscores.split(';;') || [];
    return highscores.map((entry) => {
      const [seed, nrOfRows, nrOfColumns, partyMembersStr, scoreCardStr] =
        entry.split(';');
      return {
        seed: Number(seed),
        nrOfRows: Number(nrOfRows),
        nrOfColumns: Number(nrOfColumns),
        partyMembers: partyMembersStr ? JSON.parse(partyMembersStr) : {},
        scoreCard: scoreCardStr ? JSON.parse(scoreCardStr) : {},
      };
    });
  }

  storeHighScore(scoreCard: ScoreCard) {
    const existingHighscores =
      localStorage.getItem(HIGHSCORE_STORAGE_KEY) || '';
    const highscores = existingHighscores.split(';') || [];
    highscores.push(
      [
        this._seed,
        this._nrOfRows,
        this._nrOfColumns,
        JSON.stringify(this._partyMembers),
        JSON.stringify(scoreCard),
      ]
        .filter(Boolean)
        .map(String)
        .join(';')
    );
    localStorage.setItem(HIGHSCORE_STORAGE_KEY, highscores.join(';;'));
  }
}
