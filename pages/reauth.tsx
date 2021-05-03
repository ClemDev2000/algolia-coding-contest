import { useContext, useEffect } from 'react';
import { fetchPostJSON } from '../utils/api-helpers';
import AuthCheck from '../components/AuthCheck';
import { UserContext } from '../lib/context';
import Loader from '../components/Loader';

export default function Reauth() {
  const { user } = useContext(UserContext);

  const handleGoAccount = async () => {
    try {
      const res = await fetchPostJSON(
        '/api/users/account_links',
        {},
        {
          token: await user.getIdToken(),
        }
      );
      window.location.href = res.url;
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (user) handleGoAccount();
  }, []);
  return (
    <AuthCheck>
      <Loader show />
    </AuthCheck>
  );
}
