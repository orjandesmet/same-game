import { describe, expect, it } from 'vitest';
import { createTestBoard } from './createTestBoard.test-util';
import { getGroup } from './getGroup';

describe('getGroup', () => {
  it('finds connected cells of the same color', () => {
    const board = createTestBoard(['...', 'RB.', 'RB.']);

    const group = getGroup(board, 1, 0, 'R');

    expect(group).toHaveLength(2);
    expect(group).toContain('1:0'); // Middle R
    expect(group).toContain('2:0'); // Bottom R
  });

  it('finds all connected cells in complex patterns', () => {
    const board = createTestBoard(['BRR', 'BRB', 'RRB']);

    const group = getGroup(board, 1, 1, 'R');

    expect(group).toHaveLength(5);
    expect(group).toContain('1:1'); // Center R
    expect(group).toContain('2:1'); // Bottom center R
    expect(group).toContain('2:0'); // Bottom left R
    expect(group).toContain('0:1'); // Top center R
    expect(group).toContain('0:2'); // Top right R
  });

  it('stops at board boundaries', () => {
    const board = createTestBoard(['..', 'RR']);

    const group = getGroup(board, 1, 0, 'R');

    expect(group).toHaveLength(2);
  });

  it('stops at different colors', () => {
    const board = createTestBoard(['RRR', 'RBR']);

    const group = getGroup(board, 1, 0, 'R');

    expect(group).toHaveLength(5);
    expect(group).not.toContain('1:1'); // Center B
  });
});
