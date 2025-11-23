import type { Recording } from './types';

export interface Recorder {
  watchRecordingChange(callback: (recording: Recording | null) => void): void;
  disposeWatcher(callback: (recording: Recording | null) => void): void;
}
