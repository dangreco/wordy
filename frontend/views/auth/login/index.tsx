import { Wordy } from "@wordy/types";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styled from "styled-components";
import { Button, Input } from "../../../components/input";
import wordy from "../../../libs/wordy";

const Login: React.FunctionComponent = ({}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Wordy.Error | undefined>();
  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();

  const login = async () => {
    if (!username || !password) return;
    setError(undefined);
    setLoading(true);

    const {
      data,
      error,
    } = await wordy.auth.login({ username, password });

    console.log(error);

    setLoading(false);
    setError(error);

    if (!error && data) {
      router.push('/');
    }
  };

  return (
    <Root>
      <Form>
        <Heading>Log In</Heading>
        <Input type="text" label="Username" value={username} setValue={setUsername} />
        <Input
          type="password"
          label="Password"
          value={password}
          setValue={setPassword}
        />
        <Button onClick={login}>
          Log In
        </Button>
        <Button onClick={() => router.push('/register')} invert>
          want to register?
        </Button>
        <Error visible={!!error}>{ error?.message }</Error>
      </Form>
    </Root>
  );
};

export default Login;

const Heading = styled.h1`
  width: 100%;
  margin-bottom: 3rem !important;
`;

const Root = styled.div`
  width: 100%:
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Form = styled.div`
  width: 20rem;
  max-width: 20rem;

  & > * {
    margin: 1rem 0;
  }
`;

const Error = styled.p<{ visible: boolean }>`
  text-align: center;
  width: 100%;
  transition: all .25s ease-in-out;
  ${({ visible }) => `
    opacity: ${visible ? 1.0 : 0.0};
  `}
`;
