import { COLORS, type Color, type PartyMembers } from '@game/creatures';
import type { Group } from '../board';
import type { CellColor } from '../cells';
import type { PRNG } from '../rng';
import { METRONOME_DURATION_MS } from './constants';
import type { Effects } from './types';

type GetEffectsFn = (
  cellColor: CellColor,
  cellHasSpecialCreature: boolean,
  allGroups: Group[],
    party: Partial<PartyMembers>,
    rng: Readonly<PRNG>,
  ) => Effects | null;

export function createMetronomeEffects(allGroups: Group[], party: Partial<PartyMembers>, rng: Readonly<PRNG>, getEffectsForCell: GetEffectsFn, cellHasSpecialCreature: boolean) {
  const metronomeTargetColors = COLORS.filter(isMetronomeTarget);
  const metronomeTarget = metronomeTargetColors[rng.nextRange(0, metronomeTargetColors.length)];
  const randomResult = getEffectsForCell(
    metronomeTarget,
    cellHasSpecialCreature,
    allGroups,
    party,
    rng,
  );
  if (!randomResult) {
    return null;
  }
  const stages: Effects['stages'] = [{
    color: 'W',
    level: party['W'] ?? 1,
    effectName: 'METRONOME',
    hasSpecialCreature: cellHasSpecialCreature,
    fn: (board) => board,
    duration: METRONOME_DURATION_MS,
  }, ...randomResult.stages];
  return {
    groupFn: randomResult.groupFn,
    stages,
  };
}

function isMetronomeTarget(color: Color) {
  return color !== 'W';
}