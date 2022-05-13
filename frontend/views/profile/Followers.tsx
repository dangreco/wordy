import { useFollowers } from "@wordy/hooks";
import React from "react";
import styled from "styled-components";
import Friend from "./Friend";
import Slider from "./Slider";

interface Props {
  username: string | undefined,
}

const Followers: React.FunctionComponent<Props> = ({
  username,
}) => {
  const { followers, loading } = useFollowers(username);

  return (
    <Root>
      <Slider>
        {
          followers.map(
            (user) => (
              <Friend 
                key={user.id} 
                user={user} 
              />
            )
          )
        }
      </Slider>
    </Root>
  )
};

export default Followers;

const Root = styled.div`
`;
