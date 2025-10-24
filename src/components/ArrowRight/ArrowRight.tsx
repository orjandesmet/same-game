import styles from './ArrowRight.module.css';
import clsx from 'clsx';

type ArrowRightProps = {
  solid?: boolean;
  className?: string;
};

export function ArrowRight({ solid, className }: ArrowRightProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      className={clsx(styles.arrowRight, className)}
      viewBox="0 0 8 8"
    >
      <rect width="1" height="1" x="2" y="1" fill="hsl(0, 0%, 0%)"></rect>
      <rect width="1" height="1" x="3" y="1" fill="hsl(0, 0%, 0%)"></rect>
      <rect width="1" height="1" x="2" y="2" fill="hsl(0, 0%, 0%)"></rect>
      <rect width="1" height="1" x="4" y="2" fill="hsl(0, 0%, 0%)"></rect>
      <rect width="1" height="1" x="2" y="3" fill="hsl(0, 0%, 0%)"></rect>
      <rect width="1" height="1" x="5" y="3" fill="hsl(0, 0%, 0%)"></rect>
      <rect width="1" height="1" x="2" y="4" fill="hsl(0, 0%, 0%)"></rect>
      <rect width="1" height="1" x="6" y="4" fill="hsl(0, 0%, 0%)"></rect>
      <rect width="1" height="1" x="2" y="5" fill="hsl(0, 0%, 0%)"></rect>
      <rect width="1" height="1" x="5" y="5" fill="hsl(0, 0%, 0%)"></rect>
      <rect width="1" height="1" x="2" y="6" fill="hsl(0, 0%, 0%)"></rect>
      <rect width="1" height="1" x="4" y="6" fill="hsl(0, 0%, 0%)"></rect>
      <rect width="1" height="1" x="2" y="7" fill="hsl(0, 0%, 0%)"></rect>
      <rect width="1" height="1" x="3" y="7" fill="hsl(0, 0%, 0%)"></rect>
      {solid && (
        <>
          <rect width="1" height="1" x="3" y="2" fill="currentColor"></rect>
          <rect width="1" height="1" x="3" y="3" fill="currentColor"></rect>
          <rect width="1" height="1" x="4" y="3" fill="currentColor"></rect>
          <rect width="1" height="1" x="3" y="4" fill="currentColor"></rect>
          <rect width="1" height="1" x="4" y="4" fill="currentColor"></rect>
          <rect width="1" height="1" x="5" y="4" fill="currentColor"></rect>
          <rect width="1" height="1" x="3" y="5" fill="currentColor"></rect>
          <rect width="1" height="1" x="4" y="5" fill="currentColor"></rect>
          <rect width="1" height="1" x="3" y="6" fill="currentColor"></rect>
        </>
      )}
    </svg>
  );
}
