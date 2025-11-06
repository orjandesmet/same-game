import { countCellsWithPkmn } from './countCellsWithPkmn';
import { createBoard } from './createBoard';
import { getAllCellsWithColors } from './getAllCellsWithColors';
import { getAllGroups } from './getAllGroups';
import { getGroup } from './getGroup';
import { getNonEmptyCells } from './getNonEmptyCells';
import { removeGroup } from './removeGroup';
import { toString } from './toString';
import { updateCellsInBoard } from './updateCellsInBoard';

export * from './types';

export const boardUtils = {
  countCellsWithPkmn,
  createBoard,
  getAllCellsWithColors,
  getAllGroups,
  getGroup,
  getNonEmptyCells,
  removeGroup,
  toString,
  updateCellsInBoard,
};
