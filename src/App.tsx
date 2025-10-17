import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { Board } from './Game/Board'
import { SameGame } from './Game/engine'
import { COLORS, type FlatBoard } from './Game/types'
import { cellUtils } from './Game/cellUtils'
import { Xorshift32 } from './Game/rng/xorshift32'
import { clamp } from './utils/clamp'

const game = new SameGame(new Xorshift32());

function App() {
  const [nrOfRows, setNrOfRows] = useState(10);
  const [nrOfColumns, setNrOfColumns] = useState(10);
  const [nrOfColors, setNrOfColors] = useState(4);
  const [seed, setSeed] = useState(game.seed);
  const [flatBoard, setFlatBoard] = useState(game.board);
  const [movesLeft, setMovesLeft] = useState(game.movesLeft);
  const [score, setScore] = useState(game.score);

  const [optionsOpen, setOptionsOpen] = useState(false);

  const handleStart = useCallback((newSeed?: number) => {
    if (newSeed) {
      setSeed(newSeed);
    }
    game.startGame(nrOfRows, nrOfColumns, nrOfColors, newSeed || seed);
    setFlatBoard(game.board);
    setMovesLeft(game.movesLeft);
    setScore(game.score);
  }, [nrOfRows, nrOfColumns, seed, nrOfColors]);

  const handleCellClick = useCallback((cell: FlatBoard[number]) => {
    const cellKey = cellUtils.createCellKey(cell.rowIdx, cell.columnIdx);
    game.removeGroupForCell(cellKey);
    setFlatBoard(game.board);
    setMovesLeft(game.movesLeft);
    setScore(game.score);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('debug')) {
        game.enableDebugMode();
      }
    }
    handleStart();
  }, [handleStart]);

  const handleNrOfRowsChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setNrOfRows(clamp(5, value, 20));
  }

  const handleNrOfColumnsChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setNrOfColumns(clamp(5, value, 20));
  }

  const handleNrOfColors = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setNrOfColors(clamp(2, value, COLORS.length));
  }

  const handleSeedChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setSeed(value);
  }

  return (
    <div className="game-root">
      <form className={`game-form ${optionsOpen ? 'open' : 'closed'}`}>
        <fieldset className="game-options">
          <legend>Game Options</legend>
          <label htmlFor="fldNrOfRows">Number of Rows ({nrOfRows})</label>
          <input id="fldNrOfRows" type="range" min={5} max={20} value={nrOfRows} onChange={(e) => handleNrOfRowsChange(Number(e.target.value))} />
          <label htmlFor="fldNrOfColumns">Number of Columns ({nrOfColumns})</label>
          <input id="fldNrOfColumns" type="range" min={5} max={20} value={nrOfColumns} onChange={(e) => handleNrOfColumnsChange(Number(e.target.value))} />
          <label htmlFor="fldNrOfColors">Number of Colors ({nrOfColors})</label>
          <input id="fldNrOfColors" type="range" min={2} max={COLORS.length} value={nrOfColors} onChange={(e) => handleNrOfColors(Number(e.target.value))} />
          <label htmlFor="fldSeed">Seed</label>
          <input id="fldSeed" type="number" inputMode="numeric" placeholder='Seed' value={seed} onChange={(e) => handleSeedChange(Number(e.target.value))} />
        </fieldset>
        <button type="button" onClick={() => setOptionsOpen(false)}>Close</button>
      </form>
      <button type="button" onClick={() => setOptionsOpen(true)}>Options...</button>
      <Board flatBoard={flatBoard} nrOfRows={nrOfRows} nrOfColumns={nrOfColumns} onCellClick={handleCellClick} />
      <div>Moves left: {movesLeft}</div>
      <div>Score: {score}</div>
      <button type="button" onClick={() => handleStart(Date.now())}>START NEW GAME</button>
    </div>
  )
}

export default App
