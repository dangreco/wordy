import { Wordy } from "@wordy/types";
import React from "react";
import styled from "styled-components";

interface Props {
  difficulty: Wordy.Difficulty;
  setDifficulty(difficulty: Wordy.Difficulty): void;
}

const Difficulty: React.FunctionComponent<Props> = ({
  difficulty,
  setDifficulty,
}) => {

  return (
    <Root>
      <Title>set Difficulty</Title>
      <Modes>
        {
          Object.values(Wordy.Difficulty).map(
            (d) => (
              <Mode key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>
                { d }
              </Mode>
            )
          )
        }
      </Modes>
    </Root>
  );
}

export default Difficulty;

const Root = styled.div`
  margin-top: 1rem;
`;

const Title = styled.p`
  margin: 0;
  margin-bottom: 0.5rem;
  font-weight: 700;
  text-align: center;
`

const Modes = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Mode = styled.p<{ active: boolean }>`
  margin: 0;
  margin: 0 0.5rem;
  transition: all .25s ease-in-out;
  cursor: pointer;
  ${({ active }) => `
    text-decoration: ${active ? 'underline' : 'none'};
    font-weight: ${active ? 700 : 500};
  `}
`;