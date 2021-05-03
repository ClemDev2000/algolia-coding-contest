import React, { createContext } from 'react';
import firebase from 'firebase/app';
export const UserContext = createContext({
  user: null as firebase.User | null,
  userdata: null as IUser | null,
});
export const RefreshContext = createContext({
  refresh: false,
  setRefresh: null as React.Dispatch<React.SetStateAction<boolean>> | null,
});
