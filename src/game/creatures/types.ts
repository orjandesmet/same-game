import type { COLORS, MEW } from './constants';

export type Color = Readonly<(typeof COLORS)[number]>;
export type ExtendedColor = Color | typeof MEW;
export type PartyMembers = Record<ExtendedColor, number>;
export type CreatureScore = {color: Color, score: number, level: number};