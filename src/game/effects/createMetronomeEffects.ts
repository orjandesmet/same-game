import { COLORS, type Color, type PartyMembers } from '@game/pkmn';
import type { Group } from '../board';
import type { CellColor } from '../cells';
import type { PRNG } from '../rng';
import { METRONOME_DURATION_MS } from './constants';
import type { Effects } from './types';

type GetEffectsFn = (
  cellColor: CellColor,
  cellHasM: boolean,
  allGroups: Group[],
    party: Partial<PartyMembers>,
    rng: Readonly<PRNG>,
  ) => Effects | null;

export function createMetronomeEffects(allGroups: Group[], party: Partial<PartyMembers>, rng: Readonly<PRNG>, getEffectsForCell: GetEffectsFn, cellHasM: boolean) {
  const metronomeTargetColors = COLORS.filter(isMetronomeTarget);
  const metronomeTarget = metronomeTargetColors[rng.nextRange(0, metronomeTargetColors.length)];
  const randomResult = getEffectsForCell(
    metronomeTarget,
    cellHasM,
    allGroups,
    party,
    rng,
  );
  if (!randomResult) {
    return null;
  }
  randomResult.stages.unshift({
    color: 'W',
    level: party['W'] ?? 1,
    effectName: 'METRONOME',
    fn: (board) => board,
    duration: METRONOME_DURATION_MS,
  });
  return {
    groupFn: randomResult.groupFn,
    stages: randomResult.stages,
  };
}

function isMetronomeTarget(color: Color) {
  return color !== 'W';
}