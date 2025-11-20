import { boardUtils, type Board } from './board';
import {
  BASE_CREATURE_PROBABILITY,
  CREATURE_NAMES,
  type PartyMembers,
} from './creatures';
import type { PRNG } from './rng';

export function rollForSpecialCreature(
  board: Board,
  rng: PRNG,
  partyMembers: Partial<PartyMembers>,
  _debug: DebugFn
): { board: Board; appeared: boolean } {
  const boardSize = board.length * board[0].length;
  const availableCells = boardUtils.getNonEmptyCells(board);
  if (availableCells.length === 0) {
    return { board, appeared: false };
  }
  const randomFloat = rng.nextFloat();
  const chanceOfSpecialAppearance =
    (partyMembers.M || BASE_CREATURE_PROBABILITY.M) / 100;
  _debug(
    `There are ${availableCells.length}/${boardSize} available cells for M to appear in (${randomFloat})`
  );
  const mMultiplier = boardSize / availableCells.length;
  _debug(
    `Multiply M chance by ${mMultiplier}*${chanceOfSpecialAppearance} => ${chanceOfSpecialAppearance * mMultiplier}`
  );
  if (randomFloat >= chanceOfSpecialAppearance * mMultiplier) {
    return { board, appeared: false };
  }
  const randomCellIdx = rng.nextRange(0, availableCells.length);
  const mCell = availableCells[randomCellIdx];
  _debug(`A wild ${CREATURE_NAMES.M[0]} appeared on`, mCell);
  const newBoard = boardUtils.updateCellsInBoard(board, [mCell], {
    hasSpecialCreature: true,
    hasCreature: true,
  });
  return { board: newBoard, appeared: true };
}
