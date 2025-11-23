import type { CellKey } from '@game/cells';
import type { PartyMembers } from '@game/creatures';

export type Recording = {
  seed: number;
  nrOfRows: number;
  nrOfColumns: number;
  partyMembers: PartyMembers;
  moves: CellKey[];
};
