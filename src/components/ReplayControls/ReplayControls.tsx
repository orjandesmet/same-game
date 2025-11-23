import type { PlayRecorder, ReplayState } from '@game/recorder';

import { ArrowRightIcon } from '@components/ArrowRightIcon';
import { BlockIcon } from '@components/BlockIcon';
import type { Board } from '@game/board';
import { Move } from '../Move/Move';
import styles from './ReplayControls.module.scss';

type ReplayControlsProps = {
  board: Board;
  isDisabled: boolean;
  recorder: PlayRecorder;
  replayState: ReplayState;
};

export function ReplayControls({
  board,
  isDisabled,
  recorder,
  replayState,
}: ReplayControlsProps) {
  return (
    <div className={styles['replay-controls']}>
      <div className={styles['replay-progress-row']}>
        <span>
          Replay ({replayState.currentMoveIndex} /{' '}
          {replayState.recording.moves.length})
        </span>
        <progress
          className={styles.progress}
          value={replayState.currentMoveIndex}
          max={replayState.recording.moves.length}
        />
        <button
          type="button"
          className={styles.button}
          disabled={isDisabled}
          onClick={() => recorder.replayNextMove()}
          title="Play next move"
        >
          <ArrowRightIcon solid />
        </button>
        <button
          type="button"
          className={styles.button}
          disabled={isDisabled}
          onClick={() => recorder.stopReplay()}
          title="Stop replaying"
        >
          <BlockIcon solid />
        </button>
      </div>
      <Move
        className={styles.move}
        board={board}
        cellKey={replayState.recording.moves[replayState.currentMoveIndex]}
      />
    </div>
  );
}
