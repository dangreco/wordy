import { AvatarUpdater, Button, Input } from "@components/input";
import wordy from "@wordy";
import { useLanguages, useProgression, useUser } from "@wordy/hooks";
import { useUserStore } from "@wordy/store";
import { AnimatePresence, motion } from "framer-motion";
import React, {useEffect, useState } from "react";
import styled from "styled-components";
import Followers from "./Followers";
import Following from "./Following";
import Progress from "./Progress";

interface Props {
  username: string | undefined;
}

const Profile: React.FunctionComponent<Props> = ({ username }) => {
  const { setUser, user: me } = useUserStore();
  const { user } = useUser(username);
  const { progression } = useProgression(username);
  const { languages } = useLanguages();

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState<string | undefined>();
  const [lastName, setLastName] = useState<string | undefined>();

  const myProfile = me?.id === user?.id;

  useEffect(() => {
    setEditing((e) => myProfile ? e : false);
  }, [myProfile]);

  useEffect(() => {
    if (!editing) return;

    setFirstName(user?.firstName),
    setLastName(user?.lastName);
  }, [user, editing]);

  const save = async () => {

    const {
      data,
      error,
    } = await wordy.user.me.update({
      firstName: firstName?.trim().toLowerCase(),
      lastName: lastName?.trim().toLowerCase(),
    })

    if (!error && data) setUser(data);

    setEditing(false);
  };

  return (
    <Root>
      <Header>
        <AvatarUpdater
          isMe={myProfile}
          user={user}
          size={myProfile ? 8 : 6}
          canEdit={editing}
        />
        <Info>
          {
            editing ? (
              <Inputs>
                <Input 
                  big={true}
                  label="first name"
                  type="text"
                  value={firstName}
                  setValue={setFirstName}
                />
                <Input 
                  big={true}
                  label="last name"
                  type="text"
                  value={lastName}
                  setValue={setLastName} />
              </Inputs>
            ) : (
              <Name>
                {(myProfile ? me : user)?.firstName} {(myProfile ? me : user)?.lastName}
              </Name>
            )
          }
          <Username>@{ username }</Username>
          {
              myProfile ? (
                <Edit>
                  <Button 
                    invert={!editing} 
                    onClick={editing ? save : () => setEditing(e => !e)}
                  >
                    { editing ? "Done" : "Edit" }
                  </Button>
                </Edit>
              ) : null
            }
        </Info>
        
      </Header>
     
      <h2>followers &middot; {user?.followers ?? ''}</h2>

      <Followers username={username} />

      <h2>following &middot; {user?.following ?? ''}</h2>

      <Following username={username} />

      <h2>progress</h2>
      <Progression>
        <AnimatePresence>
        {progression && languages
          ? Object.entries(progression).map(([language, progress]) => (
              <Progress
                key={language}
                language={language}
                stats={languages[language]}
                progress={progress}
              />
            ))
          : null}
        </AnimatePresence>
      </Progression>
    </Root>
  );
};

export default Profile;


const Root = styled.div``;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Name = styled.h1`
  margin: 0;
  margin-right: 1.5rem;
`;
const Username = styled.h3`
  margin: 0;
  font-weight: normal;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 3rem;

  & > *:first-child {
    margin-right: 2rem;
  }

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    text-align: center;

    & * {
      margin: 0.2rem 0 !important;
    }
  }
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Edit = styled.div`
  width: 100%;
  margin-top: 1rem;
  height: 2.4rem;

  @media only screen and (max-width: 768px) {
    margin-top: 1.4rem !important; 
  }
  
`;

const Progression = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1em;
`;