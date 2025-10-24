import { Board } from './components/Board';
import { EffectsOverlay } from './components/EffectsOverlay';
import { OptionsForm } from './components/OptionsForm';
import { ScoreBoard } from './components/ScoreBoard';
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import './App.css';
import { effectUtils } from './game/effects';
import { ALL_CLEARED_BONUS, calculatePkmnScore, calculateScore, PKMN_NAMES, SameGame, type Color, type ColumnIdx, type GameState, type GameStatus, type RowIdx, type ScoreCard } from './game';
import { Xorshift32 } from './game/rng/xorshift32';

const game = new SameGame(new Xorshift32());

function App() {
  const [nrOfRows, setNrOfRows] = useState(10);
  const [nrOfColumns, setNrOfColumns] = useState(10);
  const [colors, setColors] = useState<Color[]>(['R', 'Y', 'W', 'B']);
  const [board, setBoard] = useState(game.board);
  const [movesLeft, setMovesLeft] = useState(game.movesLeft);
  const [scoreCard, setScoreCard] = useState<Partial<ScoreCard>>({});
  const [gameState, setGameState] = useState<GameStatus>('NOT-STARTED');
  const [effects, setEffects] = useState<string[]>([]);
  const [styles, setStyles] = useState<CSSProperties>({});

  const score = useMemo(() => calculateScore(scoreCard), [scoreCard]);

  const handleStart = useCallback(
    (newSeed?: number) => {
      const seed = newSeed || (Date.now() % (12 * 60 * 60 * 1000));
      game.startGame(nrOfRows, nrOfColumns, colors, seed);
    },
    [nrOfRows, nrOfColumns, colors]
  );

  const handleCellClick = useCallback(
    (rowIdx: RowIdx, columnIdx: ColumnIdx) => {
      const effects = game.removeGroupForCell(rowIdx, columnIdx);
      setEffects(
        effects
          .map((stage) => stage.effectName)
          .filter((effectName): effectName is string => !!effectName)
      );
      setTimeout(() => {
        setEffects([]);
      }, effectUtils.calculateEffectsDuration(effects));
    },
    []
  );

  const handleStateChange = useCallback((gameState: GameState) => {
    setBoard(gameState.board);
    setMovesLeft(gameState.movesLeft);
    setScoreCard(gameState.scoreCard);
    setGameState(gameState.gameState);
  }, []);

  useEffect(() => {
    game.addStateChangeListener(handleStateChange);

    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('debug')) {
        game.enableDebugMode();
      }
      const seedParam = searchParams.get('seed');
      const startingSeed = seedParam && !isNaN(Number(seedParam)) ? Number(seedParam) : undefined;
      console.log(startingSeed);
      if (searchParams.get('pi')) {
        setStyles({
          '--i-img-r': "url('/pi/R.png')",
          '--i-img-b': "url('/pi/B.png')",
          '--i-img-g': "url('/pi/G.png')",
          '--i-img-y': "url('/pi/Y.png')",
          '--i-img-p': "url('/pi/P.png')",
          '--i-img-w': "url('/pi/W.png')",
        } as CSSProperties);
      }
      handleStart(startingSeed);
    }

    return () => {
      game.removeStateChangeListener(handleStateChange);
    };
  }, [handleStart, handleStateChange]);

  return (
    <div className="game-root" style={styles}>
      <OptionsForm
        nrOfRows={nrOfRows}
        nrOfColumns={nrOfColumns}
        partyMembers={colors}
        onNrOfRowsChange={setNrOfRows}
        onNrOfColumnsChange={setNrOfColumns}
        onPartyMembersChange={setColors}
        onStartGame={() => handleStart()}
      />
      <Board board={board} onCellClick={handleCellClick} isGameOver={gameState === 'GAME-OVER'}>
        <h2>BLACKED OUT</h2>
        <span>Cells removed: {scoreCard.cellsRemoved ?? 0}</span>
        {scoreCard.multiplier && scoreCard.multiplier !== 1 && <span>Multiplier: x{scoreCard.multiplier ?? 1}</span>}
        {!!scoreCard.pkmn?.length && (<>
          <span>POKéMON used:</span>
          {calculatePkmnScore(scoreCard.pkmn ?? []).map(({color, score}) => (<span>{PKMN_NAMES[color]}: {score}</span>))}
        </>)}
        {scoreCard.allCleared && <span>All cleared bonus: {ALL_CLEARED_BONUS}</span>}
        <hr />
        <span>Final score: {score}</span>
        <button className="restart-button" type="button" onClick={() => handleStart()}>START NEW GAME</button>
      </Board>
      <ScoreBoard score={score} movesLeft={movesLeft} seed={game.seed} />
      <EffectsOverlay effects={effects} />
    </div>
  );
}

export default App;
