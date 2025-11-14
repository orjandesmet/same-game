import { useCallback, useRef, type ChangeEvent } from 'react';
import { clamp } from '@utils/clamp';
import { CREATURE_NAMES, COLORS, type Color, type PartyMembers, creatureUtils } from '@game/creatures';
import styles from './OptionsForm.module.css';
import { LvlIcon } from '@components/LvlIcon';
import { ArrowRight } from '@components/ArrowRightIcon';
import { BallIcon } from '@components/BallIcon';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

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
  const dialog = useRef<HTMLDialogElement | null>(null);

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
        clamp(1, lvl, 100) * (partyMembersInclude(color) ? 1 : -1);
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
      {createPortal(<dialog
        className={styles.optionsFormDialog}
        ref={dialog}
      >
        <form method="dialog" className={styles.optionsForm} onClick={(e) => e.stopPropagation()}>
          <fieldset className={styles.optionsFieldset}>
            <legend>OPTION</legend>
            <label className={styles.optionsLabel} htmlFor="fldNrOfRows">
              <ArrowRight className={styles.optionsArrow} solid />
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
            <label className={styles.optionsLabel} htmlFor="fldNrOfColumns">
              <ArrowRight className={styles.optionsArrow} solid />
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
            <div className={styles.partyMembers}>
              {COLORS.map((color) => {
                const lvl = Math.abs(partyMembers[color]);
                return (
                  <div className={styles.partyMember} key={color}>
                    <input
                      id={`chk${color}`}
                      name="fldParty"
                      type="checkbox"
                      value={color}
                      checked={partyMembersInclude(color)}
                      disabled={isDisabled(color)}
                      onChange={handlePartyMemberChange}
                    />
                      <ArrowRight
                        className={styles.optionsArrow}
                        solid
                      />
                    <label
                      className={clsx(styles.optionsLabel, styles.party)}
                      htmlFor={`chk${color}`}
                    >
                      <BallIcon
                        solid={partyMembersInclude(color)}
                        aria-hidden
                        />
                      <img
                        className={styles.partyImage}
                        src={`/creatures/sprites/${color}-${creatureUtils.getEvolutionIdx(color, lvl)}.png`}
                        alt={CREATURE_NAMES[color][creatureUtils.getEvolutionIdx(color, lvl)]}
                      />
                      <span className={styles.partyName}>{CREATURE_NAMES[color][creatureUtils.getEvolutionIdx(color, lvl)]}</span>
                    </label>
                    <span className={styles.partyLevel}>
                      <LvlIcon />
                      <input
                        type="number"
                        className={styles.lvlInput}
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
          <button type="submit">
            CLOSE
          </button>
        </form>
      </dialog>, document.body)}
      <div className={styles.optionsFormButtons}>
        <button type="button" onClick={() => props.onStartGame()}>
          NEW GAME
        </button>
        <button type="button" onClick={() => dialog.current?.showModal()}>
          OPTION
        </button>
      </div>
    </>
  );
}
