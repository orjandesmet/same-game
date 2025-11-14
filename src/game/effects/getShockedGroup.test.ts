import { describe, expect, it } from 'vitest';
import { createTestBoard } from '../board/createTestBoard.test-util';
import { getShockedGroup } from './getShockedGroup';

describe('getShockedGroup', () => {
  it('should return all items with the current color if there are no additional colors', () => {
    const board = createTestBoard(['RGBY', 'BGRY', 'YRGB', 'BBRB']);

    const shockedGroup = getShockedGroup([])(board, {rowIdx: 0, columnIdx: 3}, () => {});

    expect(shockedGroup).toHaveLength(3);

    expect(shockedGroup).toContain('0:3');
    expect(shockedGroup).toContain('1:3');
    expect(shockedGroup).toContain('2:0');
  });

  it('should return all items with the current and the first additional color if there are additional colors', () => {
    const board = createTestBoard(['RGBY', 'BGRY', 'YRGB', 'BBRB']);

    const shockedGroup = getShockedGroup(['B', 'G'])(board, {rowIdx: 0, columnIdx: 3}, () => {});

    expect(shockedGroup).toHaveLength(9);

    expect(shockedGroup).toContain('0:2');
    expect(shockedGroup).toContain('0:3');
    expect(shockedGroup).toContain('1:0');
    expect(shockedGroup).toContain('1:3');
    expect(shockedGroup).toContain('2:0');
    expect(shockedGroup).toContain('2:3');
    expect(shockedGroup).toContain('3:0');
    expect(shockedGroup).toContain('3:1');
    expect(shockedGroup).toContain('3:3');
  });

  it('should return all items with the current and the second additional color if the first additional color is the same as the current', () => {
    const board = createTestBoard(['RGBY', 'BGRY', 'YRGB', 'BBRB']);

    const shockedGroup = getShockedGroup(['Y', 'G'])(board, {rowIdx: 0, columnIdx: 3}, () => {});

    expect(shockedGroup).toHaveLength(6);

    expect(shockedGroup).toContain('0:1');
    expect(shockedGroup).toContain('0:3');
    expect(shockedGroup).toContain('1:1');
    expect(shockedGroup).toContain('1:3');
    expect(shockedGroup).toContain('2:0');
    expect(shockedGroup).toContain('2:2');
  });

  it('should return all items with the current and no additional colors if the both additional colors are the same as the current', () => {
    const board = createTestBoard(['RGBY', 'BGRY', 'YRGB', 'BBRB']);

    const shockedGroup = getShockedGroup(['Y', 'Y'])(board, {rowIdx: 0, columnIdx: 3}, () => {});

    expect(shockedGroup).toHaveLength(3);

    expect(shockedGroup).toContain('0:3');
    expect(shockedGroup).toContain('1:3');
    expect(shockedGroup).toContain('2:0');
  });
});