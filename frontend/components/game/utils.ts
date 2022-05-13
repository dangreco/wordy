import { Wordy } from "../../libs/wordy/types";

export const NUM_GUESSES: Record<Wordy.Difficulty, number> = {
  [Wordy.Difficulty.EASY]: 6,
  [Wordy.Difficulty.MEDIUM]: 6,
  [Wordy.Difficulty.HARD]: 8,
  [Wordy.Difficulty.INSANE]: 8,
}

const SQUARES = ['⬜', '🟦', '🟩'];

export const hintStates = (hint: number, size: number): number[] => {
  const states = (hint ? hint.toString(3) : "")
    .padStart(size, "0")
    .split("")
    .map((n) => parseInt(n, 10));

  return states;
};

export const emojify = (states: number[]) => {
  return states.map((s) => SQUARES[s]).join(' ');
}

export const generateShare = (game: Wordy.Game) => {
  const {
    size,
    guesses,
    word,
    difficulty,
  } = game;

  const complete = parseInt(''.padEnd(size, '2'), 3);
  const end = guesses.findIndex(({ hint }) => hint === complete);
  const _guesses = end === -1 ? guesses : guesses.slice(0, end + 1);

  const emojisSplit = _guesses.map(
    ({ hint }) => emojify(hintStates(hint, size)) 
  );

  return [
    `${word} - ${emojisSplit.length}/${NUM_GUESSES[difficulty]}`,
    '',
    emojisSplit.join('\n'),
    '',
    `(play at https://wordygame.io)`
  ].join('\n')
}

