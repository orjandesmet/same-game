import styles from './BallIcon.module.css';
import clsx from 'clsx';

type BallIconProps = {
  solid?: boolean;
  className?: string;
};

export function BallIcon({ solid, className }: BallIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      className={clsx(styles.ballIcon, solid && styles.solid, className)}
      viewBox="0 0 8 8"
      aria-hidden="true"
    >
      <rect width="3" height="1" x="3" y="1" fill="currentColor"></rect>
      <rect width="1" height="1" x="2" y="2" fill="currentColor"></rect>
      <rect width="1" height="1" x="6" y="2" fill="currentColor"></rect>
      <rect width="1" height="3" x="1" y="3" fill="currentColor"></rect>
      <rect width="1" height="3" x="7" y="3" fill="currentColor"></rect>
      <rect width="1" height="1" x="2" y="6" fill="currentColor"></rect>
      <rect width="1" height="1" x="6" y="6" fill="currentColor"></rect>
      <rect width="3" height="1" x="3" y="7" fill="currentColor"></rect>
      {solid && (<>
        <rect width="1" height="1" x="3" y="2" fill="hsl(30, 100%, 40%)"></rect>
        <rect width="1" height="1" x="4" y="2" fill="hsl(30, 100%, 40%)"></rect>
        <rect width="1" height="1" x="5" y="2" fill="hsl(30, 100%, 40%)"></rect>
        <rect width="1" height="1" x="2" y="3" fill="hsl(30, 100%, 40%)"></rect>
        <rect width="1" height="1" x="3" y="3" fill="hsl(39, 100%, 89%)"></rect>
        <rect width="1" height="1" x="4" y="3" fill="hsl(30, 100%, 40%)"></rect>
        <rect width="1" height="1" x="5" y="3" fill="hsl(30, 100%, 40%)"></rect>
        <rect width="1" height="1" x="6" y="3" fill="hsl(30, 100%, 40%)"></rect>
        <rect width="1" height="1" x="2" y="4" fill="hsl(30, 100%, 40%)"></rect>
        <rect width="1" height="1" x="3" y="4" fill="hsl(30, 100%, 40%)"></rect>
        <rect width="1" height="1" x="4" y="4" fill="hsl(30, 100%, 40%)"></rect>
        <rect width="1" height="1" x="5" y="4" fill="hsl(30, 100%, 40%)"></rect>
        <rect width="1" height="1" x="6" y="4" fill="hsl(30, 100%, 40%)"></rect>
        <rect width="1" height="1" x="2" y="5" fill="hsl(39, 100%, 89%)"></rect>
        <rect width="1" height="1" x="3" y="5" fill="hsl(39, 100%, 89%)"></rect>
        <rect width="1" height="1" x="4" y="5" fill="hsl(39, 100%, 89%)"></rect>
        <rect width="1" height="1" x="5" y="5" fill="hsl(39, 100%, 89%)"></rect>
        <rect width="1" height="1" x="6" y="5" fill="hsl(39, 100%, 89%)"></rect>
        <rect width="1" height="1" x="3" y="6" fill="hsl(39, 100%, 89%)"></rect>
        <rect width="1" height="1" x="4" y="6" fill="hsl(39, 100%, 89%)"></rect>
        <rect width="1" height="1" x="5" y="6" fill="hsl(39, 100%, 89%)"></rect>
      </>)}
    </svg >
  );
}