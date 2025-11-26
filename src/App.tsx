import { Board } from '@components/Board';
import { DebugBanner } from '@components/DebugBanner';
import { EffectsOverlay } from '@components/EffectsOverlay';
import { GameOverScreen } from '@components/GameOverScreen';
import { OptionsForm } from '@components/OptionsForm';
import { ReplayControls } from '@components/ReplayControls';
import { ScoreBoard } from '@components/ScoreBoard';
import { SameGame } from '@game';
import type { ColumnIdx, RowIdx } from '@game/board';
import { effectUtils } from '@game/effects';
import { PlayRecorder, type Recording } from '@game/recorder';
import { Xorshift32 } from '@game/rng/xorshift32';
import { useGameOptions } from '@hooks/useGameOptions';
import { useGameState } from '@hooks/useGameState';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from 'react';
import styles from './App.module.css';
import type { EffectList } from './components/EffectsOverlay';
import { Octicon } from './components/Octicon/Octicon';

const game = new SameGame(new Xorshift32());
const recorder = new PlayRecorder(game);

function App() {
  const [effects, setEffects] = useState<EffectList>([]);
  const [recording, setRecording] = useState<Recording | null>(null);

  const {
    nrOfColumns,
    nrOfRows,
    partyMembers,
    isDebugging,
    isPi,
    isReady,
    seed,
    setNrOfColumns,
    setNrOfRows,
    setPartyMembers,
    createNewSeed,
    resetDebugger,
  } = useGameOptions();
  const { board, gameState, movesLeft, creatureScores, score, scoreCard } =
    useGameState(game, partyMembers);

  const handleCellClick = useCallback(
    (rowIdx: RowIdx, columnIdx: ColumnIdx) => {
      const effects = game.handleCellClick(rowIdx, columnIdx);
      setEffects(
        effects
          .filter(effectUtils.isVisibleEffectStage)
          .map(({ color, effectName, level, hasSpecialCreature }) => ({
            color,
            effectName,
            level,
            hasSpecialCreature,
          }))
      );
      setTimeout(() => {
        setEffects([]);
      }, effectUtils.calculateEffectsDuration(effects));
    },
    []
  );

  useEffect(() => {
    game.enableDebugMode(isDebugging);

    if (isReady) {
      game.startGame({ nrOfRows, nrOfColumns, partyMembers, seed });
    }
  }, [nrOfRows, nrOfColumns, partyMembers, seed, isDebugging, isReady]);

  useEffect(() => {
    const watcher = setRecording;
    recorder.addRecordingChangeListener(watcher);
    return () => {
      recorder.removeRecordingChangeListener(watcher);
    };
  }, []);

  const cssVars = useMemo(() => {
    if (isPi) {
      return {
        '--i-img-r': "url('/creatures/pi/R.png')",
        '--i-img-b': "url('/creatures/pi/B.png')",
        '--i-img-g': "url('/creatures/pi/G.png')",
        '--i-img-y': "url('/creatures/pi/Y.png')",
        '--i-img-p': "url('/creatures/pi/P.png')",
        '--i-img-w': "url('/creatures/pi/W.png')",
        '--i-img-m': "url('/creatures/pi/M.png')",
      } as CSSProperties;
    }
    return {};
  }, [isPi]);

  return (
    <div className={styles['game-root']} style={cssVars}>
      <OptionsForm
        nrOfRows={nrOfRows}
        nrOfColumns={nrOfColumns}
        partyMembers={partyMembers}
        onNrOfRowsChange={setNrOfRows}
        onNrOfColumnsChange={setNrOfColumns}
        onPartyMembersChange={setPartyMembers}
        onStartGame={createNewSeed}
        recording={recording}
        recorder={recorder}
      />
      <Board
        board={board}
        onCellClick={handleCellClick}
        isDisabled={!!recording && !!recorder.replayState}
        isGameOver={gameState === 'GAME-OVER'}
      >
        <GameOverScreen
          onRestartClick={createNewSeed}
          score={score}
          creatureScores={creatureScores}
          scoreCard={scoreCard}
        />
      </Board>
      {recorder.replayState ? (
        <ReplayControls
          board={board}
          isDisabled={gameState === 'PAUSED'}
          recorder={recorder}
          replayState={recorder.replayState}
        />
      ) : (
        <ScoreBoard score={score} movesLeft={movesLeft} seed={game.seed}>
          <div className={styles['github-link']}>
            <Octicon className={styles['github-logo']} />
            <a
              href="https://github.com/orjandesmet/same-game"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </ScoreBoard>
      )}
      <span className={styles['app-version']}>v{__APP_VERSION__}</span>
      {isDebugging && (
        <DebugBanner
          multiplier={scoreCard?.multiplier}
          nrOfRows={nrOfRows}
          nrOfColumns={nrOfColumns}
          partyMembers={partyMembers}
          seed={seed}
          onResetClicked={resetDebugger}
        />
      )}
      <EffectsOverlay effects={effects} />
    </div>
  );
}

export default App;
