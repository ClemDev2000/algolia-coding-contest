import { NextApiRequest, NextApiResponse } from 'next';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2020-08-27',
});

import algoliasearch from 'algoliasearch';
const client = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_SECRET_KEY!
);
const indexProducts = client.initIndex(process.env.INDEX_PRODUCTS!);

import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const firestore = admin.firestore();
const auth = admin.auth();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      let user: IUser;
      try {
        const { uid } = await auth.verifyIdToken(
          req.headers.token as string,
          true
        );
        user = (await firestore.doc(`users/${uid}`).get()).data() as IUser;
      } catch (error) {
        return res.status(401).json({ error: error.message });
      }

      const doc = await firestore.doc(`users/${user.id}/products/${id}`).get();
      const product = doc.data() as IProduct;

      const promises = [];

      promises.push(
        stripe.products.update(product.stripe.productId, {
          active: false,
        })
      );
      promises.push(
        stripe.prices.update(product.stripe.priceId, {
          active: false,
        })
      );
      promises.push(indexProducts.deleteObject(product.objectID));
      promises.push(firestore.doc(`users/${user.id}/products/${id}`).delete());

      await Promise.all(promises);

      res.status(200).json({
        objectID: product.objectID,
        deleted: true,
      });
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { id } = req.query;
      const { name, description, photoUrl, categorylvl0 } = req.body;

      let user: IUser;
      try {
        const { uid } = await auth.verifyIdToken(
          req.headers.token as string,
          true
        );
        user = (await firestore.doc(`users/${uid}`).get()).data() as IUser;
      } catch (error) {
        return res.status(401).json({ error: error.message });
      }

      const doc = await firestore.doc(`users/${user.id}/products/${id}`).get();
      const product = doc.data() as IProduct;

      const promises = [];

      promises.push(
        stripe.products.update(product.objectID, {
          ...(description && { description }),
          ...(name && { name }),
          ...(photoUrl && { images: [photoUrl] }),
        })
      );

      promises.push(
        indexProducts.partialUpdateObject({
          objectID: product.objectID,
          ...(description && { description }),
          ...(name && { name }),
          ...(photoUrl && { photoUrl }),
          ...(categorylvl0 && {
            categories: {
              lvl0: categorylvl0,
            },
          }),
        })
      );

      promises.push(
        firestore
          .doc(`users/${product.user.id}/products/${product.objectID}`)
          .update({
            ...(description && { description }),
            ...(name && { name }),
            ...(photoUrl && { photoUrl }),
            ...(categorylvl0 && {
              categories: {
                lvl0: categorylvl0,
              },
            }),
          })
      );

      await Promise.all(promises);

      res.status(200).json({
        objectID: product.objectID,
        success: true,
      });
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST,DELETE');
    res.status(405).end('Method Not Allowed');
  }
}
