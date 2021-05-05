import { randomBytes } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';

export async function fetchGetJSON(url: string) {
  try {
    const data = await fetch(url).then((res) => res.json());
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function fetchDeleteJSON(url: string, headers?: {}) {
  try {
    const data = await fetch(url, {
      method: 'DELETE',
      ...(headers && { headers }),
    }).then((res) => res.json());
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function fetchPostJSON(url: string, data?: {}, headers?: {}) {
  try {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data || {}), // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  } catch (err) {
    throw new Error(err.message);
  }
}

export const randomId = (idLength: number, chars?: string) => {
  chars =
    chars || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let rnd = randomBytes(idLength);
  let value = new Array(idLength);
  let len = Math.min(256, chars.length);
  let d = 256 / len;

  for (var i = 0; i < idLength; i++) {
    value[i] = chars[Math.floor(rnd[i] / d)];
  }

  return value.join('');
};

export const now = () => {
  return Math.floor(Date.now() / 1000);
};

export const getStoragePathFromUrl = (url?: string) => {
  if (!url) return '';
  let parts = url.split('%2F');
  parts[0] = parts[0].split('/o/')[1];
  parts[parts.length - 1] = parts[parts.length - 1].split('?alt=')[0];
  return parts.join('/');
};

export const authentication = async (
  req: NextApiRequest,
  auth: any,
  firestore: any
) => {
  let user: IUser | undefined;
  let error: string | undefined;
  try {
    const { uid } = await auth.verifyIdToken(req.headers.token as string, true);
    user = (await firestore.doc(`users/${uid}`).get()).data() as IUser;
  } catch (err) {
    error = err.message;
  } finally {
    return { user, error };
  }
};
