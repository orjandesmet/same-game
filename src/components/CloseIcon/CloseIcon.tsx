import clsx from 'clsx';
import styles from './CloseIcon.module.css';

type CloseIconProps = {
  className?: string;
};

export function CloseIcon({ className }: CloseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      className={clsx(styles['close-icon'], className)}
      viewBox="0 0 8 8"
      aria-hidden="true"
    >
      <rect width="1" height="1" x="2" y="2" fill="currentColor"></rect>
      <rect width="1" height="1" x="2" y="6" fill="currentColor"></rect>
      <rect width="1" height="1" x="3" y="3" fill="currentColor"></rect>
      <rect width="1" height="1" x="3" y="5" fill="currentColor"></rect>
      <rect width="1" height="1" x="4" y="4" fill="currentColor"></rect>
      <rect width="1" height="1" x="5" y="5" fill="currentColor"></rect>
      <rect width="1" height="1" x="5" y="3" fill="currentColor"></rect>
      <rect width="1" height="1" x="6" y="6" fill="currentColor"></rect>
      <rect width="1" height="1" x="6" y="2" fill="currentColor"></rect>
    </svg>
  );
}
