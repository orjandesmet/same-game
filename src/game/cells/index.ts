import { createCellKey } from './createCellKey';
import { determineHasCreature } from './determineHasCreature';
import { hasCreature } from './hasCreature';
import { isEmptyCell } from './isEmptyCell';
import { isNearSource } from './isNearSource';

export * from './types';

export const cellUtils = {
  createCellKey,
  determineHasCreature,
  hasCreature,
  isEmptyCell,
  isNearSource,
};
