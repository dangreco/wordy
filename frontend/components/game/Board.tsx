import { Button } from "@components/input";
import { AnimatePresence, motion } from "framer-motion";
import isLetter from "is-letter";
import React, { useEffect, useRef, useState } from "react";
import { isMobile } from 'react-device-detect';
import styled from "styled-components";
import { Wordy } from "../../libs/wordy/types";
import Guess from "./Guess";
import { NUM_GUESSES } from "./utils";

interface Props {
  game: Wordy.Game;
  guess(word: string): Promise<boolean>;
  playable?: boolean;
  active?: boolean;
  error?: Wordy.Error;
}

const Board: React.FunctionComponent<Props> = ({ error: gameError, game, guess, playable = true, active = false }) => {
  const [focused, setFocused] = useState(false);
  const [current, setCurrent] = useState("");
  const [error, setError] = useState<Wordy.Error | undefined>(gameError);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const currentIndex = game.guesses.length;

  const makeGuess = async () => {
    const valid= await guess(current);
    setCurrent(valid ? "" : current);
  };


  const onKey: any = (event: KeyboardEvent) => {
    setError(undefined);
    const { key } = event;
    if (key === "Enter") {
      return makeGuess();
    }

    setCurrent((current) => {
      if (key === "Backspace") {
        return current.substring(0, current.length - 1);
      }

      if (/^[A-ZÀ-ÚÄ-Ü]$/i.test(key) && current.length < game.size) {
        return current + key.toLowerCase();
      }

      return current;
    });
  };

  const onMobileChange = (e: any) => {
    setCurrent((current) => {
      const { value } = e.target;

      if (value.length > game.size || !/^[A-ZÀ-ÚÄ-Ü]*$/i.test(value)) {
        return current;
      }

      return value.toLowerCase().replaceAll(" ", "");
    }); 
  };

  const onMobileKey: any = async (e: KeyboardEvent) => {
    e.preventDefault();
    setError(undefined);
    const { key } = e;
    if (key === "Enter") {
      await makeGuess();
    }
  }

  const focus = () => {
    if (isMobile) inputRef.current?.focus();
    setFocused(true);
  };

  const blur = () => {
    if (isMobile) inputRef.current?.blur();
    setFocused(false);
  }

  useEffect(() => {
    if (game.complete) blur();
    if (isMobile && playable) {
      document.getElementById(`guess-${game.guesses.length}`)?.scrollIntoView({ 
        behavior: "smooth",
        block: "center"
      })
    }
  }, [game]);

  useEffect(() => {
    setError(gameError)
  }, [gameError]);

  return (
    <Root
      bordered={!active}
      size={game.size}
      tabIndex={0}
      onFocus={focus}
      onBlur={blur}
      onKeyDown={playable  && !isMobile ? onKey : () => {}}
    >
      <DisableSelect>
        {
          [...Array(NUM_GUESSES[game.difficulty])].map((_, i) => (
            <Guess
              key={`guess-${i}`}
              game={game}
              num={i}
              active={i <= currentIndex || game.complete}
              current={i === game.guesses.length}
              error={error}
              setError={setError}
              guess={
                game.guesses[i] || { guess: i === game.guesses.length ? current : "" }
              }
            />
          ))
        }
        <AnimatePresence>
          {focused || game.complete || !playable ? null : (
            <Curtain
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button>Play</Button>
            </Curtain>
          )}
        </AnimatePresence>
      </DisableSelect>
      {
        game.word ? (
          <>
            <Answer>{game.word}</Answer>
          </>
        ) : null
      }
      <FloatingInput
        ref={inputRef} 
        type="text" 
        value={current}
        onChange={playable && isMobile ? onMobileChange : () => {}}
        onKeyDown={playable && isMobile ? onMobileKey : () => {}}
      />
    </Root>
  );
};

export default Board;

const Root = styled.div<{ size: number, bordered: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--paper);
  ${({ bordered }) => `
    border: ${bordered ? '2px solid var(--ink)' : 'none'};
    padding: ${bordered ? '2rem' : 0 };
  `}

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

const Curtain = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 245, 235, 0.75);

  & > * {
    width: 10rem;
  }
`;

const DisableSelect = styled.div`
  width: 100%;
  position: relative;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const Answer = styled.h1`
  margin-bottom: 0;
`;

const FloatingInput = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  position: absolute;
`