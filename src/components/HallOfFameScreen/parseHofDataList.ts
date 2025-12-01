import { calculateScore } from '@game';
import {
  CREATURE_NAMES,
  creatureUtils,
  SPECIAL_CREATURE,
  type ExtendedColor,
} from '@game/creatures';
import type { HallOfFameDataList } from '@game/recorder';
import type { ParsedCreatureListItem, ParsedListItem } from './types';

export function parseHofDataList(
  dataList: HallOfFameDataList | null
): ParsedListItem[] {
  return (dataList || []).map((hofData) => {
    const unusedCreatures = Object.entries(
      hofData.startGameParameters.partyMembers
    )
      .filter(
        ([color, level]) =>
          level > 0 &&
          !hofData.scoreCard.creatures.includes(color as ExtendedColor) &&
          color !== SPECIAL_CREATURE
      )
      .map(([color, level]) =>
        createParsedCreatureListItem(color as ExtendedColor, level, 0)
      );

    const usedCreatures = hofData.scoreCard.creatures
      .filter((color, idx, arr) => arr.indexOf(color) === idx)
      .map((color) =>
        createParsedCreatureListItem(
          color,
          hofData.startGameParameters.partyMembers[color],
          hofData.scoreCard.creatures.filter((creature) => creature === color)
            .length
        )
      );

    return {
      date: hofData.date,
      creatures: usedCreatures.concat(unusedCreatures),
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

function createParsedCreatureListItem(
  color: ExtendedColor,
  level: number,
  timesUsed = 1
): ParsedCreatureListItem {
  const evolutionIdx = creatureUtils.getEvolutionIdx(color, level);
  return {
    color,
    timesUsed,
    name: CREATURE_NAMES[color][evolutionIdx],
    sprite: `${color}-${evolutionIdx}`,
  };
}
