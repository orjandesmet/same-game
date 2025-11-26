import { calculateScore } from '@game';
import {
  creatureUtils,
  type CreatureScore,
  type ExtendedColor,
} from '@game/creatures';
import type { HallOfFameDataList } from '@game/recorder';
import type { ParsedCreatureListItem, ParsedListItem } from './types';

export function parseHofDataList(
  dataList: HallOfFameDataList | null
): ParsedListItem[] {
  return (dataList || []).map((hofData) => {
    const creatureScores = creatureUtils.calculateCreatureScores(
      hofData.scoreCard.creatures,
      hofData.startGameParameters.partyMembers
    );
    const baseCreatures = Object.entries(
      hofData.startGameParameters.partyMembers
    )
      .filter(([color]) => color !== 'M')
      .map(([color, level]) =>
        createParsedCreatureListItem(
          color as ExtendedColor,
          level,
          getCreatureScore(color as ExtendedColor, creatureScores)
        )
      );

    const specialCreatureScore = creatureScores.find(
      ({ color }) => color === 'M'
    );
    const specialCreature = specialCreatureScore
      ? createParsedCreatureListItem(
          'M',
          hofData.startGameParameters.partyMembers.M,
          specialCreatureScore.score
        )
      : null;

    return {
      date: hofData.date,
      creatures: specialCreature
        ? baseCreatures.concat(specialCreature)
        : baseCreatures,
      dimensions: `${hofData.startGameParameters.nrOfRows}x${hofData.startGameParameters.nrOfColumns}`,
      allCleared: hofData.scoreCard.allCleared,
      score: calculateScore(
        hofData.scoreCard,
        hofData.startGameParameters.partyMembers
      ),
      seed: hofData.startGameParameters.seed,
    };
  });
}

function getCreatureScore(
  creature: ExtendedColor,
  creatureScores: CreatureScore[]
) {
  return creatureScores.find(({ color }) => creature === color)?.score || 0;
}

function createParsedCreatureListItem(
  color: ExtendedColor,
  level: number,
  score: number
): ParsedCreatureListItem {
  return {
    color,
    level,
    isInParty: level >= 0,
    score,
  };
}
