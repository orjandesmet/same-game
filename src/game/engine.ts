import {
  boardUtils, type Board,
  type ColumnIdx,
  type Group,
  type RowIdx
} from './board';
import { calculateScore } from './calculateScore';
import {
  cellUtils, type Cell,
  type Color
} from './cells';
import { effectUtils, type Effect } from './effects';
import { PlayRecorder } from './play-recorder';
import { PlainRNG, type PRNG, type Seed } from './rng';
import {
  ALL_CLEARED_BONUS,
  type GameState,
  type GameStatus,
  type ScoreCard,
} from './types';

export class SameGame {
  private _rng: Readonly<PRNG>;
  private _colors: Color[] = [];
  private _recorder: Readonly<PlayRecorder>;
  private _board: Board = [];
  private _allGroups: Group[] = [];
  private _movesLeft = 0;
  private _scoreCard: ScoreCard = {
    allCleared: false,
    cellsRemoved: 0,
    multiplier: 1,
    pkmn: [],
  };
  private _gameState: GameStatus = 'NOT-STARTED';
  private _stateChangeListeners: Array<(gameState: GameState) => void> = [];

  private _debug: typeof console.log = () => {};

  constructor(rng: PRNG = new PlainRNG()) {
    this._rng = rng;
    this._recorder = new PlayRecorder();
  }

  public get board() {
    return this._board;
  }

  public get movesLeft() {
    return this._movesLeft;
  }

  public get score() {
    return calculateScore(this._scoreCard, this._debug);
  }

  public get seed() {
    return this._rng.seed;
  }

  public addStateChangeListener(listener: (gameState: GameState) => void) {
    this._stateChangeListeners.push(listener);
  }

  public removeStateChangeListener(listener: (gameState: GameState) => void) {
    this._stateChangeListeners = this._stateChangeListeners.filter(
      (l) => l !== listener
    );
  }

  private notifyStateChange() {
    const gameState: GameState = {
      board: this._board,
      movesLeft: this._movesLeft,
      scoreCard: structuredClone(this._scoreCard),
      gameState: this._gameState,
    };
    this._stateChangeListeners.forEach((listener) => listener(gameState));
  }

  public enableDebugMode() {
    this._debug = (...args) => console.log('SameGame', ...args);
    this._debug('Debug mode enabled');
  }

  public startGame(
    rows: number,
    columns: number,
    colors: Color[],
    seed?: Seed
  ) {
    if (seed) {
      this.reseed(seed);
    }
    this._debug(
      `Starting new game ${rows}x${columns} with party ${colors}, (seed: ${seed})`
    );
    this._scoreCard = {
      allCleared: false,
      cellsRemoved: 0,
      multiplier: colors.length / 2,
      pkmn: [],
    };
    this._colors = colors;
    this._recorder.reset(rows, columns, colors, seed);

    this._board = boardUtils.createBoard(rows, columns, colors, this._rng);

    this._debug(`\n`, boardUtils.toString(this._board));
    this.recalculateGameState();
    this.notifyStateChange();
  }

  private recalculateMovesLeft() {
    this._allGroups = boardUtils
      .getAllGroups(this._board)
      .filter((g) => g.length >= 2);
    this._debug('All groups in board:', this._allGroups);
    const pkmnInBoard = boardUtils.countCellsWithPkmn(this._board);
    this._debug('Cells with Pokémon in board:', pkmnInBoard);
    this._movesLeft = this._allGroups.length + pkmnInBoard;
    this._debug('Moves left:', this._movesLeft);
  }

  private recalculateGameState() {
    this.recalculateMovesLeft();
    this._gameState = this._movesLeft > 0 ? 'IN-PROGRESS' : 'GAME-OVER';
    if (this._gameState === 'GAME-OVER') {
      this._debug('Game Over');
      if (
        !this._board.some((column) =>
          column.some((cell) => !cellUtils.isEmptyCell(cell))
        )
      ) {
        this._scoreCard.allCleared = true;
        this._debug('All cleared, bonus', ALL_CLEARED_BONUS, '->', this.score);
      }
      this._recorder.store();
    }
  }

  public removeGroupForCell(rowIdx: RowIdx, columnIdx: ColumnIdx): Effect[] {
    if (this._gameState !== 'IN-PROGRESS') {
      this._debug(
        'Game not in progress, ignoring cell click on:',
        rowIdx,
        columnIdx
      );
      return [];
    }
    const cellKey = cellUtils.createCellKey(rowIdx, columnIdx);
    this._recorder.addMove(cellKey);
    const cell = this._board[columnIdx][rowIdx];
    if (cellUtils.isEmptyCell(cell)) {
      this._debug('Clicked on empty cell', cellKey);
      return [];
    }

    if (cell.hasPkmn) {
      this._debug('Clicked on cell with Pokémon', cellKey);
      const effects = effectUtils.getEffectsForCell(
        cell.color,
        this._allGroups,
        this._colors,
        this._rng
      );
      if (effects) {
        this._gameState = 'PAUSED';
        this.notifyStateChange();

        const affectedGroup = effects.groupFn(this._board, {
          rowIdx,
          columnIdx,
        });
        effectUtils
          .runEffects(
            effects.stages,
            this._board,
            affectedGroup,
            (newBoard) => this.effectCallback(newBoard),
            {
              cellUpdate: (board, group, updatedCell) =>
                this.updateCellsInBoard(board, group, updatedCell),
              cellRemove: (board, group) => this.removeGroup(board, group),
              debug: this._debug,
            }
          )
          .then(() => {
            this._scoreCard.pkmn.push(cell.color);
            this.recalculateGameState();
            this.notifyStateChange();
          });
        return effects.stages;
      }
      return [];
    }

    // Normal behaviour
    const group = this._allGroups.find((g) => g.includes(cellKey));
    if (group && group.length >= 2) {
      this._board = this.removeGroup(this._board, group);
      this.recalculateGameState();
      this.notifyStateChange();
    }
    return [];
  }

  private effectCallback(board: Board) {
    this._board = board;
    this.notifyStateChange();
  }

  private removeGroup(board: Board, group: Group) {
    const clearedBoard = boardUtils.removeGroup(board, group);
    this._debug('Removed group', group);
    const gainedScore = Math.pow(group.length - 2, 2);
    this._scoreCard.cellsRemoved += gainedScore;
    this._debug('Gained points', gainedScore, '->', this.score);
    return clearedBoard;
  }

  private updateCellsInBoard(
    board: Board,
    group: Group,
    updatedCell: Partial<Pick<Cell, 'color' | 'hasPkmn' | 'cellState'>>
  ) {
    return boardUtils.updateCellsInBoard(board, group, updatedCell);
  }

  private reseed(seed: Seed) {
    this._rng.reseed(seed);
  }
}
