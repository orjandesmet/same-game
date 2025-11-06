import { describe, expect, it } from 'vitest';
import { getAllGroups } from './getAllGroups';
import { createTestBoard } from './createTestBoard.test-util';

describe('getAllGroups', () => {
    it('finds all possible groups on the board', () => {
      const board = createTestBoard([
        'BRR',
        'BRB',
        'RRB'
      ]);
      
      const groups = getAllGroups(board);
      
      // Should find one large R group and two B groups
      expect(groups).toHaveLength(3);
      
      const bGroupLeft = groups.find(g => g.includes('1:0'));
      const rGroup = groups.find(g => g.includes('1:1'));
      const bGroupRight = groups.find(g => g.includes('1:2'));
      
      expect(rGroup).toHaveLength(5); // Connected R cells
      expect(bGroupLeft).toHaveLength(2); // Connected B cells
      expect(bGroupRight).toHaveLength(2); // Connected B cells
    });

    it('considers an isolated cell as a group of 1 element', () => {
      const board = createTestBoard([
        'BRR',
        'BRG',
        'RRR'
      ]);
      const groups = getAllGroups(board);
      
      // Should find one large R group and one B group and one G group
      expect(groups).toHaveLength(3);
      
      const bGroup = groups.find(g => g.includes('1:0'));
      const rGroup = groups.find(g => g.includes('1:1'));
      const gGroup = groups.find(g => g.includes('1:2'));
      
      expect(rGroup).toHaveLength(6); // Connected R cells
      expect(bGroup).toHaveLength(2); // Connected B cells
      expect(gGroup).toHaveLength(1); // Connected G cells
    });

    it('should not consider empty cells', () => {
      const board = createTestBoard([
        'B..',
        'BRG',
        'RRR'
      ]);
      const groups = getAllGroups(board);
      
      // Should find one large R group and one B group and one G group
      expect(groups).toHaveLength(3);
      
      const bGroup = groups.find(g => g.includes('1:0'));
      const rGroup = groups.find(g => g.includes('1:1'));
      const gGroup = groups.find(g => g.includes('1:2'));
      
      expect(rGroup).toHaveLength(4); // Connected R cells
      expect(bGroup).toHaveLength(2); // Connected B cells
      expect(gGroup).toHaveLength(1); // Connected G cells
    })

    it('returns empty array for empty board', () => {
      const board = createTestBoard([]);
      const groups = getAllGroups(board);
      expect(groups).toEqual([]);
    });
  });
