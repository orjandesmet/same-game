import { useCallback, useState, type ChangeEvent } from 'react';
import { clsx } from 'clsx';
import { clamp } from '../../utils/clamp';
import { COLORS, PKMN_NAMES, type Color } from '../../game';
import './OptionsForm.css';

type OptionsFormProps = {
  nrOfRows: number;
  nrOfColumns: number;
  partyMembers: Color[];
  onNrOfRowsChange: (nrOfRows: number) => void;
  onNrOfColumnsChange: (nrOfColumns: number) => void;
  onPartyMembersChange: (partyMembers: Color[]) => void;
  onStartGame: () => void;
};

export function OptionsForm({partyMembers, onPartyMembersChange, ...props}: OptionsFormProps) {
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

  const handlePartyMemberChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as Color;
    const isChecked = event.target.checked;
    const newParty = partyMembers.filter((partyMember) => partyMember !== value).concat(isChecked ? value : []);

    onPartyMembersChange(newParty);
  }, [partyMembers, onPartyMembersChange]);

  const isDisabled = useCallback((color: Color): boolean => {
    if (partyMembers.length <= 2 && partyMembers.includes(color)) {
      return true;
    }
    if (color === 'W') {
      return partyMembers.includes(color) && partyMembers.filter((c) => c !== 'P').length <= 1;
    }
    if (color === 'P') {
      return partyMembers.includes(color) && partyMembers.filter((c) => c!=='W').length <= 1;
    }
    return partyMembers.includes(color) && partyMembers.filter((c) => c !== 'P' && c!=='W').length <= 1;
  }, [partyMembers]);

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
              <img className="options-arrow" src="/sprites/arrow-solid.svg" aria-hidden /><span>Nr of Rows</span><span>({props.nrOfRows})</span>
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
              <img className="options-arrow" src="/sprites/arrow-solid.svg" aria-hidden /><span>Nr of Columns</span><span>({props.nrOfColumns})</span>
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
              {COLORS.map((color) => (
                <div className="party-member" key={color}>
                  <input
                    id={`chk${color}`}
                    name="fldParty"
                    type="checkbox"
                    value={color}
                    checked={partyMembers.includes(color)}
                    disabled={isDisabled(color)}
                    onChange={handlePartyMemberChange}
                  />
                  <label className="options-label" htmlFor={`chk${color}`}>
                    <img className="options-arrow" src="/sprites/arrow-solid.svg" aria-hidden />
                    <img className="party-image" src={`/sprites/${color}.png`} alt={PKMN_NAMES[color]} />
                    <span className="party-name">{PKMN_NAMES[color]}</span>
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
          <button type="button" onClick={() => setOptionsOpen(false)}>
            Close
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
