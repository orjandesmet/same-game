import { boardUtils, type Board } from './board';
import { BASE_PKMN_PROBABILITY, type PartyMembers } from './pkmn';
import type { PRNG } from './rng';

export function mAppears(board: Board, rng: PRNG, partyMembers: Partial<PartyMembers>, _debug: DebugFn): { board: Board, appeared: boolean} {
  const boardSize = board.length * board[0].length;
  const availableCells = boardUtils.getNonEmptyCells(board);
  if (availableCells.length === 0) {
    return { board, appeared: false};
  }
  const randomFloat = rng.nextFloat();
  const chanceOfMAppearing = (partyMembers.M || BASE_PKMN_PROBABILITY.M) / 100;
  _debug(`There are ${availableCells.length}/${boardSize} available cells for M to appear in (${randomFloat})`);
  const mMultiplier = boardSize / availableCells.length;
  _debug(`Multiply M chance by ${mMultiplier}*${chanceOfMAppearing} => ${chanceOfMAppearing * mMultiplier}`);
  if (randomFloat >= chanceOfMAppearing * mMultiplier) {
    return {board, appeared: false};
  }
  const randomCellIdx = rng.nextRange(0, availableCells.length);
  const mCell = availableCells[randomCellIdx];
  _debug('A wild M appeared on', mCell);
  const newBoard = boardUtils.updateCellsInBoard(board, [mCell], {hasM: true, hasPkmn: true});
  return { board: newBoard, appeared: true};
}