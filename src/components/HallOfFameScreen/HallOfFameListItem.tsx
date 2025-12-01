import { SeedIcon } from '@components/SeedIcon';
import clsx from 'clsx';
import styles from './HallOfFameListItem.module.scss';
import type { ParsedCreatureListItem, ParsedListItem } from './types';

type HallOfFameListItemProps = {
  hofData: ParsedListItem;
};

export function HallOfFameListItem({ hofData }: HallOfFameListItemProps) {
  return (
    <li key={hofData.date} className={styles['hof-list-item']}>
      <div>
        ${hofData.score} on {new Date(hofData.date).toDateString()}
      </div>
      <div>
        Game: {hofData.dimensions} - <SeedIcon />
        {hofData.seed}
      </div>
      {hofData.creatures.length > 0 && (
        <ul className={styles['hof-creature-list']}>
          {hofData.creatures.map((creatureData) => (
            <CreatureListItem
              key={creatureData.color}
              creatureData={creatureData}
            />
          ))}
        </ul>
      )}
      {hofData.allCleared && <div>All cleared!</div>}
    </li>
  );
}

type CreatureListItemProps = {
  creatureData: ParsedCreatureListItem;
};

function CreatureListItem({ creatureData }: CreatureListItemProps) {
  return (
    <li
      className={clsx(
        styles['hof-creature-list-item'],
        creatureData.timesUsed > 0 && styles['hof-creature-is-used']
      )}
    >
      <img
        className={styles['hof-creature-list-image']}
        src={`/creatures/sprites/${creatureData.sprite}.png`}
        alt={creatureData.name}
      />
      {creatureData.timesUsed > 1 && (
        <span className={styles['hof-creature-usage']}>
          x{creatureData.timesUsed}
        </span>
      )}
    </li>
  );
}
