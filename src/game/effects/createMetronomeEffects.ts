import type { Color } from '@game/pkmn';
import type { Group } from '../board';
import type { CellColor } from '../cells';
import type { PRNG } from '../rng';
import { METRONOME_DURATION_MS } from './constants';
import type { Effects } from './types';

type GetEffectsFn = (
  cellColor: CellColor,
    allGroups: Group[],
    colors: Color[],
    rng: Readonly<PRNG>
  ) => Effects | null;

export function createMetronomeEffects(allGroups: Group[], colors: Color[], rng: Readonly<PRNG>, getEffectsForCell: GetEffectsFn) {
  const metronomeTargetColors = colors.filter(isMetronomeTarget);
  const metronomeTarget = metronomeTargetColors[rng.nextRange(0, metronomeTargetColors.length)];
  const randomResult = getEffectsForCell(
    metronomeTarget,
    allGroups,
    colors,
    rng
  );
  if (!randomResult) {
    return null;
  }
  randomResult.stages.unshift({
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