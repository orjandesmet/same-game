import type { Color } from '@game/creatures';
import type { EffectGroupFn } from './types';
import { boardUtils } from '@game/board';

export const getShockedGroup =
  (additionalColors: Color[]): EffectGroupFn =>
  (board, { rowIdx: sourceRowIdx, columnIdx: sourceColumnIdx }, _debug) => {
    const sourceColor = board[sourceColumnIdx][sourceRowIdx].color;
    const sourceColors = [sourceColor]
      .concat(additionalColors)
      .filter((color, idx, arr) => arr.indexOf(color) === idx)
      .slice(0, 2);
    _debug(
      'THUNDER SHOCK on idx r:%s-c:%s of board with %s rows will affect these additional colors',
      sourceRowIdx,
      sourceColumnIdx,
      additionalColors
    );
    return boardUtils.getAllCellsWithColors(board, sourceColors);
  };
