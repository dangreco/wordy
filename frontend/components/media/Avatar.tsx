/* eslint-disable jsx-a11y/alt-text */
import { Wordy } from "@wordy/types";
import { Blurhash } from "react-blurhash";
import React from "react";
import styled from 'styled-components';
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  user: Wordy.User | undefined,
  size?: number;
}

const Avatar: React.FunctionComponent<Props> = ({
  user,
  size = 3
}) => {


  const initials = user 
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` 
    : '';

  const url = user
    ? user.photoUrl
    : undefined;

  const hash = user 
    ? user.photoBlurHash
    : undefined;

  return (
    <Root size={size}>
      {
        hash ? (
          <Hash>
            <Blurhash
              hash={hash}
              height="100%"
              width="100%"
            />
          </Hash>
        ) : null
      }
      {
        !url ? (
          <Initials size={size}>{ initials }</Initials>
        ) : null
      }
      <AnimatePresence>
        {
          url ? (
            <Image
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.5 } }}
              exit={{ opacity: 0, transition: { duration : 0 } }}
              url={url} 
            />
          ) : null
        }
      </AnimatePresence>
    </Root>
  );
};

export default Avatar;

const Root = styled.div<{ size: number }>`
  ${({ size }) => `
    width: ${size}rem;
    height: ${size}rem;
  `}
  border-radius: 50%;
  background-color: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  transition: all .25s ease-in-out;
`;

const Initials = styled.p<{ size: number }>`
  margin: 0;
  padding: 0;
  color: var(--paper);

  ${({ size }) => `
    font-size: ${size / 3}rem;
  `}
`;

const Image = styled(motion.div)<{ url: string }>`
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
  ${({ url }) => `
  background-image: url("${url}");
  `}
  position: relative;
`;

const Hash = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;