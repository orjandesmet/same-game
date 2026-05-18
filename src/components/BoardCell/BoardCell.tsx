import type { Cell } from '@game/cells';
import type { CSSProperties } from 'react';

import { cellUtils } from '@game/cells';
import { creatureUtils, type Color } from '@game/creatures';
import { clsx } from 'clsx';

import styles from './BoardCell.module.scss';

type CellProps = {
  as?: 'div' | 'button';
  cell: Cell;
  style: CSSProperties;
  onCellClick?: () => void;
  isDisabled?: boolean;
  isColorHidden?: boolean;
};

export function BoardCell({
  as = 'div',
  cell,
  style,
  isDisabled,
  onCellClick,
  isColorHidden = false,
}: CellProps) {
  if (cellUtils.isEmptyCell(cell)) {
    return (
      <div
        key={cell.key}
        className={clsx(styles.cell, styles.empty)}
        style={style}
      ></div>
    );
  }
  const classNames = clsx(
    styles.cell,
    isColorHidden && styles['is-color-hidden'],
    !isColorHidden && cell.hasCreature && styles['with-creature'],
    cell.hasSpecialCreature && styles.m,
    !isColorHidden && styles[cell.color.toLowerCase()],
    !isColorHidden &&
      styles[
        `${cell.color.toLowerCase()}-${creatureUtils.getEvolutionIdx(cell.color as Color, cell.level)}`
      ],
    cell.cellState === 'BURNING' && styles.burning,
    cell.cellState === 'FLOODED' && styles.flooded,
    cell.cellState === 'CUTTING' && styles.cutting,
    cell.cellState === 'SHOCKED' && styles.shocked,
    cell.cellState === 'TRANSFORMING' && styles.transforming
  );

  if (as === 'button') {
    return (
      <button
        type="button"
        className={clsx(classNames, styles.button)}
        style={style}
        disabled={isDisabled}
        onClick={onCellClick}
      ></button>
    );
  }

  return <div className={classNames} style={style} />;
}
