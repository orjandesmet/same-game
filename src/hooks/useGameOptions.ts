import type { Color } from '@game/cells';
import { useState } from 'react';

export function useGameOptions() {
  const [colors, setColors] = useState<Color[]>(['R', 'Y', 'W', 'B']);
  const [nrOfColumns, setNrOfColumns] = useState(10);
  const [nrOfRows, setNrOfRows] = useState(10);

    return {
      colors,
      nrOfColumns,
      nrOfRows,
      setColors,
      setNrOfColumns,
      setNrOfRows,
    }
}