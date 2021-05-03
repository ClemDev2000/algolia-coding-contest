import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCJbqLHjkaQFK82pBFy1aHVkc1TXE5Zq5A',
  authDomain: 'localz-djlcf2.firebaseapp.com',
  projectId: 'localz-djlcf2',
  storageBucket: 'localz-djlcf2.appspot.com',
  messagingSenderId: '318110743925',
  appId: '1:318110743925:web:0d88eee2a254cb017aa73c',
  measurementId: 'G-115RRFJZQD',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Auth exports
export const auth = firebase.auth();
export const authCredential = firebase.auth.EmailAuthProvider.credential;

// Storage exports
export const storage = firebase.storage();

// Firestore exports
export const firestore = firebase.firestore();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const increment = firebase.firestore.FieldValue.increment;
export const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
export const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
export const fieldDelete = firebase.firestore.FieldValue.delete;

// Helper functions

/**
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc: firebase.firestore.DocumentSnapshot) {
  const data = doc.data();
  return data;
}
