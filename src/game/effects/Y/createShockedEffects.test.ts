import type { PartyMembers } from '@game/creatures';
import type { PRNG } from '@game/rng';
import { describe, expect, it, vi, type Mocked } from 'vitest';
import { createBasicEffects } from '../createBasicEffects';
import { createShockedEffects } from './createShockedEffects';
import { getShockedGroup } from './getShockedGroup';

const mockRNG: Mocked<PRNG> = {
  nextFloat: vi.fn(),
  nextRange: vi.fn(),
  reseed: vi.fn(),
  seed: 1234,
};

const mockGroupFn = vi.fn();
vi.mock(import('./getShockedGroup'), () => ({
  getShockedGroup: vi.fn(() => mockGroupFn),
}));

vi.mock(import('../createBasicEffects'), async (importOriginal) => {
  const original = await importOriginal();
  return {
    createBasicEffects: vi.fn(original.createBasicEffects),
  };
});

describe('createShockedEffects', () => {
  const party: Partial<PartyMembers> = {
    Y: 30,
    B: 40,
    W: 50,
    G: 10,
  };

  it('should create a basic effect with no additional colors when no special creature is in the cell', () => {
    const effects = createShockedEffects(party, mockRNG, false);

    expect(getShockedGroup).toHaveBeenCalledWith([]);
    expect(createBasicEffects).toHaveBeenCalledWith(
      mockGroupFn,
      'Y',
      30,
      false
    );
    expect(effects).toBeDefined();
  });

  it('should create a basic effect with an additional colors when there is a special creature is in the cell', () => {
    mockRNG.nextRange.mockReturnValueOnce(2);
    mockRNG.nextRange.mockReturnValueOnce(3);
    const effects = createShockedEffects(party, mockRNG, true);

    expect(getShockedGroup).toHaveBeenCalledWith(['W', 'G']);
    expect(createBasicEffects).toHaveBeenCalledWith(mockGroupFn, 'Y', 30, true);
    expect(effects).toBeDefined();
  });

  it('should not allow two times the same additional color', () => {
    mockRNG.nextRange.mockReturnValueOnce(2);
    mockRNG.nextRange.mockReturnValueOnce(2);
    const effects = createShockedEffects(party, mockRNG, true);

    expect(getShockedGroup).toHaveBeenCalledWith(['W', 'B']);
    expect(createBasicEffects).toHaveBeenCalledWith(mockGroupFn, 'Y', 30, true);
    expect(effects).toBeDefined();
  });

  it('should not allow two times the same additional color when index 0 has been selected', () => {
    mockRNG.nextRange.mockReturnValueOnce(0);
    mockRNG.nextRange.mockReturnValueOnce(0);
    const effects = createShockedEffects(party, mockRNG, true);

    expect(getShockedGroup).toHaveBeenCalledWith(['Y', 'B']);
    expect(createBasicEffects).toHaveBeenCalledWith(mockGroupFn, 'Y', 30, true);
    expect(effects).toBeDefined();
  });
});
