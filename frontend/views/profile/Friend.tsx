import { Avatar } from "@components/media";
import { Wordy } from "@wordy/types";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

interface Props {
  user?: Wordy.User;
  loading?: boolean;
}

const Friend: React.FunctionComponent<Props> = ({ user, loading }) => {
  const router = useRouter();

  const onClick = loading || !user
    ? () => {}
    : () => router.push(`/user/${user?.username}`)

  const initials = loading || !user
    ? ''
    : user?.firstName[0] + user?.lastName[0]

  const name = loading || !user
    ? ''
    : `${user.firstName} ${user.lastName}`
  
  const username = loading || !user
    ? ''
    : '@' + user.username;

  return (
    <Root 
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <Avatar size={4} user={user} />
      <Name>{ name }</Name>
      <Username>{ username }</Username>
    </Root>
  );
};

export default Friend;

const Root = styled(motion.div)`
  padding: 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Name = styled.h3`
  margin: 0;
  margin-top: 1rem;
`;

const Username = styled.small`
  margin: 0;
  margin-top: 0.25rem;
`;
