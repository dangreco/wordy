import { Button } from "@components/input";
import Intro from "@components/intro";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

const Landing: React.FunctionComponent = () => {
  return (
    <Root>
      <Intro />
      <PlayNow>
        <Link href="/login">
          <a>
            <Button>Play Now</Button>   
          </a>
        </Link>
      </PlayNow>
    </Root>
  );
};

export default Landing;

const PlayNow = styled.div`
  width: 10rem;
  margin-top: 2rem;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
