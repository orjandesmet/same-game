import type { Color, PartyMembers } from '@game/pkmn';
import { boardUtils, type Group } from '../board';
import { cellUtils } from '../cells';
import { getSelectedColors } from '../getSelectedPartyMembers';
import type { PRNG } from '../rng';
import { EFFECT_DURATION_MS, TRANSFORM_DURATION_MS } from './constants';
import type { EffectGroupFn, Effects } from './types';

export function createTransformEffects(
  allGroups: Group[],
  party: Partial<PartyMembers>,
  rng: PRNG,
  cellHasM: boolean
): Effects {
  const colors = getSelectedColors(party);
  const transformTargetColors = colors.filter(isTransformTarget);
  const transformTarget =
    transformTargetColors[rng.nextRange(0, transformTargetColors.length)];
  return {
    groupFn: getTransformingGroup(allGroups, cellHasM),
    stages: [
      {
        color: 'P',
        level: party['P'] ?? 1,
        effectName: 'TRANSFORM',
        hasM: cellHasM,
        fn: (board, group, { cellUpdate }) => {
          return cellUpdate(board, group, { cellState: 'TRANSFORMING' });
        },
        duration: TRANSFORM_DURATION_MS,
      },
      {
        color: transformTarget,
        level: party[transformTarget] ?? 1,
        hasM: false,
        fn: (board, group, { cellUpdate }) => {
          return cellUpdate(board, group, {
            color: transformTarget,
            level: party[transformTarget] ?? 1,
            cellState: 'NORMAL',
          });
        },
        duration: EFFECT_DURATION_MS,
      },
    ],
  };
}

function getTransformingGroup(
  allGroups: Group[],
  cellHasM: boolean
): EffectGroupFn {
  return (board, { rowIdx, columnIdx }, _debug) => {
    if (cellHasM) {
      const sourceColor = board[columnIdx][rowIdx].color;
      _debug('TRANSFORM will affect all cells with color', sourceColor);
      return boardUtils.getAllCellsWithColors(board, [sourceColor]);
    }
    const cellKey = cellUtils.createCellKey(rowIdx, columnIdx);
    const group = allGroups.find((g) => g.includes(cellKey));
    return group || [cellKey];
  };
}

function isTransformTarget(color: Color) {
  return color !== 'P' && color !== 'W';
}
