import styles from './LvlIcon.module.css';

export function LvlIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      className={styles.lvlIcon}
      viewBox="0 0 8 8"
      aria-hidden="true"
    >
      <rect width="1" height="1" x="1" y="4" fill="currentColor"></rect>
      <rect width="1" height="1" x="1" y="6" fill="currentColor"></rect>
      <rect width="2" height="5" x="3" y="3" fill="currentColor"></rect>
      <rect width="2" height="1" x="5" y="7" fill="currentColor"></rect>
    </svg>
  );
}
