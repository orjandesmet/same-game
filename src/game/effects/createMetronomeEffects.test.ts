import type { PartyMembers } from '@game/creatures';
import { describe, expect, it, vi } from 'vitest';
import type { Effects } from './types';
import { createMetronomeEffects } from './createMetronomeEffects';
import type { PRNG } from '@game/rng';

const mockRNG: PRNG = {
  nextFloat: () => 0.123,
  nextRange: () => 0,
  reseed: () => {},
  seed: 123456,
};

describe('createMetronomeEffects', () => {
  it('should get a random effect and add the metronome stage before it', () => {
    const party: Partial<PartyMembers> = {R: 100};
    const mockGroupFn = vi.fn();
    const mockRandomEffects: Effects = {
      groupFn: mockGroupFn,
      stages: [
        {color: 'R', duration: 400, fn: b => b, level: 24},
        {color: 'G', duration: 600, fn: b => b, level: 30},
      ],
    }
    const mockGetEffectsForCell = vi.fn((): Effects => mockRandomEffects);

    const metronomeEffect = createMetronomeEffects([], party, mockRNG, mockGetEffectsForCell, false);

    expect(metronomeEffect).not.toBeNull();
    expect(metronomeEffect?.groupFn).toBe(mockRandomEffects.groupFn);
    expect(metronomeEffect?.stages).toHaveLength(mockRandomEffects.stages.length + 1);
    expect(metronomeEffect?.stages.at(1)).toBe(mockRandomEffects.stages[0]);
    expect(metronomeEffect?.stages.at(2)).toBe(mockRandomEffects.stages[1]);

    expect(metronomeEffect?.stages.at(0)?.effectName).toBe('METRONOME');
  });

  it('should return null if there is no randomResult', () => {
const party: Partial<PartyMembers> = {R: 100};
    const mockGetEffectsForCell = vi.fn(() => null);

    const metronomeEffect = createMetronomeEffects([], party, mockRNG, mockGetEffectsForCell, false);

    expect(mockGetEffectsForCell).toHaveBeenCalledWith(
      'R', false, [], party, mockRNG
    )

    expect(metronomeEffect).toBeNull();
  });

  it('should pass "cellHasSpecialCreature" to the metronome effect', () => {
    const party: Partial<PartyMembers> = {R: 100};
    const mockGetEffectsForCell = vi.fn(() => null);

    const metronomeEffect = createMetronomeEffects([], party, mockRNG, mockGetEffectsForCell, true);

    expect(mockGetEffectsForCell).toHaveBeenCalledWith(
      'R', true, [], party, mockRNG
    )

    expect(metronomeEffect).toBeNull();
  })
});