import Link from "next/link";
import React, { useContext } from "react";
import { isMobile } from 'react-device-detect';
import styled from "styled-components";
import { LocaleContext } from "../../libs/wordy/contexts";
import { useUser } from "../../libs/wordy/hooks";
import { Avatar } from "../media";

const Header: React.FunctionComponent = () => {
  const locale = useContext(LocaleContext);
  const { user } = useUser();

  return (
    <Root>
      <Link passHref href="/">
        <a>
          <Logo>wordy</Logo>
        </a>
      </Link>
      <Right>
              {/* <a href="/foo">{locale}</a> */}
                {
                  user ? (
                  <Link passHref href={`/user/${user.username}`}>
                    <a>
                      <Avatar
                        user={user}
                      />
                    </a>
                  </Link>
                ) : (
                  <Link passHref href="/login">
                    <a>
                      log in
                    </a>
                  </Link>
                )
              }
      </Right>
    </Root>
  );
};

export default Header;

const Root = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr  1fr;
  align-items: center;
  margin: 0 auto;
  margin-bottom: 3rem;
`;

const Logo = styled.h1`
  margin: 0;
  padding: 0;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  & > * {
    margin-left: 2rem;
    font-weight: 600;
  }
`;

const Left = styled(Buttons)`
  justify-content: flex-start;
`;

const Right = styled(Buttons)`
  justify-content: flex-end;
`;