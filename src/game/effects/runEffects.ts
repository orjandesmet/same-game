import type { Board, Group } from '../board';
import type { Effect, EffectTools } from './types';

export async function runEffects(
  effects: Effect[],
  initialBoard: Board,
  group: Group,
  callback: (board: Board) => void,
  effectTools: EffectTools
): Promise<Board> {
  return await effects.reduce((previousPromise, effect) => {
    return previousPromise.then((newBoard) => {
      if (effect.effectName) {
        effectTools._debug(
          'Running effect:',
          effect.effectName,
          'on group',
          group
        );
      }
      const updatedBoard = effect.fn(newBoard, group, effectTools);
      callback(updatedBoard);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(updatedBoard);
        }, effect.duration);
      });
    });
  }, Promise.resolve(initialBoard));
}