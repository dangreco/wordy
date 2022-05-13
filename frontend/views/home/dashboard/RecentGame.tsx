import React from "react";
import styled from "styled-components";
import { useUser } from "@wordy/hooks";
import Game from "@components/game";
import Intro from "@components/intro";
import { Button } from "@components/input";
import wordy from "@wordy";
import { Wordy } from "@wordy/types";
import { useUserStore } from "@wordy/store";

const RecentGame: React.FunctionComponent = () => {
  const { user } = useUser();
  const { setUser } = useUserStore();

  const newGame = async () => {
    await wordy.game.create(Wordy.Difficulty.MEDIUM);
    const { error, data } = await wordy.user.me.get();

    if (!error && data) {
      setUser(data);
    }
  };

  return (
    <Root>
      {
        user?.recent ? (
          <Game id={user?.recent}/>
        ): (
          <Onboarding>
            <Intro />
            <PlayNow onClick={newGame}>
              <Button>new game</Button>
            </PlayNow>
          </Onboarding>
        ) 
      }
    </Root>
  );
};

export default RecentGame;

const Root = styled.div`
`;

const Title = styled.h3`
  width: 100%;
  text-align: center;
`;

const PlayNow = styled.div`
  width: 10rem;
  margin-top: 2rem;
`;

const Onboarding = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;