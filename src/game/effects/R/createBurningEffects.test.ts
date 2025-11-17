import type { PartyMembers } from '@game/creatures';
import { describe, expect, it, vi } from 'vitest';
import { createBasicEffects } from '../createBasicEffects';
import { createBurningEffects } from './createBurningEffects';
import { getBurningGroup } from './getBurningGroup';

const mockGroupFn = vi.fn();
vi.mock(import('./getBurningGroup'), () => ({
  getBurningGroup: vi.fn(() => mockGroupFn),
}));

vi.mock(import('../createBasicEffects'), async (importOriginal) => {
  const original = await importOriginal();
  return {
    createBasicEffects: vi.fn(original.createBasicEffects),
  };
});

describe('createBurningEffects', () => {
  const party: Partial<PartyMembers> = {
    Y: 30,
    R: 40,
    W: 50,
    G: 10,
  };

  it('should create a basic effect with the flooded parameters when the cell has no special creature', () => {
    const effects = createBurningEffects(party, false);

    expect(getBurningGroup).toHaveBeenCalledWith(false);
    expect(createBasicEffects).toHaveBeenCalledWith(
      mockGroupFn,
      'R',
      40,
      false
    );
    expect(effects).toBeDefined();
  });

  it('should create a basic effect with the flooded parameters when the cell has a special creature', () => {
    const effects = createBurningEffects(party, true);

    expect(getBurningGroup).toHaveBeenCalledWith(true);
    expect(createBasicEffects).toHaveBeenCalledWith(mockGroupFn, 'R', 40, true);
    expect(effects).toBeDefined();
  });
});
