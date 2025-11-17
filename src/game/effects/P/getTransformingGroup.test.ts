import type { Group } from '@game/board';
import { describe, expect, it, vi } from 'vitest';
import { createTestBoard } from '../../board/createTestBoard.test-util';
import { getTransformingGroup } from './getTransformingGroup';

describe('getTransformingGroup', () => {
  const mockAllGroups: Group[] = [
    ['4:3', '5:2', '5:3'],
    ['1:2', '1:3', '0:3'],
  ];
  const testBoard = createTestBoard(['RGBY', 'BGRR', 'BBGG']);

  it("should get the current cell's group when the cell has no special creature", () => {
    const getGroup = getTransformingGroup(mockAllGroups, false);
    const group = getGroup(testBoard, { rowIdx: 1, columnIdx: 3 }, vi.fn());

    expect(group).toBe(mockAllGroups[1]);
  });

  it('should get all the cells with the current color when the cell has a special creature', () => {
    const getGroup = getTransformingGroup(mockAllGroups, true);
    const group = getGroup(testBoard, { rowIdx: 1, columnIdx: 3 }, vi.fn());

    expect(group).toHaveLength(3);
    expect(group).toContain('0:0');
    expect(group).toContain('1:2');
    expect(group).toContain('1:3');
  });
});
