import { useUser } from '@wordy/hooks';
import Dashboard from './dashboard';
import Landing from './landing';

const Home = () => {
  
  const { user } = useUser();

  return (
    user
      ? <Dashboard />
      : <Landing />
  )
}

export default Home;
