import {
  EFFECT_DURATION_MS,
  METRONOME_DURATION_MS,
  TRANSFORM_DURATION_MS,
} from '@game/effects';
import clsx from 'clsx';
import { Fragment } from 'react/jsx-runtime';
import styles from './EffectsOverlay.module.scss';

type EffectsOverlayProps = {
  effects: string[];
};

const sanitizeName = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

const cssVariables: React.CSSProperties = {
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
      className={clsx(styles.effectsOverlay, styles[`effectCount-${effects.length}`])}
      style={cssVariables}
    >
      {effects.map((effect, idx) => {
        return (
          <Fragment key={effect}>
            <div
              className={clsx(
                styles.effectBand,
                styles[`effect-${idx + 1}`],
                styles[sanitizeName(effect)],
              )}
            >
              <div className={styles.stripes}></div>
            </div>
            <div
              className={clsx(
                styles.effectImg,
                styles[`effect-${idx + 1}`],
                styles[sanitizeName(effect)],
              )}
            ></div>
            <div
              className={clsx(
                styles.effectText,
                styles[`effect-${idx + 1}`],
                styles[sanitizeName(effect)],
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
