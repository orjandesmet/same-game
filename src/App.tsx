import { Board } from '@components/Board';
import { EffectsOverlay } from '@components/EffectsOverlay';
import { GameOverScreen } from '@components/GameOverScreen';
import { OptionsForm } from '@components/OptionsForm';
import { ScoreBoard } from '@components/ScoreBoard';
import { SameGame } from '@game';
import type { ColumnIdx, RowIdx } from '@game/board';
import { effectUtils } from '@game/effects';
import { Xorshift32 } from '@game/rng/xorshift32';
import { useGameOptions } from '@hooks/useGameOptions';
import { useGameState } from '@hooks/useGameState';
import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import styles from './App.module.css';
import type { EffectList } from './components/EffectsOverlay';
import { Octicon } from './components/Octicon/Octicon';

const game = new SameGame(new Xorshift32());

function App() {
  const [effects, setEffects] = useState<EffectList>([]);
  const [cssVars, setCssVars] = useState<CSSProperties>({});

  const {
    nrOfColumns,
    nrOfRows,
    partyMembers,
    setNrOfColumns,
    setNrOfRows,
    setPartyMembers,
  } = useGameOptions();
  const { board, gameState, movesLeft, pkmnScores, score, scoreCard } = useGameState(game, partyMembers);

  const handleStart = useCallback(
    (newSeed?: number) => {
      const seed = newSeed || Date.now() % (12 * 60 * 60 * 1000);
      game.startGame(nrOfRows, nrOfColumns, partyMembers, seed);
    },
    [nrOfRows, nrOfColumns, partyMembers]
  );

  const handleCellClick = useCallback(
    (rowIdx: RowIdx, columnIdx: ColumnIdx) => {
      const effects = game.removeGroupForCell(rowIdx, columnIdx);
      setEffects(
        effects
          .filter(effectUtils.isVisibleEffectStage)
          .map(({color, effectName, level, hasM}) => ({color, effectName, level, hasM}))
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
      const startingSeed =
        seedParam && !isNaN(Number(seedParam)) ? Number(seedParam) : undefined;
      if (searchParams.get('pi')) {
        setCssVars({
          '--i-img-r': "url('/pkmn/pi/R.png')",
          '--i-img-b': "url('/pkmn/pi/B.png')",
          '--i-img-g': "url('/pkmn/pi/G.png')",
          '--i-img-y': "url('/pkmn/pi/Y.png')",
          '--i-img-p': "url('/pkmn/pi/P.png')",
          '--i-img-w': "url('/pkmn/pi/W.png')",
          '--i-img-m': "url('/pkmn/pi/M.png')", // TODO: this image does not exist yet
        } as CSSProperties);
      }
      handleStart(startingSeed);
    }
  }, [handleStart]);

  return (
    <div className={styles.appRoot} style={cssVars}>
      <OptionsForm
        nrOfRows={nrOfRows}
        nrOfColumns={nrOfColumns}
        partyMembers={partyMembers}
        onNrOfRowsChange={setNrOfRows}
        onNrOfColumnsChange={setNrOfColumns}
        onPartyMembersChange={setPartyMembers}
        onStartGame={() => handleStart()}
      />
      <Board
        board={board}
        onCellClick={handleCellClick}
        isGameOver={gameState === 'GAME-OVER'}
      >
        <GameOverScreen
          onRestartClick={() => handleStart()}
          score={score}
          pkmnScores={pkmnScores}
          scoreCard={scoreCard}
        />
      </Board>
      <ScoreBoard score={score} movesLeft={movesLeft} seed={game.seed} />
      <EffectsOverlay effects={effects} />
      <div className={styles.githubLink}>
        <Octicon className={styles.githubLogo} />
        <a
          href="https://github.com/orjandesmet/same-game"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}

export default App;
