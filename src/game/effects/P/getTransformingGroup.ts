import { boardUtils, type Group } from '@game/board';
import { cellUtils } from '@game/cells';
import type { EffectGroupFn } from '../types';

export function getTransformingGroup(
  allGroups: Group[],
  cellHasSpecialCreature: boolean
): EffectGroupFn {
  return (board, { rowIdx, columnIdx }, _debug) => {
    if (cellHasSpecialCreature) {
      const sourceColor = board[columnIdx][rowIdx].color;
      _debug('TRANSFORM will affect all cells with color', sourceColor);
      return boardUtils.getAllCellsWithColors(board, [sourceColor]);
    }
    const cellKey = cellUtils.createCellKey(rowIdx, columnIdx);
    const group = allGroups.find((g) => g.includes(cellKey));
    return group || [cellKey];
  };
}
