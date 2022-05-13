import { Wordy } from "@wordy/types";
import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";

interface Props {
  language: string;
  stats: Wordy.Language;
  progress: Wordy.Progress;
}

const Progress: React.FunctionComponent<Props> = ({
  language,
  stats,
  progress,
}) => {

  const totalCorrect = Object.values(progress).reduce((acc, { correct }) => acc + correct, 0);
  const totalInorrect = Object.values(progress).reduce((acc, { incorrect }) => acc + incorrect, 0);
  const complete = totalCorrect + totalInorrect;
  
  return (
    <Root
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <Header>
        <Title>{ language }</Title>
        <Percent>{complete} / {stats.total} ({ ((complete / stats.total) * 100).toFixed(2) }%)</Percent>
      </Header>
      <Stats>
        <tr>
          <th></th>
          <th>correct</th>
          <th>incorrect</th>
          <th>remaining</th>
          <th>rate</th>
        </tr>
        {
          Object.entries(progress).map(
            ([difficulty, { correct, incorrect }]) => (
              <tr key={`${language}-${difficulty}`}>
                <td><Difficulty>{ difficulty }</Difficulty></td>
                <td style={{ textAlign: 'center'}}><Stat>{ correct }</Stat></td>
                <td style={{ textAlign: 'center'}}><Stat>{ incorrect }</Stat></td>
                <td style={{ textAlign: 'center'}}><Stat>{ stats.counts[difficulty as Wordy.Difficulty] - (incorrect + correct)}</Stat></td>
                <td style={{ textAlign: 'center'}}><Stat>{ (incorrect === 0 ? 0 : (correct / incorrect)).toFixed(1) }</Stat></td>
              </tr>
            )
          )
        }
        <tr>
          <DividerContainer colSpan={5}>
            <Divider />
          </DividerContainer>
        </tr>
        <tr>
          <td><Difficulty>total</Difficulty></td>
          <td style={{ textAlign: 'center'}}><Stat>{ totalCorrect }</Stat></td>
          <td style={{ textAlign: 'center'}}><Stat>{ totalInorrect }</Stat></td>
          <td style={{ textAlign: 'center'}}><Stat>{ stats.total }</Stat></td>
          <td style={{ textAlign: 'center'}}><Stat>{ (totalInorrect === 0 ? 0 : (totalCorrect / totalInorrect)).toFixed(1) }</Stat></td>
        </tr>
      </Stats>
    </Root>
  )
};

export default Progress;

const Root = styled(motion.div)`
  border: 2px solid var(--ink);
  padding: 1.4rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-bottom: 2px solid var(--ink);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  margin: 0;
  font-weight: 800;
`;

const Percent = styled.h3`
  margin: 0;
  font-weight: 800;
`;

const Stats = styled.table`
  width: 100%;
`;

const DividerContainer = styled.td`
`;

const Divider = styled.div`
  border-bottom: 2px dashed var(--ink);
  margin: 0.5rem 0;
`;

const Stat = styled.p`
  margin: 0;
`;

const Difficulty = styled(Stat)`
  font-weight: 600;
`;

const WinRate = styled.div`
  display: flex;
  padding-top: 1rem;
  flex-direction: row;
  align-items: center;
`