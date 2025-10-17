import type { PRNG, Seed } from './PRNG';

export class Xorshift32 implements PRNG {
  private _state;
  private _originalSeed: Seed;

  constructor(seed: Seed = Date.now()) {
    this._originalSeed = seed;
    this._state = seed >>> 0;
    if (this._state === 0) this._state = 1; // avoid zero seed
  }

  get seed(): Seed {
    return this._originalSeed;
  }

  private nextInt() {
    let x = this._state;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this._state = x >>> 0;
    return this._state;
  }

  nextFloat() {
    return this.nextInt() / 0xFFFFFFFF;
  }

  nextRange(min: number, max: number) {
    return Math.floor(this.nextFloat() * (max - min)) + min;
  }

  reseed(seed: Seed) {
    this._state = seed >>> 0;
    if (this._state === 0) this._state = 1;
  }
}
