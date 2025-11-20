import { describe, expect, it } from 'vitest';
import { buildBasePartyMembers } from './buildBasePartyMembers';
import { BASE_CREATURE_PROBABILITY } from './creatures';

describe('buildBasePartyMembers', () => {
  it('should create a basic party member setup', () => {
    const partyMembers = buildBasePartyMembers();

    expect(partyMembers).toStrictEqual({
      R: BASE_CREATURE_PROBABILITY.R,
      Y: BASE_CREATURE_PROBABILITY.Y,
      W: BASE_CREATURE_PROBABILITY.W,
      B: BASE_CREATURE_PROBABILITY.B,
      M: BASE_CREATURE_PROBABILITY.M,
      P: -BASE_CREATURE_PROBABILITY.P,
      G: -BASE_CREATURE_PROBABILITY.G,
    });
  });
});
