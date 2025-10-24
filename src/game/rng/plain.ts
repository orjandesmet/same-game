import { type PRNG } from './PRNG';

export class PlainRNG implements PRNG {
  get seed() {
    return 0;
  }

  nextFloat() {
    return Math.random();
  }

  nextRange(min: number, max: number) {
    return Math.floor(this.nextFloat() * (max - min)) + min;
  }

  reseed() {}
}
