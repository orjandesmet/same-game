import { countCellsWithPkmn } from './countCellsWithPkmn';
import { createBoard } from './createBoard';
import { getAllGroups } from './getAllGroups';
import { getCellsWithColors } from './getCellsWithColors';
import { getGroup } from './getGroup';
import { isNearSource } from './isNearSource';
import { removeGroup } from './removeGroup';
import { toString } from './toString';
import { updateCellsInBoard } from './updateCellsInBoard';

export * from './types';

export const boardUtils = {
  countCellsWithPkmn,
  createBoard,
  getAllGroups,
  getCellsWithColors,
  getGroup,
  isNearSource,
  removeGroup,
  toString,
  updateCellsInBoard,
};
