import type { COLORS, SPECIAL_CREATURE } from './constants';

export type Color = Readonly<(typeof COLORS)[number]>;
export type ExtendedColor = Color | typeof SPECIAL_CREATURE;
export type PartyMembers = Record<ExtendedColor, number>;
export type CreatureScore = { color: Color; score: number; level: number };
