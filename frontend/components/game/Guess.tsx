import { AnimatePresence, motion } from "framer-motion";
import React, { BlockquoteHTMLAttributes, useMemo } from "react";
import styled from "styled-components";
import { Wordy } from "../../libs/wordy/types";
import { hintStates } from "./utils";

interface Props {
  game: Wordy.Game;
  num: number;
  guess: Wordy.Guess;
  active?: boolean;
  current?: boolean;
  error?: Wordy.Error;
  setError(error: Wordy.Error | undefined): void;
}

const Guess: React.FunctionComponent<Props> = ({
  game,
  num,
  guess: _guess,
  active = false,
  current,
  error,
  setError,
}) => {
  const { guess, hint } = _guess;

  const states = hintStates(hint || 0, game.size);
  const chars = guess.padEnd(game.size, " ").split("");

  const mute = game.complete
    ? num >= game.guesses.length
    : num > game.guesses.length

  return (
    <Root mute={mute} size={game.size} id={`guess-${num}`}>
      {[...Array(game.size)].map((_, i) => (
        <Character error={!!error && !!current} key={`guess-${num}-${i}`} state={states[i]} game={game} active={active}>
          <AnimatePresence>
            {
              chars[i] !== " " ? (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, transition: { duration: 0.1 } }}
                  exit={{ scale: 0, opacity: 0, transition: { duration: 0.1 } }}
                >
                  { chars[i] }
                </motion.div>
              ) : null
            }
          </AnimatePresence>
        </Character>
      ))}
    </Root>
  );
};

export default Guess;

const Root = styled.div<{ mute: boolean, size: number }>`
  width: 100%;
  display: flex;
  flex-direction: row;
  transition: all 0.25s ease-in-out;
  ${({ mute, size }) => `
    opacity: ${mute ? 0.25 : 1.0};


    @media only screen and (max-width: 768px) {
      display: grid;
      grid-template-columns: repeat(${size}, 1fr);
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
  `}
`;

const Character = styled.div<{ state: number, game: Wordy.Game, active: boolean, error: boolean }>`
  width: 4rem;
  aspect-ratio: 1 / 1;
  ${({ active, error }) => `
      border: ${error ? 2 : 1}px ${active ? 'solid' : 'dashed'} ${error ? 'var(--red)' : 'var(--ink)'};
  `}
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5rem;
  font-size: 1.8rem;
  font-weight: bold;
  transition: all 0.25s ease-in-out;

  ${({ state }) => `
    background-color: ${["var(--paper)", "var(--blue)", "var(--green)"][state]};
  `}

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  @media only screen and (max-width: 768px) {
    margin: 0;
    width: 100%;
    ${({ game, active }) => `
      font-size: ${40 / game.size}vw;
    `}
  }
`;
