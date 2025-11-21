import { buildBasePartyMembers } from '@game';
import { COLORS, type Color, type PartyMembers } from '@game/creatures';
import type { Seed } from '@game/rng';
import { clamp } from '@utils/clamp';
import { useCallback, useEffect, useState } from 'react';

const BASE_NR_OF_COLUMNS = 10;
const BASE_NR_OF_ROWS = 10;

export function useGameOptions() {
  const [canAccessSettings, setCanAccessSettings] = useState(true);
  const [isDebugging, setIsDebugging] = useState(false);
  const [isPi, setIsPi] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [nrOfColumns, setNrOfColumns] = useState(BASE_NR_OF_COLUMNS);
  const [nrOfRows, setNrOfRows] = useState(BASE_NR_OF_ROWS);
  const [partyMembers, setPartyMembers] = useState<PartyMembers>(
    buildBasePartyMembers()
  );
  const [seed, setSeed] = useState<Seed>(newSeed());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParamSettings = handleSearchParams();
      setIsPi(searchParamSettings.isPi);

      if (searchParamSettings.dimensions) {
        setNrOfColumns(searchParamSettings.dimensions.cols);
        setNrOfRows(searchParamSettings.dimensions.rows);
      }

      if (searchParamSettings.party) {
        setPartyMembers(searchParamSettings.party);
      }

      if (searchParamSettings.seed && !isNaN(searchParamSettings.seed)) {
        setSeed(searchParamSettings.seed);
      }

      if (searchParamSettings.debug) {
        setIsDebugging(true);
      }
    }
    setIsReady(true);
  }, []);

  const resetDebugger = useCallback(() => {
    setCanAccessSettings(true);
    setIsDebugging(false);
    setNrOfColumns(BASE_NR_OF_COLUMNS);
    setNrOfRows(BASE_NR_OF_ROWS);
    setPartyMembers(buildBasePartyMembers());
    setSeed(newSeed());
    if (isPi) {
      window.location.search = '?pi=true';
    } else {
      window.location.search = '';
    }
  }, [isPi]);

  const createNewSeed = useCallback(() => {
    if (isDebugging) {
      resetDebugger();
    } else {
      setSeed(newSeed());
    }
  }, [isDebugging, resetDebugger]);

  return {
    canAccessSettings,
    nrOfColumns,
    nrOfRows,
    partyMembers,
    isDebugging,
    isPi,
    isReady,
    seed,
    setNrOfColumns,
    setNrOfRows,
    setPartyMembers,
    createNewSeed,
    resetDebugger,
  };
}

function handleSearchParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const isPi = searchParams.has('pi');
  const columns = Number(searchParams.get('columns'));
  const rows = Number(searchParams.get('rows'));
  const dimensions =
    columns && rows && !isNaN(columns) && !isNaN(rows)
      ? {
          cols: clamp(5, columns, 20),
          rows: clamp(5, rows, 20),
        }
      : null;
  const party = handleParty(searchParams.getAll('party'));
  const seed = Number(searchParams.get('seed'));
  const debug = searchParams.has('debug');

  return {
    debug,
    dimensions,
    isPi,
    party,
    seed,
  };
}

function handleParty(partySearchParams: string[]): PartyMembers | null {
  const startingParty = buildBasePartyMembers();
  if (partySearchParams?.length > 0) {
    return partySearchParams.reduce((acc, current) => {
      const [color, level] = current.split(':');
      const levelNr = Number(level);
      if (
        COLORS.includes(color as Color) ||
        (color === 'M' && level && !isNaN(levelNr))
      ) {
        const realLevel = clamp(color === 'M' ? 0.25 : 1, levelNr, 100);
        return {
          ...acc,
          [color]: realLevel * (levelNr < 0 ? -1 : 1),
        };
      }
      return acc;
    }, startingParty);
  }
  return null;
}

function newSeed() {
  return Date.now() % (12 * 60 * 60 * 1000);
}
