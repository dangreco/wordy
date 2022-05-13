export const calculateHint = (word: string, guess: string): number => {
  let states = (new Array(word.length)).fill(0);
  let letters = word.split('');
  let guessLetters = guess.split('');

  // Letters that are correct
  for (let i = 0; i < word.length; ++i) {
    const l = letters[i];
    const g = guessLetters[i];

    if (g === ' ') continue;

    if (g === l) {
      states[i] = 2;
      letters[i] = ' ';
      guessLetters[i] = ' ';
    }
  }

  // Letters that are correct
  for (let i = 0; i < word.length; ++i) {
    const g = guessLetters[i];

    if (g === ' ') continue;

    const li = letters.findIndex((l) => l === g);

    if (li === -1) continue;

    states[i] = 1;
    letters[li] = ' ';
    guessLetters[i] = ' ';
  }

  return parseInt(states.join(''), 3);
}