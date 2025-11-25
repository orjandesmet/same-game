import clsx from 'clsx';
import styles from './ProgressBar.module.scss';

type ProgressBarProps = {
  value: number;
  max: number;
  className?: string;
};

export function ProgressBar({ value, max, className }: ProgressBarProps) {
  return (
    <progress
      className={clsx(styles['progress-bar'], className)}
      value={value}
      max={max}
    />
  );
}
