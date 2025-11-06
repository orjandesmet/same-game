import { describe, expect, it } from 'vitest';
import { createTestBoard } from './createTestBoard.test-util';
import { getAllCellsWithColors } from './getAllCellsWithColors';

describe('getAllCellsWithColors', () => {
  it('should get all cell positions with a given color', () => {
    const board = createTestBoard([
      '..R',
      'RBG',
      'RGR',
    ]);

    const cellsWithB = getAllCellsWithColors(board, ['B']);
    const cellsWithG = getAllCellsWithColors(board, ['G']);
    const cellsWithR = getAllCellsWithColors(board, ['R']);

    expect(cellsWithB).toHaveLength(1);
    expect(cellsWithG).toHaveLength(2);
    expect(cellsWithR).toHaveLength(4);

    expect(cellsWithB).toContain('1:1');

    expect(cellsWithG).toContain('1:2');
    expect(cellsWithG).toContain('2:1');
    
    expect(cellsWithR).toContain('0:2');
    expect(cellsWithR).toContain('1:0');
    expect(cellsWithR).toContain('2:0');
    expect(cellsWithR).toContain('2:2');
  });

  it('should get all cell positions with multiple given colors', () => {
    const board = createTestBoard([
      '..R',
      'RBG',
      'RGR',
    ]);

    const cellsWithBandG = getAllCellsWithColors(board, ['B', 'G']);
    const cellsWithGandR = getAllCellsWithColors(board, ['G', 'R']);
    const cellsWithRandB = getAllCellsWithColors(board, ['R', 'B']);

    expect(cellsWithBandG).toHaveLength(3);
    expect(cellsWithGandR).toHaveLength(6);
    expect(cellsWithRandB).toHaveLength(5);

    expect(cellsWithBandG).toContain('1:1');
    expect(cellsWithBandG).toContain('1:2');
    expect(cellsWithBandG).toContain('2:1');

    expect(cellsWithGandR).toContain('1:2');
    expect(cellsWithGandR).toContain('2:1');
    expect(cellsWithGandR).toContain('0:2');
    expect(cellsWithGandR).toContain('1:0');
    expect(cellsWithGandR).toContain('2:0');
    expect(cellsWithGandR).toContain('2:2');
    
    expect(cellsWithRandB).toContain('1:1');
    expect(cellsWithRandB).toContain('0:2');
    expect(cellsWithRandB).toContain('1:0');
    expect(cellsWithRandB).toContain('2:0');
    expect(cellsWithRandB).toContain('2:2');
  });
});