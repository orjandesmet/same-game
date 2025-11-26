export function newSeed() {
  return Date.now() % (12 * 60 * 60 * 1000);
}
