import { LvlIcon } from '@components/LvlIcon';
import { PKMN_NAMES, type Color, type PartyMembers } from '@game/pkmn';
import type { Seed } from '@game/rng';
import { getEvolutionIdx } from '../../game/pkmn/getEvolutionIdx';

import styles from './DebugBanner.module.css';

type DebugBannerProps = {
  nrOfRows: number;
  nrOfColumns: number;
  partyMembers: PartyMembers;
  seed: Seed;
  onResetClicked: () => void;
};

export function DebugBanner({nrOfColumns, nrOfRows, partyMembers, seed, onResetClicked}: DebugBannerProps) {
  return (<>
    <div>ROWS {nrOfRows}x{nrOfColumns} COLUMNS</div>
    <hr className={styles.hr} />
    <div className={styles.party}>{Object.entries(partyMembers).map(([color, level]) => <span>{PKMN_NAMES[color as Color][getEvolutionIdx(color as Color, level)]} <span><LvlIcon></LvlIcon>{level}</span></span>)}</div>
    <hr className={styles.hr} />
    <div className={styles.seed}><span>🌱</span><span>{seed}</span></div>
    <button type="button" onClick={() => onResetClicked()}>QUIT DEBUGGER</button>
  </>)
}