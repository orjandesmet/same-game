import clsx from 'clsx';
import styles from './BlockIcon.module.css';

type BlockIconProps = {
  solid?: boolean;
  className?: string;
};

export function BlockIcon({ solid, className }: BlockIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      className={clsx(styles['block-icon'], className)}
      viewBox="0 0 8 8"
      aria-hidden="true"
    >
      <rect width="1" height="7" x="1" y="1" fill="currentColor"></rect>
      <rect width="5" height="1" x="2" y="1" fill="currentColor"></rect>
      <rect width="1" height="7" x="7" y="1" fill="currentColor"></rect>
      <rect width="5" height="1" x="2" y="7" fill="currentColor"></rect>
      {solid && (
        <>
          <rect width="5" height="5" x="2" y="2" fill="currentColor"></rect>
        </>
      )}
    </svg>
  );
}
