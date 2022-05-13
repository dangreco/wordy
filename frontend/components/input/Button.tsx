import React, { useState } from 'react';
import styled from 'styled-components';

interface Props {
  onClick?: () => void;
  invert?: boolean;
}

const Button: React.FunctionComponent<Props> = ({
  onClick = () => {},
  invert = false,
  children,
}) => {
  return (
    <Root onClick={onClick} invert={invert}>
      { children }
    </Root>
  )
};

export default Button;

const Root = styled.div<{ invert: boolean }>`
  height: 100%;
  max-height: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid var(--ink);
  transition: all .25s ease-in-out;

  ${({ invert }) => `
    background-color: var(--${invert ? 'paper' : 'ink'});
    color: var(--${invert ? 'ink' : 'paper'});

    &:hover {
      background-color: var(--${invert ? 'ink' : 'paper'});
      color: var(--${invert ? 'paper' : 'ink'});
    }
  `}
`;