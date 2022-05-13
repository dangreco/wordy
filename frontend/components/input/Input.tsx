import React, { useState } from 'react';
import styled from 'styled-components';

interface Props {
  type?: string;
  label: string;
  big?: boolean;
  placeholder?: string;
  value: string | undefined;
  setValue(v: string | undefined): void;
}

const Input: React.FunctionComponent<Props> = ({
  type = 'text',
  label,
  placeholder,
  value,
  setValue,
  big = false,
}) => {
  const [hidden, setHidden] = useState(type === 'password');

  return (
    <Root big={big}>
      <Label big={big}>{ label }</Label>
      <input
        type={type}
        value={value}
        placeholder={placeholder || ''}
        onChange={(e) => setValue(e.target.value)}
      />
    </Root>
  )
};

export default Input;

const Root = styled.div<{ big: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;

  & > * {
    width: 100%;
    display: block;
  }

  & input {
    background: none !important; 
    background-color: transparent !important;
    
    border: 2px solid var(--ink);
    outline: none;
    height: 3rem;
    padding: 0 0.75rem;
    font-size: 1rem;
    font-family: inherit;
    border: 2px solid var(--ink);
  }

`;

const Label = styled.label<{ big: boolean }>`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;