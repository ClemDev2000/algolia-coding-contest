import { storage } from '../lib/firebase';
import { v4 as uuidv4 } from 'uuid';

export const handleUploadPhotos = (file: File, uid: string): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!file) resolve('');
    const storageRef = storage.ref();
    const path = `users/${uid}/${uuidv4()}`; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    const uploadTask = storageRef.child(path).put(file);
    uploadTask
      .then(async () => {
        const photoUrl = await storageRef.child(path).getDownloadURL();
        resolve(photoUrl);
      })
      .catch(() => {
        reject(new Error());
      });
  });
