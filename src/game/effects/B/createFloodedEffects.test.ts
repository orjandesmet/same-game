import type { PartyMembers } from '@game/creatures';
import { describe, expect, it, vi } from 'vitest';
import { createBasicEffects } from '../createBasicEffects';
import { createFloodedEffects } from './createFloodedEffects';
import { getFloodedGroup } from './getFloodedGroup';

const mockGroupFn = vi.fn();
vi.mock(import('./getFloodedGroup'), () => ({
  getFloodedGroup: vi.fn(() => mockGroupFn),
}));

vi.mock(import('../createBasicEffects'), async (importOriginal) => {
  const original = await importOriginal();
  return {
    createBasicEffects: vi.fn(original.createBasicEffects),
  };
});

describe('createFloodedEffects', () => {
  const party: Partial<PartyMembers> = {
    Y: 30,
    B: 40,
    W: 50,
    G: 10,
  };

  it('should create a basic effect with the flooded parameters when the cell has no special creature', () => {
    const effects = createFloodedEffects(party, false);

    expect(getFloodedGroup).toHaveBeenCalledWith(false);
    expect(createBasicEffects).toHaveBeenCalledWith(
      mockGroupFn,
      'B',
      40,
      false
    );
    expect(effects).toBeDefined();
  });

  it('should create a basic effect with the flooded parameters when the cell has a special creature', () => {
    const effects = createFloodedEffects(party, true);

    expect(getFloodedGroup).toHaveBeenCalledWith(true);
    expect(createBasicEffects).toHaveBeenCalledWith(mockGroupFn, 'B', 40, true);
    expect(effects).toBeDefined();
  });
});
