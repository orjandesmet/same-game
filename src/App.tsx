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
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import styles from './App.module.css';
import type { EffectList } from './components/EffectsOverlay';
import { Octicon } from './components/Octicon/Octicon';
import { DebugBanner } from '@components/DebugBanner';

const game = new SameGame(new Xorshift32());

function App() {
  const [effects, setEffects] = useState<EffectList>([]);

  const {
    canAccessSettings,
    nrOfColumns,
    nrOfRows,
    partyMembers,
    isDebugging,
    isPi,
    seed,
    setNrOfColumns,
    setNrOfRows,
    setPartyMembers,
    createNewSeed,
    resetDebugger,
  } = useGameOptions();
  const { board, gameState, movesLeft, pkmnScores, score, scoreCard } = useGameState(game, partyMembers);

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
    game.enableDebugMode(!canAccessSettings);
    game.startGame(nrOfRows, nrOfColumns, partyMembers, seed);
  }, [nrOfRows, nrOfColumns, partyMembers, seed, canAccessSettings]);

  const cssVars = useMemo(() => {
    if (isPi) {
      return {
          '--i-img-r': "url('/pkmn/pi/R.png')",
          '--i-img-b': "url('/pkmn/pi/B.png')",
          '--i-img-g': "url('/pkmn/pi/G.png')",
          '--i-img-y': "url('/pkmn/pi/Y.png')",
          '--i-img-p': "url('/pkmn/pi/P.png')",
          '--i-img-w': "url('/pkmn/pi/W.png')",
          '--i-img-m': "url('/pkmn/pi/M.png')",
        } as CSSProperties
    }
    return {};
  }, [isPi]);

  return (
    <div className={styles.appRoot} style={cssVars}>
      {canAccessSettings && (<OptionsForm
        nrOfRows={nrOfRows}
        nrOfColumns={nrOfColumns}
        partyMembers={partyMembers}
        onNrOfRowsChange={setNrOfRows}
        onNrOfColumnsChange={setNrOfColumns}
        onPartyMembersChange={setPartyMembers}
        onStartGame={createNewSeed}
      />)}
      <Board
        board={board}
        onCellClick={handleCellClick}
        isGameOver={gameState === 'GAME-OVER'}
      >
        <GameOverScreen
          onRestartClick={createNewSeed}
          score={score}
          pkmnScores={pkmnScores}
          scoreCard={scoreCard}
        />
      </Board>
      <ScoreBoard score={score} movesLeft={movesLeft} seed={game.seed} />
       {isDebugging && (<DebugBanner nrOfRows={nrOfRows} nrOfColumns={nrOfColumns} partyMembers={partyMembers} seed={seed} onResetClicked={resetDebugger} />)}
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
