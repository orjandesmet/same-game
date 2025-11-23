import type { Recording } from './types';

export interface Recorder {
  readRecording(): Recording | null;
}
