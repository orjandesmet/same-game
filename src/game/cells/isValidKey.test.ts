import { describe, expect, it } from 'vitest';
import { isValidKey } from './isValidKey';

describe('isValidKey', () => {
  it.each([
    '',
    null,
    undefined,
    { rowIdx: 1, columnIdx: 2 },
    'a',
    'a:b',
    '1:a',
    'a:1',
    '1:2:a',
    '1:',
    '1:undefined',
  ])("should return false for value '%s'", (invalidValue) => {
    expect(isValidKey(invalidValue)).toBe(false);
  });

  it('should return true for a value formatted as `${number}:${number}`', () => {
    expect(isValidKey('1:2')).toBe(true);
  });
});
