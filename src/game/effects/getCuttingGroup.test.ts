import { describe, expect, it } from 'vitest';
import { createTestBoard } from '../board/createTestBoard.test-util';
import { getCuttingGroup } from './getCuttingGroup';

describe('getCuttingGroup', () => {
  it('should get all cell in the current row when no special creature', () => {
    const board = createTestBoard(['RGBY', 'BGRY', 'YRGB', 'BBRB']);
    
    const cuttingGroup = getCuttingGroup(false)(board, {rowIdx: 1, columnIdx: 1}, () => {});

    expect(cuttingGroup).toHaveLength(4);
    expect(cuttingGroup).toContain('1:0');
    expect(cuttingGroup).toContain('1:1');
    expect(cuttingGroup).toContain('1:2');
    expect(cuttingGroup).toContain('1:3');
  });

  it('should get all the cells in the current row and the one above and below if there is a special creature', () => {
  const board = createTestBoard(['RGBY', 'BGRY', 'YRGB', 'BBRB']);
    
    const cuttingGroup = getCuttingGroup(true)(board, {rowIdx: 1, columnIdx: 1}, () => {});

    expect(cuttingGroup).toHaveLength(12);
    expect(cuttingGroup).toContain('0:0');
    expect(cuttingGroup).toContain('0:1');
    expect(cuttingGroup).toContain('0:2');
    expect(cuttingGroup).toContain('0:3');
    expect(cuttingGroup).toContain('1:0');
    expect(cuttingGroup).toContain('1:1');
    expect(cuttingGroup).toContain('1:2');
    expect(cuttingGroup).toContain('1:3');
    expect(cuttingGroup).toContain('2:0');
    expect(cuttingGroup).toContain('2:1');
    expect(cuttingGroup).toContain('2:2');
    expect(cuttingGroup).toContain('2:3');
  });

  it('should get all the cells in the current row and the two below if there is a special creature and the current cell is top row', () => {
  const board = createTestBoard(['RGBY', 'BGRY', 'YRGB', 'BBRB']);
    
    const cuttingGroup = getCuttingGroup(true)(board, {rowIdx: 0, columnIdx: 1}, () => {});

    expect(cuttingGroup).toHaveLength(12);
    expect(cuttingGroup).toContain('0:0');
    expect(cuttingGroup).toContain('0:1');
    expect(cuttingGroup).toContain('0:2');
    expect(cuttingGroup).toContain('0:3');
    expect(cuttingGroup).toContain('1:0');
    expect(cuttingGroup).toContain('1:1');
    expect(cuttingGroup).toContain('1:2');
    expect(cuttingGroup).toContain('1:3');
    expect(cuttingGroup).toContain('2:0');
    expect(cuttingGroup).toContain('2:1');
    expect(cuttingGroup).toContain('2:2');
    expect(cuttingGroup).toContain('2:3');
  });

  it('should get all the cells in the current row and the two above if there is a special creature and the current cell is bottom row', () => {
  const board = createTestBoard(['RGBY', 'BGRY', 'YRGB', 'BBRB']);
    
    const cuttingGroup = getCuttingGroup(true)(board, {rowIdx: 3, columnIdx: 1}, () => {});

    expect(cuttingGroup).toHaveLength(12);
    expect(cuttingGroup).toContain('1:0');
    expect(cuttingGroup).toContain('1:1');
    expect(cuttingGroup).toContain('1:2');
    expect(cuttingGroup).toContain('1:3');
    expect(cuttingGroup).toContain('2:0');
    expect(cuttingGroup).toContain('2:1');
    expect(cuttingGroup).toContain('2:2');
    expect(cuttingGroup).toContain('2:3');
    expect(cuttingGroup).toContain('3:0');
    expect(cuttingGroup).toContain('3:1');
    expect(cuttingGroup).toContain('3:2');
    expect(cuttingGroup).toContain('3:3');
  });
})