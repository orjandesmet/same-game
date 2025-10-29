import type { Color, PartyMembers } from '@game/pkmn';
import type { Group } from '../board';
import { cellUtils } from '../cells';
import type { PRNG } from '../rng';
import { EFFECT_DURATION_MS, TRANSFORM_DURATION_MS } from './constants';
import type { EffectGroupFn, Effects } from './types';
import { getSelectedColors } from '../getSelectedPartyMembers';

export function createTransformEffects(allGroups: Group[], party: Partial<PartyMembers>, rng: PRNG): Effects {
  const colors = getSelectedColors(party);
  const transformTargetColors = colors.filter(isTransformTarget);
  const transformTarget = transformTargetColors[rng.nextRange(0, transformTargetColors.length)];
  return {
    groupFn: getTransformingGroup(allGroups),
    stages: [
      {
        color: 'P',
        level: party['P'] ?? 1,
        effectName: 'TRANSFORM',
        fn: (board, group, { cellUpdate }) => {
          return cellUpdate(board, group, { cellState: 'TRANSFORMING' });
        },
        duration: TRANSFORM_DURATION_MS,
      },
      {
        color: transformTarget,
        level: party[transformTarget] ?? 1,
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

function getTransformingGroup(allGroups: Group[]): EffectGroupFn {
  return (_, { rowIdx, columnIdx }) => {
    const cellKey = cellUtils.createCellKey(rowIdx, columnIdx);
    const group = allGroups.find((g) => g.includes(cellKey));
    return group || [cellKey];
  };
}


function isTransformTarget(color: Color) {
  return color !== 'P' && color !== 'W';
}
