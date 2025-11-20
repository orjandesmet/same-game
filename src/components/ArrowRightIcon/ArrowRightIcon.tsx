import clsx from 'clsx';
import styles from './ArrowRightIcon.module.css';

type ArrowRightIconProps = {
  solid?: boolean;
  className?: string;
};

export function ArrowRight({ solid, className }: ArrowRightIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      className={clsx(styles.arrowRightIcon, className)}
      viewBox="0 0 8 8"
      aria-hidden="true"
    >
      <rect width="1" height="7" x="2" y="1" fill="currentColor"></rect>
      <rect width="1" height="1" x="3" y="1" fill="currentColor"></rect>
      <rect width="1" height="1" x="4" y="2" fill="currentColor"></rect>
      <rect width="1" height="1" x="5" y="3" fill="currentColor"></rect>
      <rect width="1" height="1" x="6" y="4" fill="currentColor"></rect>
      <rect width="1" height="1" x="5" y="5" fill="currentColor"></rect>
      <rect width="1" height="1" x="4" y="6" fill="currentColor"></rect>
      <rect width="1" height="1" x="3" y="7" fill="currentColor"></rect>
      {solid && (
        <>
          <rect width="1" height="5" x="3" y="2" fill="currentColor"></rect>
          <rect width="1" height="3" x="4" y="3" fill="currentColor"></rect>
          <rect width="1" height="1" x="5" y="4" fill="currentColor"></rect>
        </>
      )}
    </svg>
  );
}
