import { useUser } from "@wordy/hooks";
import { NextPage } from "next";
import Profile from "views/profile";

const Me: NextPage = () => {
  const { user } = useUser(); 

  return (
    <Profile username={"dangreco"}/>
  )
};

export default Me;