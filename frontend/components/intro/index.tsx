import Game from '@components/game';
import Board from '@components/game/Board';
import { Wordy } from '@wordy/types';
import React, { useEffect, useRef, useState } from 'react';

const GUESSES = [
  { guess: 'which', hint: parseInt('20000', 3) },
  { guess: 'wafer', hint: parseInt('20001', 3) },
  { guess: 'worst', hint: parseInt('22200', 3) },
  { guess: 'wordy', hint: parseInt('22222', 3) },
]

const Intro: React.FunctionComponent = ({

}) => {

  const [guesses, setGuesses] = useState<Wordy.Guess[]>([]);
  const interval = useRef<any>();
  const guess = async () => false;
  const complete = guesses.some(({ guess, hint }) => guess === 'wordy' && hint !== undefined);

  const iter = () => {
    
    if (complete) {
      clearInterval(interval.current);
      return;
    }

    setGuesses(
      (fresh) => {
        console.log(fresh)
        let i = fresh.findIndex(
          ({ hint }) => hint === undefined
        );

        i = i === -1 ? fresh.length : i;

        const current = {
          ...(fresh[i] || { guess: '' })
        };

        if (!GUESSES[i]) {
          clearInterval(interval.current);
          return fresh;
        }

        if (current.guess.length < 5) {
          current.guess = GUESSES[i].guess.substring(0, current.guess.length + 1);
        } else {
          current.hint = GUESSES[i].hint;
        }

        return [
          ...fresh.slice(0, i),
          current
        ];
      }
    )
  };

  useEffect(() => {
    interval.current = setInterval(iter, 100);    

    return () => clearInterval(interval.current);
  }, []);

  return (
    <>
      <Board
        playable={false}
        active={true}
        game={{
          id: 'foo',
          createdAt: '',
          updatedAt: '',
          size: 5,
          difficulty: Wordy.Difficulty.EASY,
          complete,
          guesses,
        }}
        guess={guess}
      />
    </>
  );
}

export default Intro;