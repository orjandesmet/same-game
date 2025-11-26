import type { ScoreCard, StartGameParameters } from '@game';

export type HallOfFameData = {
  startGameParameters: StartGameParameters;
  scoreCard: ScoreCard;
};

export type HallOfFameDataList = Array<HallOfFameData>;
