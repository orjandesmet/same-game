import { describe, expect, it } from 'vitest';
import { createTestBoard } from '../../board/createTestBoard.test-util';
import { getFloodedGroup } from './getFloodedGroup';

describe('getFloodedGroup', () => {
  it('should get all cell in the current column when no special creature', () => {
    const board = createTestBoard(['RGBY', 'BGRY', 'YRGB', 'BBRB']);

    const cuttingGroup = getFloodedGroup(false)(
      board,
      { rowIdx: 1, columnIdx: 1 },
      () => {}
    );

    expect(cuttingGroup).toHaveLength(4);
    expect(cuttingGroup).toContain('0:1');
    expect(cuttingGroup).toContain('1:1');
    expect(cuttingGroup).toContain('2:1');
    expect(cuttingGroup).toContain('3:1');
  });

  it('should get all the cells in the current column and the one left and right if there is a special creature', () => {
    const board = createTestBoard(['RGBY', 'BGRY', 'YRGB', 'BBRB']);

    const cuttingGroup = getFloodedGroup(true)(
      board,
      { rowIdx: 1, columnIdx: 1 },
      () => {}
    );

    expect(cuttingGroup).toHaveLength(12);
    expect(cuttingGroup).toContain('0:0');
    expect(cuttingGroup).toContain('1:0');
    expect(cuttingGroup).toContain('2:0');
    expect(cuttingGroup).toContain('3:0');
    expect(cuttingGroup).toContain('0:1');
    expect(cuttingGroup).toContain('1:1');
    expect(cuttingGroup).toContain('2:1');
    expect(cuttingGroup).toContain('3:1');
    expect(cuttingGroup).toContain('0:2');
    expect(cuttingGroup).toContain('1:2');
    expect(cuttingGroup).toContain('2:2');
    expect(cuttingGroup).toContain('3:2');
  });

  it('should get all the cells in the current column and the two right if there is a special creature and the current cell is the first column', () => {
    const board = createTestBoard(['RGBY', 'BGRY', 'YRGB', 'BBRB']);

    const cuttingGroup = getFloodedGroup(true)(
      board,
      { rowIdx: 1, columnIdx: 0 },
      () => {}
    );

    expect(cuttingGroup).toHaveLength(12);
    expect(cuttingGroup).toContain('0:0');
    expect(cuttingGroup).toContain('1:0');
    expect(cuttingGroup).toContain('2:0');
    expect(cuttingGroup).toContain('3:0');
    expect(cuttingGroup).toContain('0:1');
    expect(cuttingGroup).toContain('1:1');
    expect(cuttingGroup).toContain('2:1');
    expect(cuttingGroup).toContain('3:1');
    expect(cuttingGroup).toContain('0:2');
    expect(cuttingGroup).toContain('1:2');
    expect(cuttingGroup).toContain('2:2');
    expect(cuttingGroup).toContain('3:2');
  });

  it('should get all the cells in the current column and the two left if there is a special creature and the current cell is last column', () => {
    const board = createTestBoard(['RGBY', 'BGRY', 'YRGB', 'BBRB']);

    const cuttingGroup = getFloodedGroup(true)(
      board,
      { rowIdx: 1, columnIdx: 3 },
      () => {}
    );

    expect(cuttingGroup).toHaveLength(12);
    expect(cuttingGroup).toContain('0:1');
    expect(cuttingGroup).toContain('1:1');
    expect(cuttingGroup).toContain('2:1');
    expect(cuttingGroup).toContain('3:1');
    expect(cuttingGroup).toContain('0:2');
    expect(cuttingGroup).toContain('1:2');
    expect(cuttingGroup).toContain('2:2');
    expect(cuttingGroup).toContain('3:2');
    expect(cuttingGroup).toContain('0:3');
    expect(cuttingGroup).toContain('1:3');
    expect(cuttingGroup).toContain('2:3');
    expect(cuttingGroup).toContain('3:3');
  });
});
