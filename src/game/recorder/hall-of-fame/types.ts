import type { ScoreCard, StartGameParameters } from '@game';

export type HallOfFameData = {
  id: number;
  startGameParameters: StartGameParameters;
  scoreCard: ScoreCard;
};

export type HallOfFameDataList = Array<HallOfFameData>;
