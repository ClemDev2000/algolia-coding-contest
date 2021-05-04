import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import Loader from '../components/Loader';
import { UserContext } from '../lib/context';
import { auth } from '../lib/firebase';

export default function Logout() {
  const router = useRouter();
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (user) {
      auth.signOut();
      router.push('/');
      window.location.reload();
    } else router.push('/');
  }, [user]);
  return <Loader show />;
}
