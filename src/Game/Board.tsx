import type { FlatBoard } from './types';

import './Board.css';
import type { CSSProperties } from 'react';

type BoardProps = {
  flatBoard: FlatBoard;
  nrOfColumns: number;
  nrOfRows: number;
  onCellClick: (cell: FlatBoard[number]) => void;
}

export function Board({flatBoard, nrOfColumns, nrOfRows, onCellClick}: BoardProps) {
  
  const boardStyles = {'--i-nr-of-columns': nrOfColumns, '--i-nr-of-rows': nrOfRows} as CSSProperties;

  return (<div className="board" style={boardStyles}>
    {flatBoard.map((cell) => {
      const cellStyles = {'--i-row-idx': cell.rowIdx, '--i-column-idx': cell.columnIdx} as CSSProperties;
      return <button key={cell.key} type="button" className={`cell ${cell.value}`} style={cellStyles} onClick={() => onCellClick(cell)}></button>
})}
  </div>)
}