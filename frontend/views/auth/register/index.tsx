import { Wordy } from "@wordy/types";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styled from "styled-components";
import { Button, Input } from "../../../components/input";
import wordy from "../../../libs/wordy";

const Register: React.FunctionComponent = ({}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Wordy.Error | undefined>();


  const [username, setUsername] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [firstName, setFirstName] = useState<string | undefined>();
  const [lastName, setLastName] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [confirmPassword, setConfirmPassword] = useState<string | undefined>();

  const register = async () => {
    if (
      !username
      || !email
      || !firstName
      || !lastName
      || !password
      || !confirmPassword
    ) return;

    if (password !== confirmPassword) return;

    setError(undefined);
    setLoading(true);

    const {
      data,
      error,
    } = await wordy.auth.register({ 
      username, 
      password,
      email,
      firstName,
      lastName, 
    });

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
        <Heading>register</Heading>
        <Input type="text" label="Username" value={username} setValue={setUsername} />
        <Split>
          <Input type="text" label="First Name" value={firstName} setValue={setFirstName} />
          <Input type="text" label="Last Name" value={lastName} setValue={setLastName} />
        </Split>
        <Input type="email" label="Email" value={email} setValue={setEmail} />
        <Input
          type="password"
          label="Password"
          value={password}
          setValue={setPassword}
        />
        <Input
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          setValue={setConfirmPassword}
        />
        <Button onClick={register}>
          register
        </Button>
        <Button onClick={() => router.push('/login')} invert>
          want to log in?
        </Button>
        <Error visible={!!error}>{ error?.message }</Error>
      </Form>
    </Root>
  );
};

export default Register;

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

const Split = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1rem;
`;
