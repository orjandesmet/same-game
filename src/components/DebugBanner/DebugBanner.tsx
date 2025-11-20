import { LvlIcon } from '@components/LvlIcon';
import {
  CREATURE_NAMES,
  creatureUtils,
  type Color,
  type PartyMembers,
} from '@game/creatures';
import type { Seed } from '@game/rng';

import styles from './DebugBanner.module.css';

type DebugBannerProps = {
  multiplier: number | undefined;
  nrOfRows: number;
  nrOfColumns: number;
  partyMembers: PartyMembers;
  seed: Seed;
  onResetClicked: () => void;
};

export function DebugBanner({
  multiplier,
  nrOfColumns,
  nrOfRows,
  partyMembers,
  seed,
  onResetClicked,
}: DebugBannerProps) {
  return (
    <>
      <div>
        ROWS {nrOfRows}x{nrOfColumns} COLUMNS
      </div>
      <hr className={styles.hr} />
      <div className={styles.party}>
        {Object.entries(partyMembers).map(([color, level]) => (
          <span key={color}>
            {
              CREATURE_NAMES[color as Color][
                creatureUtils.getEvolutionIdx(color as Color, level)
              ]
            }{' '}
            <span>
              <LvlIcon></LvlIcon>
              {level}
            </span>
          </span>
        ))}
      </div>
      <hr className={styles.hr} />
      <div className={styles.seed}>
        <span>🌱</span>
        <span>{seed}</span>
      </div>
      <div>MULTIPLIER: x{multiplier}</div>
      <button type="button" onClick={() => onResetClicked()}>
        QUIT DEBUGGER
      </button>
    </>
  );
}
