import { Board } from '@components/Board';
import { EffectsOverlay } from '@components/EffectsOverlay';
import { OptionsForm } from '@components/OptionsForm';
import { ScoreBoard } from '@components/ScoreBoard';
import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import './App.css';
import { effectUtils } from '@game/effects';
import { Xorshift32 } from '@game/rng/xorshift32';
import { SameGame } from '@game';
import type { ColumnIdx, RowIdx } from '@game/board';
import { useGameState } from '@hooks/useGameState';
import { useGameOptions } from '@hooks/useGameOptions';
import { GameOverScreen } from '@components/GameOverScreen';

const game = new SameGame(new Xorshift32());

function App() {
  const [effects, setEffects] = useState<string[]>([]);
  const [styles, setStyles] = useState<CSSProperties>({});

  const {board, gameState, movesLeft, score, scoreCard} = useGameState(game);
  const {nrOfColumns, nrOfRows, partyMembers, setNrOfColumns, setNrOfRows, setPartyMembers} = useGameOptions();

  const handleStart = useCallback(
    (newSeed?: number) => {
      const seed = newSeed || (Date.now() % (12 * 60 * 60 * 1000));
      game.startGame(nrOfRows, nrOfColumns, partyMembers, seed);
    },
    [nrOfRows, nrOfColumns, partyMembers]
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('debug')) {
        game.enableDebugMode();
      }
      const seedParam = searchParams.get('seed');
      const startingSeed = seedParam && !isNaN(Number(seedParam)) ? Number(seedParam) : undefined;
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
  }, [handleStart]);

  return (
    <div className="game-root" style={styles}>
      <OptionsForm
        nrOfRows={nrOfRows}
        nrOfColumns={nrOfColumns}
        partyMembers={partyMembers}
        onNrOfRowsChange={setNrOfRows}
        onNrOfColumnsChange={setNrOfColumns}
        onPartyMembersChange={setPartyMembers}
        onStartGame={() => handleStart()}
      />
      <Board board={board} onCellClick={handleCellClick} isGameOver={gameState === 'GAME-OVER'}>
        <GameOverScreen onRestartClick={() => handleStart()} score={score} scoreCard={scoreCard} />
      </Board>
      <ScoreBoard score={score} movesLeft={movesLeft} seed={game.seed} />
      <EffectsOverlay effects={effects} />
    </div>
  );
}

export default App;
