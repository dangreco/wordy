import wordy from "@wordy";
import styled from "styled-components";
import { useGame } from "@wordy/hooks";
import React, { useEffect, useState } from "react";
import Board from "./Board";
import { Button, Difficulty } from "@components/input";
import { AnimatePresence, motion } from "framer-motion";
import { Wordy } from "@wordy/types";

interface Props {
  id?: string;
  game?: Wordy.Game;
}

const Game: React.FunctionComponent<Props> = ({ 
  id,
}) => {
  const [gameId, setGameId] = useState(id);
  const { game, guess, share, loading, error } = useGame(gameId);
  const [difficulty, setDifficulty] = useState(game?.difficulty || Wordy.Difficulty.MEDIUM);

  const newGame = async () => {
    const { error, data } = await wordy.game.create(difficulty);

    if (!error && data) setGameId(data.id);
  }

  useEffect(() => {
    setDifficulty(game?.difficulty || Wordy.Difficulty.MEDIUM);
  }, [game]);

  return (
    <Root>
      <AnimatePresence>
        {
          id && game && game.complete ? (
            <Stats
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Buttons>
                <Button invert onClick={share}>
                  share
                </Button>
                <Button onClick={newGame}>
                  new game
                </Button>
              </Buttons>
              <Difficulty difficulty={difficulty} setDifficulty={setDifficulty} />
            </Stats>
          ) : null
        }
      </AnimatePresence>
      <GameContainer>
        {game ? <Board active={true} game={game} guess={guess} error={error}/> : null}
      </GameContainer>
    </Root>
  );
};

export default Game;

const Root = styled.div`
  position: relative;
`;

const GameContainer = styled.div`
  position: relative;
`;

const Stats = styled(motion.div)`
  position: absolute;
  width: 100%;
  padding: 1rem 0;
  top: 100%;
  background-color: var(--paper);
`;

const Buttons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1rem;
`;