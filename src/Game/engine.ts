import { boardUtils } from './boardUtils';
import { cellUtils } from './cellUtils';
import { PlayRecorder } from './play-recorder';
import { PlainRNG } from './rng/plain';
import type { PRNG, Seed } from './rng/PRNG';
import { COLORS, type Board, type CellKey, type CellValue } from './types';

export class SameGame {
  private _rng: PRNG;
  private _recorder: PlayRecorder;
  private _board: Board = [];
  private _allGroups: CellKey[][] = [];
  private _movesLeft = 0;
  private _score = 0;
  private _gameState = 'NOT-STARTED'; // TODO: enum
  
  private _debug: typeof console.log = () => {};

  constructor(rng: PRNG = new PlainRNG()) {
    this._rng = rng;
    this._recorder = new PlayRecorder()
  }

  public get board() {
    return boardUtils.flattenBoard(this._board);
  }

  public get movesLeft() {
    return this._movesLeft;
  }

  public get score() {
    return this._score;
  }

  public get seed() {
    return this._rng.seed;
  }

  public enableDebugMode() {
    this._debug = (...args) => console.log('SameGame', ...args);
    this._debug('Debug mode enabled');
  }

  public startGame(rows: number, columns: number, nrOfColors: number = 4, seed?: Seed) {
    if (seed) {
      this.reseed(seed);
    }
    this._debug(`Starting new game ${rows}x${columns} with ${nrOfColors} colors`);
    this._score = 0;
    this._recorder.reset(rows, columns, nrOfColors, seed);

    const colors: CellValue[] = COLORS.slice(0, Math.max(nrOfColors, 2));
    this._board = boardUtils.createBoard(rows, columns, colors, this._rng);

    this._debug(`\n${boardUtils.toString(this._board)}`);
    this.recalculateMovesLeft();
    this.recalculateGameState();
  }
  
  private recalculateMovesLeft() {
    this._allGroups = boardUtils.getAllGroups(this._board).filter(g => g.length >= 2);
    this._debug('All groups in board:', this._allGroups);
    this._movesLeft = this._allGroups.length;
    this._debug('Moves left:', this._movesLeft)
  }

  private recalculateGameState() {
    this._gameState = this._movesLeft > 0 ? 'STARTED' : 'GAME_OVER';
    if (this._gameState === 'GAME_OVER') {
      this._debug('Game Over');
      if (!this._board.some((column) => column.some((cell) => !cellUtils.isEmptyCell(cell)))) {
        const bonus = 1000;
        this._score += bonus;
        this._debug('All cleared, bonus', bonus, '->', this._score);
      }
      this._recorder.store();
    }
  }

  public removeGroupForCell(cellKey: CellKey) {
    if (this._gameState !== 'STARTED') {
      return;
    }
    this._recorder.addMove(cellKey);
    const group = this._allGroups.find((g) => g.includes(cellKey));
    if (group && group.length >= 2) {
      this._board = boardUtils.removeGroup(this._board, group);
      this._debug('Removed group for', cellKey, group);
      const gainedScore = Math.pow(group.length - 2, 2);
      this._score += gainedScore;
      this._debug('Gained points', gainedScore, '->', this._score);
      this.recalculateMovesLeft();
      this.recalculateGameState();
    }
  }

  private reseed(seed: Seed) {
    this._rng.reseed(seed);
  }
}

