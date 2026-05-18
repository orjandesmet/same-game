import type { Group } from '@game/board';
import type { CellColor } from '@game/cells';
import { COLORS, type Color, type PartyMembers } from '@game/creatures';
import type { PRNG } from '@game/rng';
import { METRONOME_DURATION_MS } from '../constants';
import type { Effects } from '../types';

type GetEffectsFn = (
  cellColor: CellColor,
  cellHasSpecialCreature: boolean,
  allGroups: Group[],
  party: Partial<PartyMembers>,
  rng: Readonly<PRNG>
) => Effects | null;

type MetronomeTarget = Color | 'CONFUSE_RAY';

export function createMetronomeEffects(
  allGroups: Group[],
  party: Partial<PartyMembers>,
  rng: Readonly<PRNG>,
  getEffectsForCell: GetEffectsFn,
  cellHasSpecialCreature: boolean
) {
  const metronomeTargetColors: MetronomeTarget[] = [
    ...COLORS.filter(isMetronomeTarget),
    'CONFUSE_RAY',
  ];
  const metronomeTarget =
    metronomeTargetColors[rng.nextRange(0, metronomeTargetColors.length)];
  const randomResult =
    metronomeTarget === 'CONFUSE_RAY'
      ? createConfuseRayEffects(party, cellHasSpecialCreature)
      : getEffectsForCell(
          metronomeTarget,
          cellHasSpecialCreature,
          allGroups,
          party,
          rng
        );
  if (!randomResult) {
    return null;
  }
  const stages: Effects['stages'] = [
    {
      color: 'W',
      level: party['W'] ?? 1,
      effectName: 'METRONOME',
      hasSpecialCreature: cellHasSpecialCreature,
      fn: (board) => board,
      duration: METRONOME_DURATION_MS,
    },
    ...randomResult.stages,
  ];
  return {
    groupFn: randomResult.groupFn,
    stages,
  };
}

function isMetronomeTarget(color: Color) {
  return color !== 'W';
}

function createConfuseRayEffects(
  party: Partial<PartyMembers>,
  cellHasSpecialCreature: boolean
): Effects {
  return {
    groupFn: () => [],
    stages: [
      {
        color: 'W',
        level: party['W'] ?? 1,
        effectName: 'CONFUSE RAY',
        hasSpecialCreature: cellHasSpecialCreature,
        fn: (board) => board,
        duration: 0,
      },
    ],
  };
}
