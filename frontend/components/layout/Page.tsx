import React from "react";
import styled from "styled-components";
import { isMobile } from 'react-device-detect';
import { Header } from ".";

const Page: React.FunctionComponent = ({
  children,
}) => (
  <Root isMobile={isMobile}>
    <Header />
    { children }
  </Root>
)

export default Page;

const Root = styled.div<{ isMobile: boolean }>`
  width: 100%;
  min-height: 100vh;
  background-color: var(--paper);
  padding: 3rem;
  max-width: 1600px;
  margin: 0 auto;

  @media only screen and (max-width: 768px) {
    padding: 2rem;
  }
`;