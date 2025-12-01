import type { ScoreCard, StartGameParameters } from '@game';

export type HallOfFameData = {
  date: number;
  startGameParameters: StartGameParameters;
  scoreCard: ScoreCard;
};

export type HallOfFameDataList = Array<HallOfFameData>;
