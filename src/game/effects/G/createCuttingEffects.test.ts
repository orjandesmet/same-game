import type { PartyMembers } from '@game/creatures';
import { describe, expect, it, vi } from 'vitest';
import { createBasicEffects } from '../createBasicEffects';
import { createCuttingEffects } from './createCuttingEffects';
import { getCuttingGroup } from './getCuttingGroup';

const mockGroupFn = vi.fn();
vi.mock(import('./getCuttingGroup'), () => ({
  getCuttingGroup: vi.fn(() => mockGroupFn),
}));

vi.mock(import('../createBasicEffects'), async (importOriginal) => {
  const original = await importOriginal();
  return {
    createBasicEffects: vi.fn(original.createBasicEffects),
  };
});

describe('createCuttingEffects', () => {
  const party: Partial<PartyMembers> = {
    Y: 30,
    B: 40,
    W: 50,
    G: 10,
  };

  it('should create a basic effect with the flooded parameters when the cell has no special creature', () => {
    const effects = createCuttingEffects(party, false);

    expect(getCuttingGroup).toHaveBeenCalledWith(false);
    expect(createBasicEffects).toHaveBeenCalledWith(
      mockGroupFn,
      'G',
      10,
      false
    );
    expect(effects).toBeDefined();
  });

  it('should create a basic effect with the flooded parameters when the cell has a special creature', () => {
    const effects = createCuttingEffects(party, true);

    expect(getCuttingGroup).toHaveBeenCalledWith(true);
    expect(createBasicEffects).toHaveBeenCalledWith(mockGroupFn, 'G', 10, true);
    expect(effects).toBeDefined();
  });
});
