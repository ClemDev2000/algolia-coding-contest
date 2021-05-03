import { auth, firestore } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';

// Custom hook to read auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [userdata, setUserdata] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = firestore.doc(`users/${user.uid}`);
      unsubscribe = ref.onSnapshot((doc) => {
        setUserdata(doc.data());
      });
    } else {
      setUserdata(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, userdata };
}

export function useRefreshAlgolia() {
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setRefresh(false);
  }, [refresh]);

  return { refresh, setRefresh };
}
