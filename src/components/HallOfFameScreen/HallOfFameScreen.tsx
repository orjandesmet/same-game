import type { HallOfFameDataList, HallOfFameRecorder } from '@game/recorder';
import { useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './HallOfFameScreen.module.scss';

type HallOfFameScreenProps = {
  dataList: HallOfFameDataList | null;
  recorder: HallOfFameRecorder;
};

export function HallOfFameScreen({
  dataList,
  recorder,
}: HallOfFameScreenProps) {
  const dialog = useRef<HTMLDialogElement | null>(null);

  const handleClear = useCallback(() => {
    recorder.removeHoFData();
    dialog.current?.close();
  }, [recorder]);

  if (!dataList || dataList.length === 0) {
    return null;
  }

  return (
    <>
      {createPortal(
        <dialog ref={dialog} className={styles['hof-dialog']}>
          <form method="dialog">
            <button
              type="button"
              className={styles['clear-button']}
              onClick={handleClear}
            >
              Remove all
            </button>
            <button type="submit">Close</button>
          </form>
        </dialog>,
        document.body
      )}
      <button
        className={styles['hof-button']}
        type="button"
        onClick={() => dialog.current?.showModal()}
      >
        <span className={styles.full}>Hall of Fame</span>
        <span className={styles.short} aria-hidden>
          HoF
        </span>
      </button>
    </>
  );
}
