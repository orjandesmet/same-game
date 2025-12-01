import { SeedIcon } from '@components/SeedIcon';
import type { ReplayRecorder, ReplayRecording } from '@game/recorder';

import { ArrowRightIcon } from '@components/ArrowRightIcon';
import { CloseIcon } from '@components/CloseIcon';
import clsx from 'clsx';
import { useCallback } from 'react';
import styles from './ReplayBanner.module.scss';

type ReplayBannerProps = {
  recorder: ReplayRecorder;
  recording: ReplayRecording | null;
  onButtonClick?: () => void;
};
export function ReplayBanner({
  recorder,
  recording,
  onButtonClick,
}: ReplayBannerProps) {
  if (!recording) {
    return null;
  }

  const handleStartReplayClick = useCallback(() => {
    recorder.startReplay(recording);
    onButtonClick?.();
  }, [recorder, recording, onButtonClick]);

  const handleDeleteRecordingClick = useCallback(() => {
    recorder.deleteRecording();
    onButtonClick?.();
  }, [recorder, onButtonClick]);

  return (
    <div className={styles['replay-banner']}>
      Last recorded game: <SeedIcon /> {recording.seed}
      <button
        className={styles.button}
        type="button"
        onClick={handleStartReplayClick}
        title="Start replay"
      >
        <ArrowRightIcon solid />
      </button>
      <button
        className={clsx(styles.button, styles.close)}
        type="button"
        onClick={handleDeleteRecordingClick}
        title="Delete recording"
      >
        <CloseIcon />
      </button>
    </div>
  );
}
