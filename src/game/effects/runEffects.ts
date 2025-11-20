import type { Board, Group } from '../board';
import type { Effect, EffectTools } from './types';

type CallBackFn = (board: Board) => void;

export function runEffects(
  effects: Effect[],
  initialBoard: Board,
  group: Group,
  callback: CallBackFn,
  effectTools: EffectTools
): Promise<Board> {
  const effectReducer = runEffect(group, callback, effectTools);
  return effects.reduce(effectReducer, Promise.resolve(initialBoard));
}

function runEffect(
  group: Group,
  callback: CallBackFn,
  effectTools: EffectTools
) {
  return async (
    boardPromise: Promise<Board>,
    effect: Effect
  ): Promise<Board> => {
    const board = await boardPromise;
    if (effect.effectName) {
      effectTools._debug(
        'Running effect:',
        effect.effectName,
        'on group',
        group
      );
    }
    const updatedBoard = effect.fn(board, group, effectTools);
    callback(updatedBoard);
    await timeout(effect.duration);
    return updatedBoard;
  };
}

function timeout(duration: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, duration);
  });
}
