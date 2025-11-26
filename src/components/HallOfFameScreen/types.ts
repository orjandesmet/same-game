import type { ExtendedColor } from '@game/creatures';
import type { Seed } from '@game/rng';

export type ParsedCreatureListItem = {
  color: ExtendedColor;
  level: number;
  isInParty: boolean;
  score: number;
};

export type ParsedListItem = {
  date: number;
  allCleared: boolean;
  dimensions: `${number}x${number}`;
  score: number;
  creatures: ParsedCreatureListItem[];
  seed: Seed;
};
