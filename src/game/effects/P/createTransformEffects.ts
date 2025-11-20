import { type Group } from '@game/board';
import type { Color, PartyMembers } from '@game/creatures';
import type { PRNG } from '@game/rng';
import { getSelectedColors } from '../../getSelectedPartyMembers';
import { EFFECT_DURATION_MS, TRANSFORM_DURATION_MS } from '../constants';
import type { Effects } from '../types';
import { getTransformingGroup } from './getTransformingGroup';

export function createTransformEffects(
  allGroups: Group[],
  party: Partial<PartyMembers>,
  rng: PRNG,
  cellHasSpecialCreature: boolean
): Effects {
  const colors = getSelectedColors(party);
  const transformTargetColors = colors.filter(isTransformTarget);
  const transformTarget =
    transformTargetColors[rng.nextRange(0, transformTargetColors.length)];
  return {
    groupFn: getTransformingGroup(allGroups, cellHasSpecialCreature),
    stages: [
      {
        color: 'P',
        level: party['P'] ?? 1,
        effectName: 'TRANSFORM',
        hasSpecialCreature: cellHasSpecialCreature,
        fn: (board, group, { cellUpdate }) => {
          return cellUpdate(board, group, { cellState: 'TRANSFORMING' });
        },
        duration: TRANSFORM_DURATION_MS,
      },
      {
        color: transformTarget,
        level: party[transformTarget] ?? 1,
        hasSpecialCreature: false,
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

function isTransformTarget(color: Color) {
  return color !== 'P' && color !== 'W';
}
