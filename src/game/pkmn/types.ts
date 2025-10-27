import type { COLORS } from './constants';

export type Color = Readonly<(typeof COLORS)[number]>;
export type PartyMembers = Record<Color, number>;