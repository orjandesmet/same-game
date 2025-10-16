const ROWS = 10;
const COLS = 10;

/**
 * @typedef Color
 * @type {'R' | 'G' | 'B' | 'Y'}
 */

/**
 * @type {Color[]}
 */
const COLORS = ['R', 'G', 'B', 'Y'];
const EMPTY = ' ';

/**
 * @typedef Cell
 * @type {Color | ' '}
 */

/**
 * @typedef Board
 * @type {Cell[][]}
 */

/**
 * Create a random board
 * @param {string} seed 
 * @returns {Board}
 */
function createBoard(seed) {
  return Array.from({length: COLS})
    .map(_ => Array.from({length: ROWS})
      .map(_ => COLORS[Math.floor(Math.random() * 4)]));
}

/**
 * Display the board in a readable way.
 * @param {Board} board
 * @returns {void}
 */
function printBoard(board) {
  const flippedBoard = Array.from({length: ROWS})
  .map((_, rowIdx) => Array.from(({length: COLS}))
  .map((_, columnIdx) => board[columnIdx][rowIdx]));
  const boardString = flippedBoard.map((column) => column.join('|')).join('\n');
  console.log(boardString);
}

/**
 * Converts row and column indices to a key
 * @param {number} rowIdx 
 * @param {number} columnIdx 
 * @returns {`${string}:${string}`}
 */
function createGroupKey(rowIdx, columnIdx) {
  return `${rowIdx}:${columnIdx}`
}

/**
 * @typedef Group
 * @type {Array<`${string}:${string}`>}
 */

/**
 * Find all connected cells of the same color (DFS).
 * @param {Board} board 
 * @param {number} rowIdx
 * @param {number} columnIdx 
 * @param {Color} color 
 * @param {Group} visited 
 * @returns {Group} A group of adjacent cells with the same color
 */
function getGroup(board, rowIdx, columnIdx, color, visited) {
  const groupKey = createGroupKey(rowIdx, columnIdx);
  if (visited.includes(groupKey)) {
    return [];
  }
  if (rowIdx >= ROWS || rowIdx < 0 || columnIdx >= COLS || columnIdx < 0) {
    return [];
  }
  if (board[columnIdx][rowIdx] !== color) {
    return [];
  }
  visited.push(groupKey);
  const group = [groupKey]
    .concat(getGroup(board, rowIdx + 1, columnIdx, color, visited))
    .concat(getGroup(board, rowIdx - 1, columnIdx, color, visited))
    .concat(getGroup(board, rowIdx, columnIdx + 1, color, visited))
    .concat(getGroup(board, rowIdx, columnIdx - 1, color, visited))
  ;

  return group;
}

/**
 * Removes the given group and applies gravity
 * @param {Board} board 
 * @param {Group} group 
 * @returns {Board}
 */
function removeGroup(board, group) {
  return board
    .map((column, columnIdx) => column.map((cell, rowIdx) => group.includes(createGroupKey(rowIdx, columnIdx)) ? EMPTY : cell))
    .map((column) => column.toSorted((leftCell) => isEmptyCell(leftCell) ? -1 : 1))
    .toSorted((leftColumn, rightColumn) => isEmptyColumn(leftColumn) ? 1 : isEmptyColumn(rightColumn) ? -1 : 1);
}

/**
 * Checks if a cell is empty
 * @param {Cell} cell 
 * @returns {boolean} 
 */
function isEmptyCell(cell) {
  return cell === EMPTY;
}

/**
 * Checks if a column has no more items in it
 * @param {Cell[]} column
 * @returns {boolean}
 */
function isEmptyColumn(column) {
  return column.every(isEmptyCell);
}

/**
 * Checks if the board has any valid moves left
 * @param {Board} board 
 * @returns {boolean}
 */
function hasMovesLeft(board) {
  return board.some((column, columnIdx) => column.some((cell, rowIdx) => getGroup(board, rowIdx, columnIdx, cell, []).length >= 2));
}

// Begin game
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function loop(board, score) {
  printBoard(board);

  if (!hasMovesLeft(board)) {
    console.log('No more moves, score:', score);
  } else {
    rl.on('line', (inputString) => {
        processNextInput(inputString, board, score);
        rl.close();
    });

    rl.on('close', () => {
        
    });
  }
}

function processNextInput(input, board, score) {
if (!input) {
    console.log('Invalid input')
    loop(board, score);
  }

  const [rowIdx, columnIdx] = input.split(',').map(Number);
  if (rowIdx < 0 || rowIdx >= ROWS || columnIdx < 0 || columnIdx >= ROWS) {
    console.log('Invalid input');
    loop(board, score);
  }

  const group = getGroup(board, rowIdx, columnIdx, board[columnIdx][rowIdx], []);
  if (group.length >= 2) {
    const gained = Math.pow(group.length - 2, 2);
    const updatedBoard = removeGroup(board, group);
    const newScore = score + gained;
    console.log(`Gained ${gained} points, score:`, newScore);
    loop(updatedBoard, newScore);
  }
}

let new_board = createBoard();
let new_score = 0;
loop(new_board, new_score);
// TODO: Try this with rxjs subscriptions