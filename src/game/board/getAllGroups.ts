import { cellUtils } from '../cells';
import { flattenBoard } from './flattenBoard';
import { getGroup } from './getGroup';
import type { Board, Group } from './types';

export function getAllGroups(board: Board): Group[] {
  return flattenBoard(board)
    .filter((cell) => !cellUtils.isEmptyCell(cell))
    .reduce<Group[]>((all, cell) => {
      const visited = all.flat();
      const groupForCell = getGroup(
        board,
        cell.rowIdx,
        cell.columnIdx,
        cell.color,
        visited
      );
      return [...all, groupForCell];
    }, [])
    .filter((group) => group.length > 0);
}