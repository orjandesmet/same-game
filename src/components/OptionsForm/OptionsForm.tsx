import { useCallback, useState, type ChangeEvent } from 'react';
import { clsx } from 'clsx';
import { clamp } from '@utils/clamp';
import { COLORS, type Color, type PartyMembers } from '@game/cells';
import './OptionsForm.css';
import { PKMN_NAMES } from '@game';
import { LvlIcon } from '@components/LvlIcon';
import { ArrowRight } from '@components/ArrowRight';

type OptionsFormProps = {
  nrOfRows: number;
  nrOfColumns: number;
  partyMembers: PartyMembers;
  onNrOfRowsChange: (nrOfRows: number) => void;
  onNrOfColumnsChange: (nrOfColumns: number) => void;
  onPartyMembersChange: (partyMembers: PartyMembers) => void;
  onStartGame: () => void;
};

export function OptionsForm({
  partyMembers,
  onPartyMembersChange,
  ...props
}: OptionsFormProps) {
  const [optionsOpen, setOptionsOpen] = useState(false);

  const handleNrOfRowsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (isNaN(value)) {
      return;
    }
    props.onNrOfRowsChange(clamp(5, value, 20));
  };

  const handleNrOfColumnsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (isNaN(value)) {
      return;
    }
    props.onNrOfColumnsChange(clamp(5, value, 20));
  };

  const partyMembersInclude = useCallback(
    (color: Color) => !!partyMembers[color] && partyMembers[color] > 0,
    [partyMembers]
  );

  const handlePartyMemberChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const color = event.target.value as Color;
      const isChecked = event.target.checked;
      const newValue = Math.abs(partyMembers[color]) * (isChecked ? 1 : -1);

      const newParty = structuredClone(partyMembers);
      newParty[color] = newValue;

      onPartyMembersChange(newParty);
    },
    [partyMembers, onPartyMembersChange]
  );

  const handlePartyMemberLevelChange = useCallback(
    (color: Color, lvl: number) => {
      if (isNaN(lvl)) {
        return;
      }
      const newValue =
        (clamp(1, lvl, 100) / 100) * (partyMembersInclude(color) ? 1 : -1);
      const newParty = structuredClone(partyMembers);
      newParty[color] = newValue;

      onPartyMembersChange(newParty);
    },
    [partyMembers, onPartyMembersChange, partyMembersInclude]
  );

  const isDisabled = useCallback(
    (color: Color): boolean => {
      if (
        Object.entries(partyMembers).filter(([, level]) => level > 0).length <=
          2 &&
        partyMembersInclude(color)
      ) {
        return true;
      }
      if (color === 'W') {
        return (
          partyMembersInclude(color) &&
          Object.entries(partyMembers).filter(([c, l]) => c !== 'P' && l > 0)
            .length <= 1
        );
      }
      if (color === 'P') {
        return (
          partyMembersInclude(color) &&
          Object.entries(partyMembers).filter(([c, l]) => c !== 'W' && l > 0)
            .length <= 1
        );
      }
      return (
        partyMembersInclude(color) &&
        Object.entries(partyMembers).filter(
          ([c, l]) => c !== 'P' && c !== 'W' && l > 0
        ).length <= 1
      );
    },
    [partyMembers, partyMembersInclude]
  );

  return (
    <>
      <div
        className={clsx('options-form-backdrop', optionsOpen && 'open')}
        onClick={() => setOptionsOpen(false)}
      >
        <div className="options-form" onClick={(e) => e.stopPropagation()}>
          <fieldset className="options-fieldset">
            <legend>OPTION</legend>
            <label className="options-label" htmlFor="fldNrOfRows">
              <ArrowRight className="options-arrow" solid aria-hidden />
              <span>Nr of Rows</span>
              <span>({props.nrOfRows})</span>
            </label>
            <input
              id="fldNrOfRows"
              type="range"
              min={5}
              max={20}
              value={props.nrOfRows}
              onChange={handleNrOfRowsChange}
            />
            <label className="options-label" htmlFor="fldNrOfColumns">
              <ArrowRight className="options-arrow" solid aria-hidden />
              <span>Nr of Columns</span>
              <span>({props.nrOfColumns})</span>
            </label>
            <input
              id="fldNrOfColumns"
              type="range"
              min={5}
              max={20}
              value={props.nrOfColumns}
              onChange={handleNrOfColumnsChange}
            />
          </fieldset>
          <fieldset>
            <legend>POKéMON (minimum: 2)</legend>
            <div className="party-members">
              {COLORS.map((color) => {
                const lvl = Math.round(Math.abs(partyMembers[color]) * 100);
                return (
                  <div className="party-member" key={color}>
                    <input
                      id={`chk${color}`}
                      name="fldParty"
                      type="checkbox"
                      value={color}
                      checked={partyMembersInclude(color)}
                      disabled={isDisabled(color)}
                      onChange={handlePartyMemberChange}
                    />
                    <label
                      className="options-label options-label--party"
                      htmlFor={`chk${color}`}
                    >
                      <ArrowRight
                        className="options-arrow---"
                        solid={partyMembersInclude(color)}
                        aria-hidden
                      />
                      <img
                        className="party-image"
                        src={`/sprites/${color}.png`}
                        alt={PKMN_NAMES[color]}
                      />
                      <span className="party-name">{PKMN_NAMES[color]}</span>
                    </label>
                    <span className="party-level">
                      <LvlIcon />
                      <input
                        type="number"
                        className="lvl-input"
                        inputMode="numeric"
                        value={lvl}
                        onChange={(e) =>
                          handlePartyMemberLevelChange(
                            color,
                            Number(e.target.value)
                          )
                        }
                      />
                    </span>
                  </div>
                );
              })}
            </div>
          </fieldset>
          <button type="button" onClick={() => setOptionsOpen(false)}>
            CLOSE
          </button>
        </div>
      </div>
      <div className="options-form-buttons">
        <button type="button" onClick={() => props.onStartGame()}>
          NEW GAME
        </button>
        <button type="button" onClick={() => setOptionsOpen(true)}>
          OPTION
        </button>
      </div>
    </>
  );
}
