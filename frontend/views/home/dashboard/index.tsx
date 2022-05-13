import { useUser } from "@wordy/hooks";
import React from "react";
import styled from "styled-components";
import RecentGame from "./RecentGame";

const Dashboard: React.FunctionComponent = () => {
  const { user } = useUser();

  return (
    <Root>
      <Games>
        <h2>{user?.recent ? "current game" : "start a new game"}</h2>
        <RecentGame />
        <h2>previous games</h2>
      </Games>
    </Root>
  );
};

export default Dashboard;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Games = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 60rem;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;
