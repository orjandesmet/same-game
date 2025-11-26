import type { Recording } from './types';

export interface Recorder {
  addRecordingChangeListener(
    callback: (recording: Recording | null) => void
  ): void;
  removeRecordingChangeListener(
    callback: (recording: Recording | null) => void
  ): void;
}
