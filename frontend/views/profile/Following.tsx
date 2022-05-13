import { useFollowing } from "@wordy/hooks";
import React from "react";
import styled from "styled-components";
import Friend from "./Friend";
import Slider from "./Slider";

interface Props {
  username: string | undefined,
}

const Following: React.FunctionComponent<Props> = ({
  username,
}) => {
  const { following, loading } = useFollowing(username);

  return (
    <Root visible={following.length > 0}>
      <Slider>
        {
          following.map(
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

export default Following;

const Root = styled.div<{ visible: boolean }>`
  
`;
