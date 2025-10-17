import type { PRNG, Seed } from './PRNG';

export class Mulberry32 implements PRNG {
  private _state: number;
  private _originalSeed: Seed;

  constructor(seed: Seed = Date.now()) {
    this._originalSeed = seed;
    this._state = seed >>> 0;
  }
  
  get seed(): Seed {
    return this._originalSeed;
  }

  public nextFloat() {
    this._state += 0x6D2B79F5;
    let x = this._state;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  }

  nextRange(min: number, max: number) {
    return Math.floor(this.nextFloat() * (max - min)) + min;
  }

  reseed(seed: Seed) {
    this._state = seed >>> 0;
    if (this._state === 0) this._state = 1;
  }
}