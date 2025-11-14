import { createCellKey } from './createCellKey';
import { determineHasCreature } from './determineHasCreature';
import { hasCreature } from './hasCreature';
import { isEmptyCell } from './isEmptyCell';
import { isNearSource } from './isNearSource';
import { isValidKey } from './isValidKey';

export * from './types';

export const cellUtils = {
  createCellKey,
  determineHasCreature,
  hasCreature,
  isEmptyCell,
  isNearSource,
  isValidKey,
};
