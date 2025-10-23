export type Seed = number;

export interface PRNG {
  get seed(): Seed;
  nextFloat(): number;
  nextRange(min: number, max: number): number;
  reseed(seed: Seed): void;
}
