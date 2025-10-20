import { Fragment } from 'react/jsx-runtime';
import './EffectsOverlay.scss';
import clsx from 'clsx';
import {
  EFFECT_DURATION_MS,
  METRONOME_DURATION_MS,
  TRANSFORM_DURATION_MS,
} from '../../game';

type EffectsOverlayProps = {
  effects: string[];
};

const sanitizeName = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

const styles: React.CSSProperties = {
  '--i-effect-duration': `${EFFECT_DURATION_MS}ms`,
  '--i-transform-effect-duration': `${TRANSFORM_DURATION_MS}ms`,
  '--i-metronome-effect-duration': `${METRONOME_DURATION_MS}ms`,
} as React.CSSProperties;

export function EffectsOverlay({ effects }: EffectsOverlayProps) {
  if (effects.length === 0) {
    return null;
  }

  return (
    <div
      className={clsx('animations-overlay', `effect-count-${effects.length}`)}
      style={styles}
    >
      {effects.map((effect, idx) => {
        return (
          <Fragment key={effect}>
            <div
              className={clsx(
                'effect-band',
                `effect-${idx + 1}`,
                sanitizeName(effect)
              )}
            >
              <div className="stripes"></div>
            </div>
            <div
              className={clsx(
                'effect-img',
                `effect-${idx + 1}`,
                sanitizeName(effect)
              )}
            ></div>
            <div
              className={clsx(
                'effect-text',
                `effect-${idx + 1}`,
                sanitizeName(effect)
              )}
            >
              {effect}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
