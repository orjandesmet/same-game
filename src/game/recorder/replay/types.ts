import type { CellKey } from '@game/cells';
import type { PartyMembers } from '@game/creatures';

export type ReplayRecording = {
  seed: number;
  nrOfRows: number;
  nrOfColumns: number;
  partyMembers: PartyMembers;
  moves: CellKey[];
};

export type ReplayState = {
  recording: ReplayRecording;
  currentMoveIndex: number;
};
