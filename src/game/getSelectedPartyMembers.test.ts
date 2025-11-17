import { describe, expect, it } from 'vitest';
import type { PartyMembers } from './creatures';
import {
  getSelectedColors,
  getSelectedPartyMembers,
} from './getSelectedPartyMembers';

describe('getSelectedPartyMembers', () => {
  it('should return only the party members with a level > 0', () => {
    const inputParty: PartyMembers = {
      B: 10,
      G: -4,
      M: 30,
      P: 0,
      R: 23,
      W: -5,
      Y: 10000,
    };

    const { selectedPartyMembers, colors } =
      getSelectedPartyMembers(inputParty);
    expect(selectedPartyMembers).toStrictEqual({
      B: 10,
      M: 30,
      R: 23,
      Y: 10000,
    });

    expect(colors).toHaveLength(3);
  });

  it('should return the selected colors, excluding the special creature', () => {
    const party: Partial<PartyMembers> = {
      B: 10,
      M: 30,
      R: 23,
      Y: 10000,
    };

    const selectedColors = getSelectedColors(party);
    expect(selectedColors).toHaveLength(3);
    expect(selectedColors).toContain('B');
    expect(selectedColors).toContain('R');
    expect(selectedColors).toContain('Y');
    expect(selectedColors).not.toContain('M');
  });
});
