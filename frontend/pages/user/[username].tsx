import { NextPage } from "next";
import { useRouter } from "next/router";
import Profile from "views/profile";

const Me: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;

  return (
    <Profile username={username as string}/>
  )
};

export default Me;