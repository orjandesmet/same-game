import { SeedIcon } from '@components/SeedIcon';
import { CREATURE_NAMES, creatureUtils } from '@game/creatures';
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
      <ul className={styles['hof-creature-list']}>
        {hofData.creatures.map((creatureData) => (
          <CreatureListItem
            key={creatureData.color}
            creatureData={creatureData}
          />
        ))}
      </ul>
      {hofData.allCleared && <div>All cleared!</div>}
    </li>
  );
}

type CreatureListItemProps = {
  creatureData: ParsedCreatureListItem;
};

function CreatureListItem({ creatureData }: CreatureListItemProps) {
  const evolutionIdx = creatureUtils.getEvolutionIdx(
    creatureData.color,
    creatureData.level
  );

  return (
    <li
      className={clsx(
        styles['hof-creature-list-item'],
        styles[creatureData.color.toLowerCase()]
      )}
    >
      <img
        className={styles['hof-creature-list-image']}
        src={`/creatures/sprites/${creatureData.color}-${evolutionIdx}.png`}
        alt={CREATURE_NAMES[creatureData.color][evolutionIdx]}
      />
      ${creatureData.score}
    </li>
  );
}
