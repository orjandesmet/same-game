import {
  BASE_PKMN_PROBABILITY,
  COLORS,
  type Color,
  type PartyMembers,
} from '@game/pkmn';
import { clamp } from '@utils/clamp';
import { useCallback, useEffect, useState } from 'react';

export function useGameOptions() {
  const [canAccessSettings, setCanAccessSettings] = useState(true);
  const [isPi, setIsPi] = useState(false);
  const [nrOfColumns, setNrOfColumns] = useState(10);
  const [nrOfRows, setNrOfRows] = useState(10);
  const [partyMembers, setPartyMembers] = useState<PartyMembers>(
    buildBasePartyMembers()
  );
  const [seed, setSeed] = useState(newSeed())

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParamSettings = handleSearchParams();
      setIsPi(searchParamSettings.isPi);

      if (searchParamSettings.dimensions) {
        setNrOfColumns(searchParamSettings.dimensions.cols);
        setNrOfRows(searchParamSettings.dimensions.rows);
        setCanAccessSettings(false);
      }

      if (searchParamSettings.party) {
        setPartyMembers(searchParamSettings.party);
        setCanAccessSettings(false);
      }

      if (searchParamSettings.seed && !isNaN(searchParamSettings.seed)) {
        setSeed(searchParamSettings.seed);
        setCanAccessSettings(false);
      }
    }
  }, []);

  const createNewSeed = useCallback(() => {
    setSeed(newSeed());
  }, []);

  return {
    canAccessSettings,
    nrOfColumns,
    nrOfRows,
    partyMembers,
    isPi,
    seed,
    setNrOfColumns,
    setNrOfRows,
    setPartyMembers,
    createNewSeed,
  };
}

const STARTING_COLORS: Color[] = ['R', 'Y', 'W', 'B'];
function buildBasePartyMembers(): PartyMembers {
  const party = structuredClone(BASE_PKMN_PROBABILITY);

  Object.keys(party)
    .filter(isExcludedColor)
    .forEach((color) => {
      party[color] = -BASE_PKMN_PROBABILITY[color];
    });

  return party;
}

function isExcludedColor(color: string): color is Color {
  return (
    COLORS.includes(color as Color) && !STARTING_COLORS.includes(color as Color)
  );
}

function handleSearchParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const isPi = searchParams.has('pi');
  const columns = Number(searchParams.get('columns'));
  const rows = Number(searchParams.get('rows'));
  const dimensions = (columns && rows && !isNaN(columns) && !isNaN(rows)) ? {
    cols: clamp(5, columns, 20), rows: clamp(5, rows, 20)
  } : null;
  const party = handleParty(searchParams.getAll('party'));
  const seed = Number(searchParams.get('seed'));

  return {
    dimensions,
    isPi,
    party,
    seed,
  }
}

function handleParty(partySearchParams: string[]): PartyMembers | null {
  if (partySearchParams?.length > 0) {
    return partySearchParams.reduce((acc, current) => {
      const [color, level] = current.split(':');
      if (COLORS.includes(color as Color) || color === 'M' && level && !isNaN(Number(level))) {
        return {...acc, [color]: clamp(1, Number(level), 100)};
      }
      return acc;
  }, BASE_PKMN_PROBABILITY);
  }
  return null;
}

function newSeed() {
  return Date.now() % (12 * 60 * 60 * 1000)
}